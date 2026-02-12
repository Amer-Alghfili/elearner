import React from "react";
import { SidebarLink, SidebarLinksGroup } from "../client";
import { FolderIcon } from "@/components/Icons";
import { v4 } from "uuid";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Button, Flex, Image, Input } from "@chakra-ui/react";
import {
  createFolder,
  createResource,
  removeResource,
  renameFolder,
} from "./actions";
import { toaster } from "@/components/ui/toaster";
import RemoveButton from "@/components/button/remove";
import MenuContext from "@/components/MenuContext";

export type Resource = {
  id: string;
  title: string;
  icon: string | null;
  content: string | Resource[];
  indexPath: number[];
  parentResourceId: number | null;
};

export function Resources(props: { resources: Resource[]; learnId: number }) {
  const { learnId } = props;

  const [resources, setResources] = React.useState<Resource[]>(props.resources);
  const [optimistic, setOptimistic] =
    React.useOptimistic<Resource[]>(resources);

  const [updatingId, setUpdatingId] = React.useState<number[] | null>(null);

  const [websiteForm, setWebsiteForm] = React.useState<{
    open: boolean;
    indexPath?: number[];
    parentResource: number | null;
  }>({ open: false, parentResource: null });

  function addWebsite(url: string, title: string, icon: string | null) {
    const newResource: Resource = {
      id: v4(),
      title,
      icon,
      content: url,
      indexPath: websiteForm.indexPath || [],
      parentResourceId: websiteForm.parentResource,
    };

    function mapResources(resource: Resource): Resource {
      if (typeof resource.content === "string") return resource;

      const folderMatched =
        websiteForm.indexPath?.length === resource.indexPath.length &&
        websiteForm.indexPath?.every((v, i) => v === resource.indexPath[i]);

      if (folderMatched && websiteForm.parentResource === Number(resource.id)) {
        return {
          ...resource,
          content: [...resource.content.map(mapResources), newResource],
        };
      }

      return {
        ...resource,
        content: resource.content.map(mapResources),
      };
    }
    const updated =
      websiteForm.parentResource == null
        ? [...resources, newResource]
        : resources.map(mapResources);

    setResources(updated);
    setOptimistic(updated);
  }

  function nestResource(
    resource: Resource,
    indexPath: number[] = []
  ): Resource[] {
    const updated = structuredClone(resources);

    // add folder at root-level
    if (indexPath.length === 0) {
      updated.push({
        ...resource,
        indexPath: [],
      });
    } else {
      let parent = updated;
      let parentResourceId: number | null = null;
      for (const i of indexPath) {
        parentResourceId = Number(parent[i].id);
        parent = parent[i].content as Resource[];
      }

      parent.push({
        ...resource,
        indexPath,
        parentResourceId,
      });
    }

    return updated;
  }

  async function addFolder(indexPath: number[] = []) {
    React.startTransition(async () => {
      const updated = nestResource(
        {
          id: v4(),
          title: "untitled",
          icon: null,
          content: [],
          // will be override
          indexPath,
          // will be override
          parentResourceId: null,
        },
        indexPath
      );
      setOptimistic(updated);

      try {
        let parentId: number | null = null;
        if (indexPath.length > 0) {
          let lastParent = resources[indexPath[0]];

          if (lastParent) {
            for (let i = 1; i < indexPath.length; i++) {
              const current = lastParent.content[indexPath[i]];
              if (typeof current === "string")
                throw Error("Invalid index path");

              lastParent = current;
            }

            parentId = Number(lastParent.id);
          }
        }

        const { id } = await createFolder(learnId, parentId);

        const updated = nestResource(
          {
            id: id.toString(),
            title: "untitled",
            icon: null,
            content: [],
            // will be override
            indexPath,
            // will be override
            parentResourceId: null,
          },
          indexPath
        );
        setResources(updated);
      } catch (err: any) {
        toaster.create({
          title: err.message,
          type: "error",
          closable: true,
        });
      }
    });
  }

  async function renameFolderAction(formData: FormData) {
    const resourcesUpdater = (resources: Resource[]) =>
      resources.map(function mapResources(resource, index): Resource {
        const currentIndexPath = [...resource.indexPath, index];

        const found = (updatingId as []).every(
          (value, index) => Number(value) === currentIndexPath[index]
        );

        if (found) {
          return {
            ...resource,
            title: formData.get("title") as string,
          };
        }

        if (typeof resource.content === "string") return resource;

        return {
          ...resource,
          content: resource.content.map(mapResources),
        };
      });

    setOptimistic(resourcesUpdater);

    try {
      await renameFolder(formData);

      setResources(resourcesUpdater);
      setUpdatingId(null);
    } catch (err: any) {
      toaster.create({
        title: err.message,
        type: "error",
        closable: true,
      });
    }
  }

  async function removeAction(path: number[], formData: FormData) {
    const update = (resources: Resource[]) => {
      return resources
        .map(function mapResource(resource, index): Resource | null {
          const currentIndexPath = [...resource.indexPath, index];

          const found =
            path.length === currentIndexPath.length &&
            path.every((v, i) => v === currentIndexPath[i]);

          if (found) return null;

          if (typeof resource.content === "string") return resource;

          return {
            ...resource,
            content: resource.content
              .map(mapResource)
              .filter(Boolean) as Resource[],
          };
        })
        .filter(Boolean);
    };
    setOptimistic(update(optimistic) as Resource[]);

    try {
      await removeResource(formData);
      setResources(update(resources) as Resource[]);
    } catch (err: any) {
      toaster.create({
        title: err.message,
        type: "error",
        closable: true,
      });
    }
  }

  return (
    <>
      <SidebarLinksGroup
        icon={<FolderIcon fill="text.secondary" />}
        subLinks={optimistic.map(function mapToSidebarItem(
          resource,
          index
        ): React.ReactNode {
          if (typeof resource.content === "string") {
            const icon = resource.icon && (
              <Image w="1.2rem" h="1.2rem" src={resource.icon} alt="favicon" />
            );

            return (
              <SidebarLink
                key={resource.id}
                href={resource.content}
                icon={icon}
              >
                <MenuContext
                  list={[
                    {
                      value: "remove-website",
                      closeOnSelect: false,
                      children: (
                        <RemoveFolder
                          id={Number(resource.id)}
                          onRemove={(formData) =>
                            removeAction(
                              [...resource.indexPath, index],
                              formData
                            )
                          }
                        />
                      ),
                    },
                  ]}
                >
                  {resource.title}
                </MenuContext>
              </SidebarLink>
            );
          }

          const currentIndexPath = [...resource.indexPath, index];

          return (
            <SidebarLinksGroup
              key={resource.id}
              showArrows={false}
              subLinks={(resource.content || []).map(mapToSidebarItem)}
            >
              <SidebarLink>
                <Flex gap="0.5em" alignItems="center">
                  <FolderIcon stroke="text.secondary" />
                  {updatingId != null &&
                  updatingId.length === currentIndexPath.length &&
                  updatingId.every((v, i) => v === currentIndexPath[i]) ? (
                    <form action={renameFolderAction}>
                      <Input
                        defaultValue={resource.title}
                        id="title"
                        name="title"
                        w="full"
                        textStyle="sm-semibold"
                        textDecoration="none"
                        outline="none"
                        p={0}
                        h="auto"
                        border="none"
                        bg="transparent"
                        borderRadius="8px"
                      />
                      <Input
                        defaultValue={resource.id}
                        id="id"
                        name="id"
                        hidden={true}
                      />
                      <Button type="submit" hidden={true} />
                    </form>
                  ) : (
                    <MenuContext
                      triggerProps={{
                        onDoubleClick: () =>
                          setUpdatingId([...resource.indexPath, index]),
                      }}
                      list={[
                        {
                          value: "add-website",
                          onClick: () =>
                            setWebsiteForm({
                              open: true,
                              indexPath: resource.indexPath,
                              parentResource: Number(resource.id),
                            }),
                          children: "New Website",
                        },
                        {
                          value: "add-folder",
                          onClick: (e) => {
                            e.preventDefault();
                            addFolder([
                              ...(resource.indexPath as number[]),
                              index,
                            ]);
                          },
                          children: "New Folder",
                        },
                        {
                          value: "remove-folder",
                          closeOnSelect: false,
                          children: (
                            <RemoveFolder
                              id={Number(resource.id)}
                              onRemove={(formData) =>
                                removeAction(
                                  [...resource.indexPath, index],
                                  formData
                                )
                              }
                            />
                          ),
                        },
                      ]}
                    >
                      {resource.title}
                    </MenuContext>
                  )}
                </Flex>
              </SidebarLink>
            </SidebarLinksGroup>
          );
        })}
      >
        <MenuContext
          list={[
            {
              value: "add-website",
              onClick: () =>
                setWebsiteForm({
                  open: true,
                  indexPath: [],
                  parentResource: null,
                }),
              children: "New Website",
            },
            {
              value: "add-folder",
              onClick: (e) => {
                e.preventDefault();
                addFolder();
              },
              children: "New Folder",
            },
          ]}
        >
          Resources
        </MenuContext>
      </SidebarLinksGroup>
      <AddWebsiteDialog
        key={JSON.stringify(websiteForm)}
        learnId={learnId}
        parentResource={websiteForm.parentResource as number | null}
        open={websiteForm.open}
        onClose={() =>
          setWebsiteForm({
            open: false,
            indexPath: undefined,
            parentResource: null,
          })
        }
        onAdd={addWebsite}
      />
    </>
  );
}

function AddWebsiteDialog({
  learnId,
  open,
  parentResource,
  onClose,
  onAdd,
}: {
  learnId: number;
  open: boolean;
  parentResource: number | null;
  onClose: VoidFunction;
  onAdd: (url: string, title: string, icon: string | null) => void;
}) {
  const [state, action, loading] = React.useActionState(
    createResource,
    undefined
  );

  const handleSubmission = React.useEffectEvent((s: typeof state) => {
    if (s == null) return;

    if (s.error) {
      toaster.create({
        title: s.error,
        type: "error",
        closable: true,
      });
    } else if (s.data) {
      onAdd(s.data.url, s.data.title, s.data.icon);
      onClose();
    }
  });

  React.useEffect(() => {
    handleSubmission(state);
  }, [state]);

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => !open && onClose()}>
      <DialogContent>
        <form action={action}>
          <DialogHeader>
            <Field label="URL">
              <Input
                id="link"
                name="link"
                size="sm"
                placeholder="e.g https://www.example.com"
              />
            </Field>
            <Input id="learnId" name="learnId" hidden={true} value={learnId} />
            {parentResource != null && (
              <Input
                id="parentResource"
                name="parentResource"
                hidden={true}
                value={parentResource}
              />
            )}
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={loading} type="submit">
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

function RemoveFolder({
  id,
  onRemove,
}: {
  id: number;
  onRemove: (formData: FormData) => void;
}) {
  return (
    <RemoveButton showIcon={false} content="Remove Folder">
      <form action={onRemove} onClick={(e) => e.stopPropagation()}>
        <Input id="id" name="id" value={id} hidden={true} readOnly={true} />
        <Button type="submit" bg="feedback.error">
          Delete
        </Button>
      </form>
    </RemoveButton>
  );
}

// function IconField() {
//   const { control } = useFormContext<WebsiteForm>();

//   const { field } = useController({ name: "favicon", control });

//   const content = field.value != null && (
//     <img src={field.value} alt="link faveicon" />
//   );

//   return (
//     <MenuRoot>
//       <MenuTrigger>{content}</MenuTrigger>
//       <MenuContent portalled={false}>
//         <EmojiPicker
//           skinTonesDisabled={true}
//           previewConfig={{
//             defaultEmoji: field.value || "",
//             showPreview: false,
//           }}
//           onEmojiClick={(emoji) => field.onChange(emoji.emoji)}
//         />
//       </MenuContent>
//     </MenuRoot>
//   );
// }

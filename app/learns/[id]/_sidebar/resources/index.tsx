import React from "react";
import { SidebarLink, SidebarLinkContent, SidebarLinksGroup } from "../client";
import { FolderIcon } from "@/components/Icons";
import { v4 } from "uuid";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputProps,
  Stack,
} from "@chakra-ui/react";
import {
  updateIcon,
  createFolder,
  createResource,
  deleteResource,
  rename,
} from "./actions";
import { toaster } from "@/components/ui/toaster";
import RemoveButton from "@/components/button/remove";
import MenuContext from "@/components/MenuContext";
import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import EmojiPicker from "emoji-picker-react";

export type Resource = {
  id: string;
  title: string;
  icon: string | null;
  favicon: string | null;
  content: string | Resource[];
  indexPath: number[];
  parentResourceId: number | null;
};

export function Resources(props: { resources: Resource[]; learnId: number }) {
  const { learnId } = props;

  const [resources, setResources] = React.useState<Resource[]>(props.resources);
  const [optimistic, setOptimistic] =
    React.useOptimistic<Resource[]>(resources);

  const [renamingId, setRenamingId] = React.useState<number[] | null>(null);
  // const [changingIconId, setChangingIconId] = React.useState<number[] | null>(
  //   null
  // );

  const [websiteForm, setWebsiteForm] = React.useState<{
    open: boolean;
    indexPath?: number[];
    parentResource: number | null;
  }>({ open: false, parentResource: null });

  function addWebsite(newResource: Resource) {
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
          favicon: null,
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
            favicon: null,
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

  async function renameAction(formData: FormData) {
    const resourcesUpdater = (resources: Resource[]) =>
      resources.map(function mapResources(resource, index): Resource {
        const currentIndexPath = [...resource.indexPath, index];

        const found = (renamingId as []).every(
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
      await rename(formData);

      setResources(resourcesUpdater);
      setRenamingId(null);
    } catch (err: any) {
      toaster.create({
        title: err.message,
        type: "error",
        closable: true,
      });
    }
  }

  // async function changeIconAction(id: string, icon: string | null) {
  //   const resourcesUpdater = (resources: Resource[]) =>
  //     resources.map(function mapResources(resource, index): Resource {
  //       const currentIndexPath = [...resource.indexPath, index];

  //       const found = (changingIconId as []).every(
  //         (value, index) => Number(value) === currentIndexPath[index]
  //       );

  //       if (found) {
  //         return {
  //           ...resource,
  //           icon,
  //         };
  //       }

  //       if (typeof resource.content === "string") return resource;

  //       return {
  //         ...resource,
  //         content: resource.content.map(mapResources),
  //       };
  //     });

  //   React.startTransition(async () => {
  //     setOptimistic(resourcesUpdater);

  //     try {
  //       await updateIcon(id, icon);

  //       setResources(resourcesUpdater);
  //       setChangingIconId(null);
  //     } catch (err: any) {
  //       toaster.create({
  //         title: err.message,
  //         type: "error",
  //         closable: true,
  //       });
  //     }
  //   });
  // }

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
      await deleteResource(formData);
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
          const currentIndexPath = [...resource.indexPath, index];

          const rename =
            renamingId != null &&
            renamingId.length === currentIndexPath.length &&
            renamingId.every((v, i) => v === currentIndexPath[i]);

          if (typeof resource.content === "string") {
            // const changeIcon =
            //   changingIconId != null &&
            //   changingIconId.length === currentIndexPath.length &&
            //   changingIconId.every((v, i) => v === currentIndexPath[i]);

            const icon =
              resource.icon == null &&
              resource.favicon == null ? null : resource.icon ==
                resource.favicon ? (
                <Image
                  w="1rem"
                  h="1rem"
                  src={resource.icon as string}
                  alt="favicon"
                />
              ) : (
                <Box fontSize="1rem">{resource.icon}</Box>
              );

            return rename ? (
              <Rename
                id={resource.id}
                value={resource.title}
                onRename={renameAction}
                ps="1em"
              />
            ) : (
              <MenuContext
                key={resource.id}
                list={[
                  {
                    value: "rename-website",
                    children: "Rename",
                    onClick: () => setRenamingId(currentIndexPath),
                  },
                  // {
                  //   value: "change-icon",
                  //   children: (
                  //     <MenuRoot
                  //       open={changeIcon}
                  //       onInteractOutside={() => setChangingIconId(null)}
                  //     >
                  //       <MenuTrigger>Change Icon</MenuTrigger>
                  //       <MenuContent>
                  //         <IconPicker
                  //           icon={resource.icon}
                  //           favicon={resource.favicon}
                  //           onChange={(emoji) =>
                  //             changeIconAction(resource.id, emoji)
                  //           }
                  //         />
                  //       </MenuContent>
                  //     </MenuRoot>
                  //   ),
                  //   closeOnSelect: false,
                  //   onClick: () => setChangingIconId(currentIndexPath),
                  // },
                  {
                    value: "remove-website",
                    closeOnSelect: false,
                    children: (
                      <Remove
                        id={Number(resource.id)}
                        onRemove={(formData) =>
                          removeAction([...resource.indexPath, index], formData)
                        }
                      >
                        Remove
                      </Remove>
                    ),
                  },
                ]}
              >
                <SidebarLink href={resource.content}>
                  <SidebarLinkContent
                    icon={icon}
                    alignItems={
                      resource.icon == resource.favicon ? "center" : "baseline"
                    }
                  >
                    {resource.title}
                  </SidebarLinkContent>
                </SidebarLink>
              </MenuContext>
            );
          }

          return (
            <SidebarLinksGroup
              key={resource.id}
              showArrows={false}
              subLinks={(resource.content || []).map(mapToSidebarItem)}
            >
              {rename ? (
                <Rename
                  id={resource.id}
                  value={resource.title}
                  onRename={renameAction}
                />
              ) : (
                <MenuContext
                  triggerProps={{ w: "full" }}
                  list={[
                    {
                      value: "rename-folder",
                      children: "Rename",
                      onClick: () => setRenamingId(currentIndexPath),
                    },
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
                        addFolder([...(resource.indexPath as number[]), index]);
                      },
                      children: "New Folder",
                    },
                    {
                      value: "remove-folder",
                      closeOnSelect: false,
                      children: (
                        <Remove
                          id={Number(resource.id)}
                          onRemove={(formData) =>
                            removeAction(
                              [...resource.indexPath, index],
                              formData
                            )
                          }
                        >
                          Remove
                        </Remove>
                      ),
                    },
                  ]}
                >
                  <SidebarLink>
                    <SidebarLinkContent
                      icon={<FolderIcon stroke="text.secondary" />}
                    >
                      {resource.title}
                    </SidebarLinkContent>
                  </SidebarLink>
                </MenuContext>
              )}
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
        indexPath={websiteForm.indexPath || []}
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
  indexPath,
  parentResource,
  onClose,
  onAdd,
}: {
  learnId: number;
  open: boolean;
  indexPath: number[];
  parentResource: number | null;
  onClose: VoidFunction;
  onAdd: (resource: Resource) => void;
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
      const { data } = s;

      onAdd({
        ...data,
        id: data.id.toString(),
        content: data.link as string,
        parentResourceId: parentResource,
        indexPath,
        icon: data.icon,
      });
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

function Remove({
  id,
  onRemove,
  children,
}: {
  id: number;
  onRemove: (formData: FormData) => void;
  children: React.ReactNode;
}) {
  return (
    <RemoveButton showIcon={false} content={children}>
      <form action={onRemove} onClick={(e) => e.stopPropagation()}>
        <Input id="id" name="id" value={id} hidden={true} readOnly={true} />
        <Button type="submit" bg="feedback.error">
          Delete
        </Button>
      </form>
    </RemoveButton>
  );
}

function Rename({
  id,
  value,
  onRename,
  ...props
}: {
  id: string;
  value: string;
  onRename: (formData: FormData) => void;
} & InputProps) {
  const ref = React.useCallback((ref: HTMLInputElement) => {
    if (ref) {
      ref.select();
    }
  }, []);

  return (
    <form action={onRename}>
      <Input
        ref={ref}
        defaultValue={value}
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
        {...props}
      />
      <Input defaultValue={id} id="id" name="id" hidden={true} />
      <Button type="submit" hidden={true} />
    </form>
  );
}

function IconPicker({
  icon,
  favicon,
  onChange,
}: {
  icon: string | null;
  favicon: string | null;
  onChange: (emoji: string | null) => void;
}) {
  const isFavicon = icon === favicon;

  return (
    <Stack>
      <Flex ps="0.5em" gap="0.5em">
        <Button
          variant="plain"
          onClick={() => onChange(null)}
          color="feedback.error"
          _hover={{ bg: "accent.softCoral.transparent" }}
          px="0.5em"
          fontSize="0.8rem"
        >
          Remove
        </Button>
        <Button
          variant="plain"
          onClick={() => onChange(favicon)}
          _hover={{ bg: "stroke.transparent" }}
          px="0.5em"
          fontSize="0.8rem"
        >
          Reset to default
        </Button>
      </Flex>
      <EmojiPicker
        lazyLoadEmojis={false}
        skinTonesDisabled={true}
        previewConfig={{
          defaultEmoji: isFavicon ? "" : icon || "",
          showPreview: false,
        }}
        onEmojiClick={({ emoji }) => onChange(emoji)}
      />
    </Stack>
  );
}

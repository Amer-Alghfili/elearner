import React from "react";
import { SidebarLink, SidebarLinksGroup } from "../client";
import { FolderIcon } from "@/components/Icons";
import {
  MenuContent,
  MenuContextTrigger,
  MenuItem,
  MenuRoot,
} from "@/components/ui/menu";
import { v4 } from "uuid";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Box, Button, Flex, Image, Input } from "@chakra-ui/react";
import { createFolder, createTopLevelResource, renameFolder } from "./actions";
import { toaster } from "@/components/ui/toaster";

export type Resource = {
  id: string;
  title: string;
  icon: string | null;
  content: string | Resource[];
  indexPath: number[];
};

export function Resources(props: { resources: Resource[]; learnId: number }) {
  const { learnId } = props;

  const [resources, setResources] = React.useState<Resource[]>(props.resources);
  const [optimistic, setOptimistic] =
    React.useOptimistic<Resource[]>(resources);

  const [updatingId, setUpdatingId] = React.useState<number[] | null>(null);

  const [websiteFormOpen, setWebsiteFormOpen] = React.useState<boolean>(false);

  function addWebsite(url: string, title: string, icon: string | null) {
    const newResource = {
      id: v4(),
      title: title,
      icon,
      content: url,
      indexPath: [resources.length],
    };

    setResources((resources) => [...resources, newResource]);
    setOptimistic((resources) => [...resources, newResource]);
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
      for (const i of indexPath) {
        parent = parent[i].content as Resource[];
      }

      parent.push({
        ...resource,
        indexPath,
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
              <SidebarLink key={resource.id} href={resource.content}>
                {icon}
                {resource.title}
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
                    <MenuRoot>
                      <MenuContextTrigger
                        onDoubleClick={() =>
                          setUpdatingId([...resource.indexPath, index])
                        }
                      >
                        {resource.title}
                      </MenuContextTrigger>
                      <MenuContent>
                        <MenuItem
                          value="add-website"
                          onClick={() => setWebsiteFormOpen(true)}
                        >
                          New Website
                        </MenuItem>
                        <MenuItem
                          value="add-folder"
                          onClick={(e) => {
                            e.preventDefault();
                            addFolder([
                              ...(resource.indexPath as number[]),
                              index,
                            ]);
                          }}
                        >
                          New Folder
                        </MenuItem>
                      </MenuContent>
                    </MenuRoot>
                  )}
                </Flex>
              </SidebarLink>
            </SidebarLinksGroup>
          );
        })}
      >
        <MenuRoot>
          <MenuContextTrigger>Resources</MenuContextTrigger>
          <MenuContent>
            <MenuItem
              value="add-website"
              onClick={() => setWebsiteFormOpen(true)}
            >
              Add Website
            </MenuItem>
            <MenuItem
              value="add-folder"
              onClick={(e) => {
                e.preventDefault();
                addFolder();
              }}
            >
              Add Folder
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </SidebarLinksGroup>
      <AddWebsiteDialog
        key={websiteFormOpen.toString()}
        learnId={learnId}
        open={websiteFormOpen}
        setOpen={setWebsiteFormOpen}
        onAdd={addWebsite}
      />
    </>
  );
}

function AddWebsiteDialog({
  learnId,
  open,
  setOpen,
  onAdd,
}: {
  learnId: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAdd: (url: string, title: string, icon: string | null) => void;
}) {
  const [state, action, loading] = React.useActionState(
    createTopLevelResource,
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
      setOpen(false);
    }
  });

  React.useEffect(() => {
    handleSubmission(state);
  }, [state]);

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
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
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
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

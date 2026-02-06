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
import { Button, Image, Input } from "@chakra-ui/react";
import { createResource } from "./actions";
import { toaster } from "@/components/ui/toaster";

export type Resource = {
  id: string;
  title: string;
  icon: string | null;
  content: string | Resource[];
};

export function Resources(props: { resources: Resource[]; learnId: number }) {
  const [resources, setResources] = React.useState<Resource[]>(props.resources);

  const [websiteFormOpen, setWebsiteFormOpen] = React.useState<boolean>(false);

  function addWebsite(url: string, title: string, icon: string | null) {
    setResources((resources) => [
      ...resources,
      {
        id: v4(),
        title: title,
        icon,
        content: url,
      },
    ]);
  }

  return (
    <>
      <SidebarLinksGroup
        icon={<FolderIcon fill="text.secondary" />}
        subLinks={resources.map(function mapToSidebarItem(
          resource
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

          return (
            <SidebarLinksGroup
              key={resource.id}
              icon={<></>}
              subLinks={resource.content.map(mapToSidebarItem)}
            >
              <SidebarLink>{resource.title}</SidebarLink>
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
            {/* <MenuItem value="add-folder">Add Folder</MenuItem> */}
          </MenuContent>
        </MenuRoot>
      </SidebarLinksGroup>
      <AddWebsiteDialog
        key={websiteFormOpen.toString()}
        learnId={props.learnId}
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

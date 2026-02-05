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
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Button, Input } from "@chakra-ui/react";
import { useForm, useWatch } from "react-hook-form";

export type Resource = {
  id: string;
  title: string;
  icon: string | null;
  favicon: string | null;
  content: string | Resource[];
};

export function Resources(props: { resources: Resource[] }) {
  const [resources, setResources] = React.useState<Resource[]>(props.resources);

  const [websiteFormOpen, setWebsiteFormOpen] = React.useState<boolean>(false);

  function addWebsite(resource: Resource) {}

  function remove() {}

  function copy() {}

  return (
    <>
      <SidebarLinksGroup
        icon={<FolderIcon fill="text.secondary" />}
        subLinks={resources.map(function mapToSidebarItem(
          resource
        ): React.ReactNode {
          if (typeof resource.content === "string") {
            return (
              <SidebarLink key={resource.id} href={resource.content}>
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
        open={websiteFormOpen}
        setOpen={setWebsiteFormOpen}
        onAdd={(resource: WebsiteForm) => {
          setResources((resources) => [
            ...resources,
            {
              id: v4(),
              title: resource.title,
              icon: resource.icon || null,
              favicon: resource.favicon || null,
              content: resource.link,
            },
          ]);
        }}
      />
    </>
  );
}

type WebsiteForm = {
  title: string;
  favicon?: string;
  icon?: string;
  link: string;
};
function AddWebsiteDialog({
  open,
  setOpen,
  onAdd,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAdd: (resource: WebsiteForm) => void;
}) {
  const [blurred, setBlurred] = React.useState<boolean>(false);

  const { register, handleSubmit, control } = useForm<WebsiteForm>();
  const url = useWatch({ name: "link", control });

  const fetchWebsiteMetadata = React.useEffectEvent(() => {
    console.log(url);
  });
  React.useEffect(() => {
    fetchWebsiteMetadata();
  }, [blurred]);

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <DialogContent>
        <form onSubmit={handleSubmit(onAdd)}>
          <DialogHeader>
            <Field label="URL">
              <Input
                {...register("link")}
                onBlur={() => setBlurred(true)}
                placeholder="e.g https://www.example.com"
              />
            </Field>
          </DialogHeader>
          <DialogBody>hello</DialogBody>
          <DialogFooter>
            <Button type="submit">Add</Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}

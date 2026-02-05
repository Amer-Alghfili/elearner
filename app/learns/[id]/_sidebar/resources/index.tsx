import React from "react";
import { SidebarLink, SidebarLinksGroup } from "../client";
import { FolderIcon } from "@/components/Icons";
import {
  MenuContent,
  MenuContextTrigger,
  MenuItem,
  MenuRoot,
  MenuTrigger,
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
import {
  FormProvider,
  useController,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { getWebsiteMetadata } from "./actions";
import EmojiPicker from "emoji-picker-react";

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
  favicon: string | null;
  icon: string | null;
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
  const [loadingMetadata, setLoadingMetadata] = React.useState<boolean>(false);

  const methods = useForm<WebsiteForm>();
  const { register, handleSubmit, control, setValue } = methods;

  const url = useWatch({ name: "link", control });

  async function fetchWebsiteMetadata() {
    if (!url) return;

    setLoadingMetadata(true);

    const { title, iconLink } = await getWebsiteMetadata(url);
    setValue("title", title);
    setValue("favicon", iconLink);

    setLoadingMetadata(false);
  }

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onAdd)}>
            <DialogHeader>
              <Field label="URL">
                <Input
                  {...register("link")}
                  onBlur={fetchWebsiteMetadata}
                  placeholder="e.g https://www.example.com"
                />
              </Field>
            </DialogHeader>
            <DialogBody>
              {loadingMetadata && <p>Loading metadata...</p>}
              {!loadingMetadata && (
                <>
                  <Field label="Title">
                    <Input {...register("title")} placeholder="Website Title" />
                  </Field>
                  <IconField />
                </>
              )}
            </DialogBody>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </DialogRoot>
  );
}

function IconField() {
  const { control } = useFormContext<WebsiteForm>();

  const favicon = useWatch({ name: "favicon", control });
  const icon = useWatch({ name: "icon", control });

  const { field } = useController({
    name: "icon",
    control,
  });

  let content;
  if (icon) {
    content = <h1>{icon}</h1>;
  } else {
    content = favicon != null && <img src={favicon} alt="link faveicon" />;
  }

  return (
    <MenuRoot>
      <MenuTrigger>{content}</MenuTrigger>
      <MenuContent portalled={false}>
        <EmojiPicker
          skinTonesDisabled={true}
          previewConfig={{
            defaultEmoji: field.value || "",
            showPreview: false,
          }}
          onEmojiClick={(emoji) => field.onChange(emoji.emoji)}
        />
      </MenuContent>
    </MenuRoot>
  );
}

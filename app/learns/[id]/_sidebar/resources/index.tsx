import { SidebarLink, SidebarLinksGroup } from "../client";
import { FolderIcon } from "@/components/Icons";

export type Resource = {
  id: number;
  title: string;
  icon: string | null;
  favicon: string | null;
  content: string | Resource[];
};

export function Resources({ resources }: { resources: Resource[] }) {
  return (
    <SidebarLinksGroup
      icon={<FolderIcon fill="text.secondary" />}
      subLinks={resources.map((resource) => (
        <SidebarLink key={resource.id} href={resource.id.toString()}>
          {resource.title}
        </SidebarLink>
      ))}
    >
      Resources
    </SidebarLinksGroup>
  );
}

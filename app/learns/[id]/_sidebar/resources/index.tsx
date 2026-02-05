import React from "react";
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
      Resources
    </SidebarLinksGroup>
  );
}

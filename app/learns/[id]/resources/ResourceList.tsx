"use client";

import React from "react";
import { Resource } from "./Resource";
import { Stack } from "@chakra-ui/react";
import AddButton from "@/components/button/add";
import { v4 } from "uuid";
import { isZodError } from "@/types/error";
import { toaster } from "@/components/ui/toaster";
import { deleteResource, postResource } from "./action";

export type Resource = {
  id: string;
  title: string;
  link: string;
  tags: number[];
  isDraft: boolean;
};

export type Tag = { label: string; color: string };

type ResourceListProps = {
  learnId: number;
  resources: Resource[];
  tagOptions: Tag[];
};
export default function ResourceList(props: ResourceListProps) {
  const { learnId } = props;

  const [resources, setResources] = React.useState<Resource[]>(props.resources);

  function draft() {
    setResources([
      ...resources,
      {
        id: v4(),
        title: "",
        link: "",
        tags: [],
        isDraft: true,
      },
    ]);
  }

  async function confirm(resource: Resource): Promise<boolean> {
    try {
      const res = await postResource(learnId, resource, resource.isDraft);

      if (isZodError(res)) {
        toaster.create({
          title: res.errorMessage,
          type: "error",
          closable: true,
        });

        return false;
      } else {
        setResources(res);

        toaster.create({
          title: "resource has been submitted successfully",
          type: "success",
          closable: true,
        });

        return true;
      }
    } catch (err) {
      toaster.create({
        title: "Something went wrong",
        type: "error",
        closable: true,
      });
    }

    return false;
  }

  async function remove(id: string) {
    try {
      const res = await deleteResource(learnId, Number(id));

      setResources(res);
    } catch (err) {
      toaster.create({
        title: "Something went wrong",
        type: "error",
        closable: true,
      });
    }
  }

  function addTagOption(tag: Tag) {}

  return (
    <Stack>
      <AddButton alignSelf="flex-start" onClick={draft}>
        New Resource
      </AddButton>
      {resources.map((resource) => {
        return (
          <Resource
            key={resource.id}
            resource={resource}
            onConfirm={confirm}
            onRemove={remove}
            onDiscard={(id) =>
              setResources(
                resources.filter(
                  (resource) => resource.id !== id || !resource.isDraft
                )
              )
            }
          />
        );
      })}
    </Stack>
  );
}

"use client";

import React from "react";
import { Resource } from "./Resource";
import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import AddButton from "@/components/button/add";
import { v4 } from "uuid";
import { isZodError } from "@/types/error";
import { toaster } from "@/components/ui/toaster";
import { createTag, deleteResource, postResource } from "./actions";
import { NotFound } from "@/components/NotFound";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/input/search";

export type Resource = {
  id: string;
  title: string;
  link: string;
  tags: number[];
  isDraft: boolean;
};

export type Tag = { id: number; label: string; color: string };

type ResourceListProps = {
  learnId: number;
  resources: Resource[];
  tagOptions: Tag[];
};
export default function ResourceList(props: ResourceListProps) {
  const { learnId } = props;

  const router = useRouter();

  const [search, setSearch] = React.useState<string>("");

  const [resources, setResources] = React.useState<Resource[]>(props.resources);

  const [tagsOptions, setTagsOptions] = React.useState<Tag[]>(props.tagOptions);

  React.useEffect(
    function syncResources() {
      setResources(props.resources);
    },
    [props.resources]
  );

  function draft() {
    setResources([
      {
        id: v4(),
        title: "",
        link: "",
        tags: [],
        isDraft: true,
      },
      ...resources,
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
        router.refresh();

        toaster.create({
          title: "resource has been submitted successfully",
          type: "success",
          closable: true,
        });

        return true;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
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
      await deleteResource(learnId, Number(id));

      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      toaster.create({
        title: "Something went wrong",
        type: "error",
        closable: true,
      });
    }
  }

  async function addTagOption(
    tag: Omit<Tag, "id">
  ): Promise<number | undefined> {
    try {
      const res = await createTag(learnId, tag);

      if (isZodError(res)) {
        toaster.create({
          title: res.errorMessage,
          type: "error",
          closable: true,
        });
      } else {
        const { id, result } = res;

        setTagsOptions(result);

        return id;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      toaster.create({
        title: "Something went wrong",
        type: "error",
        closable: true,
      });
    }
  }

  function discard(id: string) {
    setResources(
      resources.filter((resource) => resource.id !== id || !resource.isDraft)
    );
  }

  const query = search.toLowerCase();
  const searchResult = resources.filter(({ title, link, tags }) => {
    if (title.toLocaleLowerCase().includes(query)) return true;

    if (link.toLocaleLowerCase().includes(query)) return true;

    const tagLabels = tagsOptions
      .filter(({ id }) => tags.includes(id))
      .map(({ label }) => label.toLocaleLowerCase());

    return tagLabels.some((label) => label.includes(query));
  });

  let content;

  if (searchResult.length > 0) {
    content = searchResult.map((resource) => {
      return (
        <Resource
          key={resource.id}
          resource={resource}
          tagsOptions={tagsOptions}
          onConfirm={confirm}
          onRemove={remove}
          onDiscard={discard}
          onAddTagOption={addTagOption}
        />
      );
    });
  } else if (query) {
    content = (
      <Stack mt="4.5em" w="full" gap={0} alignItems="center">
        <NotFound />
        <Stack alignItems="center">
          <Heading as="h4" color="text.primary">
            No resources found
          </Heading>
          <Stack alignItems="center" gap={0}>
            <Text color="text.secondary">
              {`Your search ${query} did not match any resource.`}
            </Text>
            <Text color="text.secondary">
              {"Please try to search either by resource's title, link or tag"}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap="1.5em">
      <Flex gap="1em" alignItems="center" justifyContent="space-between">
        <AddButton textStyle="h5" alignSelf="flex-start" onClick={draft}>
          New Resource
        </AddButton>
        <SearchInput
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, tag or link"
        />
      </Flex>
      {content}
    </Stack>
  );
}

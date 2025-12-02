"use client";

import React from "react";
import { Resource } from "./Resource";
import { Flex, Input, InputGroup, Stack } from "@chakra-ui/react";
import { DebounceInput } from "react-debounce-input";
import AddButton from "@/components/button/add";
import { v4 } from "uuid";
import { isZodError } from "@/types/error";
import { toaster } from "@/components/ui/toaster";
import { createTag, deleteResource, postResource } from "./actions";
import { Field } from "@/components/ui/field";
import { SearchIcon } from "@/components/Icons";

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

  const [search, setSearch] = React.useState<string>("");

  const [resources, setResources] = React.useState<Resource[]>(props.resources);

  const [tagsOptions, setTagsOptions] = React.useState<Tag[]>(props.tagOptions);

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

  async function addTagOption(
    tag: Omit<Tag, "id">
  ): Promise<number | undefined> {
    console.log(tag);
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
    } catch (err) {
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

  return (
    <Stack gap="1em">
      <Flex gap="1em" justifyContent="space-between">
        <AddButton alignSelf="flex-start" onClick={draft}>
          New Resource
        </AddButton>
        <Field maxW="22em">
          <InputGroup
            startElement={
              <SearchIcon w="1.3em" h="1.3em" stroke="stroke.thick" />
            }
          >
            <DebounceInput
              onChange={(e) => setSearch(e.target.value)}
              debounceTimeout={500}
              size="sm"
              placeholder="Search by name, tag or link"
              element={Input}
            />
          </InputGroup>
        </Field>
      </Flex>
      {/* TODO: empty state and no search result states */}
      {searchResult.map((resource) => {
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
      })}
    </Stack>
  );
}

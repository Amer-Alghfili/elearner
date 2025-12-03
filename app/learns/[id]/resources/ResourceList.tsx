"use client";

import React from "react";
import { Resource } from "./Resource";
import {
  Flex,
  Heading,
  Input,
  InputGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DebounceInput } from "react-debounce-input";
import AddButton from "@/components/button/add";
import { v4 } from "uuid";
import { isZodError } from "@/types/error";
import { toaster } from "@/components/ui/toaster";
import { createTag, deleteResource, postResource } from "./actions";
import { Field } from "@/components/ui/field";
import { SearchIcon } from "@/components/Icons";
import { NotFound } from "@/components/empty-state/NotFound";
import { Empty } from "@/components/empty-state/Empty";

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
          <Stack gap={0}>
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
  } else {
    content = (
      <Stack w="full" gap={0} alignItems="center">
        <Empty />
        <Stack gap={0} alignItems="center">
          <Heading as="h4" color="text.primary">
            Your learn does not have any resource
          </Heading>
          <Text color="text.secondary">
            You can add any resource related to your learn
          </Text>
        </Stack>
        <AddButton
          variant="primary"
          color="white"
          mt="2em"
          textStyle="h5"
          iconProps={{
            w: "1.5rem",
            h: "1.5rem",
            fill: "white",
            _groupHover: {},
          }}
          _hover={{ bg: "primary.thick" }}
          onClick={draft}
        >
          New Resource
        </AddButton>
      </Stack>
    );
  }

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
      {content}
    </Stack>
  );
}

import AddButton from "@/components/button/add";
import { Button, Circle, Input } from "@chakra-ui/react";
import React from "react";
import { Field } from "@/components/ui/field";
import { TagIcon } from "@/components/Icons";
import {
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { colors } from "@/theme/color-palattes";
import { Tag } from "./ResourceList";

export function Tags({
  tags,
  onAddTag,
}: {
  tags: Tag[];
  onAddTag: (tag: Tag) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const [showColorOptions, setShowColorOptions] = React.useState(false);
  const [showTagOptions, setShowTagOptions] = React.useState(true);

  const selectedTag = React.useRef<Tag>({} as Tag);

  const [query, setQuery] = React.useState<string>("");

  function draft(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!canAdd) return;

    if (selectedTag.current) selectedTag.current.label = query;
    setShowTagOptions(false);
    setShowColorOptions(true);
  }

  function selectColor(color: string) {
    if (selectedTag.current) selectedTag.current.color = color;

    onAddTag(selectedTag.current as Tag);
    setShowColorOptions(false);
    setShowTagOptions(true);
    setQuery("");
  }

  const options = tags.filter(({ label }) => label.includes(query));

  const canAdd = options.every(({ label }) => label !== query);

  return (
    <MenuRoot
      open={open}
      onOpenChange={({ open }) => {
        if (showColorOptions || showTagOptions) return;

        setOpen(open);
      }}
      onInteractOutside={() => setOpen(false)}
      onEscapeKeyDown={() => setOpen(false)}
      composite={false}
    >
      <MenuTrigger asChild>
        <Button
          className="group"
          variant="plain"
          onClick={() => setOpen(true)}
          textStyle="sm-medium"
          p={0}
          gap="0.3em"
          color="text.secondary"
          _hover={{
            color: "primary.thick",
          }}
        >
          <TagIcon
            transition="all 0.2s ease-in-out"
            _groupHover={{ fill: "primary.thick" }}
          />
          Add Tag
        </Button>
      </MenuTrigger>
      <MenuContent>
        {showColorOptions &&
          colors.map((color) => (
            <MenuItem
              key={color}
              value={color}
              onClick={() => selectColor(color)}
            >
              <Circle size="0.5rem" bg={color} />
              {color}
            </MenuItem>
          ))}
        {showTagOptions && (
          <form onSubmit={draft}>
            <Field>
              <Input
                size="sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Field>
            {options.map((option) => (
              <MenuCheckboxItem
                key={option.label}
                value={option.label}
                // checked={isChecked(option.label)}
                checked={false}
                onCheckedChange={
                  (checked) => {}
                  // toggleSelection(checked, option.label)
                }
              >
                {option.label}
              </MenuCheckboxItem>
            ))}
            {canAdd && (
              <AddButton type="submit" w="full" justifyContent="flex-start">
                Create Tag
              </AddButton>
            )}
          </form>
        )}
      </MenuContent>
    </MenuRoot>
  );
}

function useResourceTag(tags: Tag[], onTagsChange: (tags: Tag[]) => void) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [colorMenuOpen, setColorMenuOpen] = React.useState<boolean>(false);
  const [tagMenuOpen, setTagMenuOpen] = React.useState<boolean>(false);

  const [label, setLabel] = React.useState<string>("");

  const selected = tags.filter(({ selected }) => selected);

  function createTag(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    setColorMenuOpen(true);
    setTagMenuOpen(false);
    setOpen(false);
  }

  function addTag(color: string) {
    setColorMenuOpen(false);
    setTagMenuOpen(true);
    setOpen(false);

    onTagsChange([...tags, { label, color, selected: true }]);
  }

  function toggleMenu() {
    const newOpen = !open;

    if (newOpen) {
      setTagMenuOpen(true);
    } else {
      setColorMenuOpen(false);
      setTagMenuOpen(false);
    }

    setOpen(newOpen);
  }

  function toggleSelection(checked: boolean, label: string) {
    onTagsChange(
      tags.map((tag) => ({
        ...tag,
        selected: tag.label === label ? checked : tag.selected,
      }))
    );
  }

  React.useEffect(
    function reopen() {
      if (!open && (colorMenuOpen || tagMenuOpen)) {
        setOpen(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorMenuOpen, tagMenuOpen]
  );

  function search(e) {
    const label = e.target.value;

    setLabel(label);
  }

  const result = tags.filter((tag) => tag.label.includes(label));

  return {
    open,
    toggleMenu,
    colorMenuOpen,
    tagMenuOpen,
    addTag,
    createTag,
    label,
    search,
    result,
    canCreate:
      !result.some((r) => label === r.label) && label != null && label !== "",
    isChecked: (label: string) => selected.some((tag) => tag.label === label),
    toggleSelection,
  };
}

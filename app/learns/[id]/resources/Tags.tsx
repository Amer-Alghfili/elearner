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
  selectedTags,
  onAdd,
  onToggle,
}: {
  tags: Tag[];
  selectedTags: number[];
  onAdd: (tag: Tag) => Promise<void>;
  onToggle: (checked: boolean, id: number) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const [showColorOptions, setShowColorOptions] = React.useState(false);
  const [showTagOptions, setShowTagOptions] = React.useState(true);

  const candidate = React.useRef<Tag>({} as Tag);

  const [query, setQuery] = React.useState<string>("");

  function draft(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!canAdd) return;

    if (candidate.current) candidate.current.label = query;
    setShowTagOptions(false);
    setShowColorOptions(true);
  }

  async function selectColor(color: string) {
    if (candidate.current) candidate.current.color = color;

    try {
      await onAdd(candidate.current as Tag);

      setShowColorOptions(false);
      setShowTagOptions(true);
      setQuery("");
    } catch (err) {}
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
            {options.map(({ id, label }) => {
              const isChecked = selectedTags.some(
                (selectedTagId) => selectedTagId === id
              );

              return (
                <MenuCheckboxItem
                  key={id}
                  value={label}
                  checked={isChecked}
                  onCheckedChange={(checked) => onToggle(checked, id)}
                >
                  {label}
                </MenuCheckboxItem>
              );
            })}
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

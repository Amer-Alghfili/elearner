import AddButton from "@/components/button/add";
import {
  Button,
  Circle,
  createListCollection,
  Flex,
  Input,
  useFilter,
  useListCollection,
} from "@chakra-ui/react";
import React from "react";
import { Field } from "@/components/ui/field";
import { PlusIcon, TagIcon } from "@/components/Icons";
import { colors } from "@/theme/color-palattes";
import { Tag } from "./ResourceList";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemText,
  ComboboxRoot,
} from "@/components/ui/combobox";

export function Tags({
  tags,
  selectedTags,
  onAdd,
  onChange,
}: {
  tags: Tag[];
  selectedTags: number[];
  onAdd: (tag: Tag) => Promise<void>;
  onChange: (tags: number[]) => void;
}) {
  // const [open, setOpen] = React.useState(false);

  const [showColorOptions, setShowColorOptions] = React.useState(false);
  const [showTagOptions, setShowTagOptions] = React.useState(true);

  const candidate = React.useRef<Tag>({} as Tag);

  function draft(label: string) {
    console.log(label);
    if (candidate.current) candidate.current.label = label;
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

  // function closeMenu() {
  //   setOpen(false);
  //   candidate.current = {} as Tag;
  // }

  return (
    <PopoverRoot
    // open={open}
    // onOpenChange={({ open }) => {
    //   if (showColorOptions || showTagOptions) return;

    //   if (!open) closeMenu();
    //   else setOpen(open);
    // }}
    // onInteractOutside={closeMenu}
    // onEscapeKeyDown={closeMenu}
    >
      <PopoverTrigger asChild>
        <Button
          className="group"
          variant="plain"
          // onClick={() => setOpen(true)}
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
      </PopoverTrigger>
      <PopoverContent overflow="auto">
        {
          showColorOptions && (
            <ColorCombobox options={colors} onSelect={selectColor} />
          )
          // colors.map((color) => (
          // <MenuItem
          //   key={color}
          //   value={color}
          //   onClick={() => selectColor(color)}
          // >
          //   <Circle size="0.5rem" bg={color} />
          //   {color}
          // </MenuItem>
          // ))
        }
        {showTagOptions && (
          <TagCombobox
            options={tags}
            initialValue={selectedTags.map((s) => s.toString())}
            onChange={onChange}
            onCreate={draft}
          />
        )}
      </PopoverContent>
    </PopoverRoot>
  );
}

type Item = {
  label: string;
  value: any;
};

function TagCombobox({
  options,
  initialValue,
  onChange,
  onCreate,
}: {
  options: Tag[];
  initialValue: string[];
  onChange: (value: number[]) => void;
  onCreate: (label: string) => void;
}) {
  const [value, setValue] = React.useState<string[]>(initialValue);
  const [inputValue, setInputValue] = React.useState<string>("");

  const [items, setItems] = React.useState<Item[]>(
    options.map((option) => ({ label: option.label, value: option.id }))
  );

  const collection = createListCollection({
    items,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  });

  function filter(inputValue: string) {
    const canAdd =
      inputValue.trim().length > 0 &&
      options.some((item) => item.label !== inputValue);

    const filteredItems = options
      .filter((option) => option.label.includes(inputValue))
      .map((option) => ({ label: option.label, value: option.id }));

    if (canAdd) {
      setItems([...filteredItems, { label: inputValue, value: "new" }]);
    } else {
      setItems(filteredItems);
    }
  }

  return (
    <ComboboxRoot
      value={value}
      onValueChange={({ value }) => {
        if (value[value.length - 1] === "new") {
          onCreate(inputValue);
        } else {
          setValue(value);
        }
      }}
      allowCustomValue={true}
      // alwaysSubmitOnEnter={true}
      onBlur={() => onChange(value.map((v) => Number(v)))}
      collection={collection}
      inputValue={inputValue}
      onInputValueChange={(e) => {
        const value = e.inputValue;

        filter(value);
        setInputValue(value);
      }}
      multiple={true}
    >
      <ComboboxInput />
      <ComboboxControl />
      <ComboboxContent>
        {collection.items.map((item) => {
          return (
            <ComboboxItem key={item.value} item={item}>
              {item.value === "new" ? (
                <ComboboxItemText>
                  <Flex alignItems="center" gap="0.2em">
                    <PlusIcon
                      fill="text.caption"
                      stroke="text.caption"
                      transition="all 0.2s ease-in-out"
                      _groupHover={{
                        fill: "text.primary",
                        stroke: "text.primary",
                      }}
                      strokeWidth="0.4"
                    />
                    Create {item.label}
                  </Flex>
                </ComboboxItemText>
              ) : (
                <ComboboxItemText>{item.label}</ComboboxItemText>
              )}
            </ComboboxItem>
          );
        })}
      </ComboboxContent>
    </ComboboxRoot>
  );
}

function ColorCombobox({
  options,
  onSelect,
}: {
  options: readonly string[];
  onSelect: (color: string) => void;
}) {
  const { contains } = useFilter({});

  const { collection, filter } = useListCollection({
    initialItems: options,
    filter: contains,
  });

  return (
    <ComboboxRoot
      onValueChange={({ value }) => {
        onSelect(value[0]);
      }}
      collection={collection}
      onInputValueChange={(e) => {
        const value = e.inputValue;

        filter(value);
      }}
    >
      <ComboboxInput />
      <ComboboxControl />
      <ComboboxContent>
        {collection.items.map((item) => {
          return (
            <ComboboxItem key={item} item={item}>
              {item}
            </ComboboxItem>
          );
        })}
      </ComboboxContent>
    </ComboboxRoot>
  );
}

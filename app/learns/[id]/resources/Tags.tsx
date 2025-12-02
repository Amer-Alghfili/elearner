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
  ComboboxInput,
  ComboboxItem,
  ComboboxItemText,
  ComboboxRoot,
} from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";

export function Tags({
  tags,
  selectedTags,
  onAdd,
  onChange,
}: {
  tags: Tag[];
  selectedTags: string[];
  onAdd: (tag: Tag) => Promise<void>;
  onChange: (tags: number[]) => void;
}) {
  const [showColorOptions, setShowColorOptions] = React.useState(false);
  const [showTagOptions, setShowTagOptions] = React.useState(false);

  const candidate = React.useRef<Tag>({} as Tag);

  function draft(label: string) {
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
    } catch (err) {}
  }

  function close() {
    setShowColorOptions(false);
    setShowTagOptions(false);

    candidate.current = {} as Tag;
  }

  return (
    <PopoverRoot onInteractOutside={close} onEscapeKeyDown={close}>
      <PopoverTrigger asChild>
        <Button
          className="group"
          variant="plain"
          onClick={() => setShowTagOptions(true)}
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
        {showColorOptions && (
          <ColorCombobox options={colors} onSelect={selectColor} />
        )}
        {showTagOptions && (
          <TagCombobox
            options={tags}
            initialValue={selectedTags}
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
  color?: string;
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

  function mapFromOption(option: Tag) {
    return {
      label: option.label,
      value: option.id.toString(),
      color: option.color,
    };
  }

  const [items, setItems] = React.useState<Item[]>(options.map(mapFromOption));

  const collection = createListCollection({
    items,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  });

  function filter(inputValue: string) {
    const filteredItems = options
      .filter((option) => option.label.includes(inputValue))
      .map(mapFromOption);

    const canAdd =
      inputValue.trim().length > 0 &&
      filteredItems.every((item) => item.label !== inputValue);

    if (canAdd) {
      setItems([...filteredItems, { label: inputValue, value: "new" }]);
    } else {
      setItems(filteredItems);
    }
  }

  return (
    <ComboboxRoot
      defaultOpen
      collection={collection}
      value={value}
      onValueChange={({ value }) => {
        if (value[value.length - 1] === "new") {
          onCreate(inputValue);
        } else {
          setValue(value);
        }
      }}
      allowCustomValue={true}
      onBlur={() => onChange(value.map((v) => Number(v)))}
      inputValue={inputValue}
      onInputValueChange={({ inputValue, reason }) => {
        if (reason === "item-select") return;

        filter(inputValue);
        setInputValue(inputValue);
      }}
      multiple={true}
    >
      <ComboboxControl showIndicator={false}>
        <ComboboxInput asChild>
          <Input
            variant="plain"
            border="none"
            boxShadow="none"
            _focusVisible={{
              outline: "none",
            }}
            placeholder="Search for tag..."
          />
        </ComboboxInput>
      </ComboboxControl>
      <ComboboxContent>
        {collection.items.map((item) => {
          return (
            <ComboboxItem key={item.value} item={item} showIndicator={false}>
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
                <ComboboxItemText>
                  <Flex alignItems="center" gap="0.5em">
                    <Checkbox
                      checked={value.includes(item.value)}
                      controlProps={{
                        w: "1.2em",
                        h: "1.2em",
                      }}
                    />
                    <Circle size="0.7em" bg={item.color} /> {item.label}
                  </Flex>
                </ComboboxItemText>
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
      autoFocus
      defaultOpen
      onValueChange={({ value }) => {
        onSelect(value[0]);
      }}
      collection={collection}
      onInputValueChange={(e) => {
        const value = e.inputValue;

        filter(value);
      }}
    >
      <ComboboxControl showIndicator={false}>
        <ComboboxInput asChild>
          <Input
            variant="plain"
            border="none"
            boxShadow="none"
            _focusVisible={{
              outline: "none",
            }}
            placeholder="Search for color..."
          />
        </ComboboxInput>
      </ComboboxControl>
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

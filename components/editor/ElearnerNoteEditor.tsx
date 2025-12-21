import { colors } from "@/theme/colors";
import {
  BlockNoteEditor,
  BlockNoteSchema,
  createHeadingBlockSpec,
  defaultBlockSpecs,
} from "@blocknote/core";
import { en } from "@blocknote/core/locales";
import {
  filterSuggestionItems,
  insertOrUpdateBlockForSlashMenu,
} from "@blocknote/core/extensions";
import { BlockNoteView, Theme } from "@blocknote/mantine";
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  createReactBlockSpec,
  DefaultReactSuggestionItem,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  NestBlockButton,
  SuggestionMenuController,
  TextAlignButton,
  UnnestBlockButton,
  useCreateBlockNote,
} from "@blocknote/react";
import { Flex, Input } from "@chakra-ui/react";

const insertClockItem = (editor: BlockNoteEditor<any>) => {
  return {
    title: "Clock",
    onItemClick: () => {
      return insertOrUpdateBlockForSlashMenu(editor, {
        type: "clock",
        // content: [
        //   { type: "text", text: "hello there!", styles: { italic: true } },
        // ],
      });
    },
    // aliases: ["helloworld", "hw"],
    // group: "Other",
    // icon: <HiOutlineGlobeAlt size={18} />,
    subtext: "Used to insert a block with 'Hello World' below.",
  };
};

const getCustomSlashMenuItems = (
  editor: UseElearnerBlockEditorReturn
): DefaultReactSuggestionItem[] => {
  const defaultSuggestions = getDefaultReactSlashMenuItems(editor).filter(
    ({ key }: any) =>
      key !== "file" && key !== "image" && key !== "video" && key !== "audio"
  );
  return [...defaultSuggestions, insertClockItem(editor)];
};
export function ElearnerNoteEditor({
  editor,
  editable = true,
}: {
  editor: any;
  editable?: boolean;
}) {
  const lightRedTheme = {
    colors: {
      editor: {
        text: colors.text.primary.value,
        background: "transparent",
      },
      menu: {
        text: colors.text.primary.value,
        background: colors.neutral.background.value,
      },
      tooltip: {
        text: colors.text.primary.value,
        background: colors.stroke.DEFAULT.value,
      },
      hovered: {
        text: colors.text.primary.value,
        background: colors.stroke.transparent.value,
      },
      selected: {
        text: colors.text.secondary.value,
        background: colors.stroke.thick.value,
      },
      disabled: {
        text: colors.text.caption.value,
        background: colors.stroke.DEFAULT.value,
      },
      shadow: colors.stroke.transparent.value,
      border: colors.stroke.DEFAULT.value,
      sideMenu: "#bababa",
    },
  } satisfies Theme;

  return (
    <BlockNoteView
      slashMenu={false}
      formattingToolbar={false}
      editor={editor}
      theme={{
        light: lightRedTheme,
        dark: lightRedTheme,
      }}
      editable={editable}
    >
      <SuggestionMenuController
        triggerCharacter="/"
        getItems={async (query) =>
          filterSuggestionItems(getCustomSlashMenuItems(editor), query)
        }
      />
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            <BlockTypeSelect key="blockTypeSelect" />
            <FileCaptionButton key="fileCaptionButton" />
            <FileReplaceButton key="replaceFileButton" />
            <BasicTextStyleButton basicTextStyle="bold" key="boldStyleButton" />
            <BasicTextStyleButton
              basicTextStyle="italic"
              key="italicStyleButton"
            />
            <BasicTextStyleButton
              basicTextStyle="underline"
              key="underlineStyleButton"
            />
            <BasicTextStyleButton
              basicTextStyle="strike"
              key="strikeStyleButton"
            />
            <BasicTextStyleButton key="codeStyleButton" basicTextStyle="code" />
            <TextAlignButton textAlignment="left" key="textAlignLeftButton" />
            <TextAlignButton
              textAlignment="center"
              key="textAlignCenterButton"
            />
            <TextAlignButton textAlignment="right" key="textAlignRightButton" />
            <ColorStyleButton key="colorStyleButton" />
            <NestBlockButton key="nestBlockButton" />
            <UnnestBlockButton key="unnestBlockButton" />
            <CreateLinkButton key="createLinkButton" />
          </FormattingToolbar>
        )}
      />
    </BlockNoteView>
  );
}

const customBlock = createReactBlockSpec(
  {
    type: "clock",
    propSchema: {
      hour: {
        default: {
          value: "22",
          onChange: (e: any) => console.log(e.target.value),
        } as any,
      },
      min: {
        default: "10",
      },
      sec: {
        default: "43",
      },
      type: {
        default: "clock",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      return (
        <Flex>
          <Input placeholder="hour" {...(props.block.props.hour as any)} />
          <Input placeholder="minute" value={props.block.props.min} />
          <Input placeholder="second" value={props.block.props.sec} />
        </Flex>
      );
    },
  }
);

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    heading: createHeadingBlockSpec({
      defaultLevel: 1,
      levels: [1, 2, 3, 4],
      allowToggleHeadings: true,
    }),
    clock: customBlock(),
  },
});

type UseElearnerBlockEditorReturn = BlockNoteEditor<
  typeof schema.blockSchema,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;
export function useElearnerCreateBlockNote({
  initialContent,
  style,
  placeholder,
}: {
  initialContent: any | null;
  style?: string;
  placeholder?: string;
}): UseElearnerBlockEditorReturn {
  const renderedPlaceholder = "Enter text or type '/' for commands";

  const editor = useCreateBlockNote({
    schema,
    domAttributes: {
      editor: {
        style: `min-height: 50vh; padding-top: 1em; ${style}`,
      },
    },
    initialContent: initialContent as any,
    dictionary: {
      ...en,
      placeholders: {
        default:
          placeholder == null
            ? renderedPlaceholder
            : `${placeholder}. ${renderedPlaceholder}`,
      },
    },
  });

  return editor;
}

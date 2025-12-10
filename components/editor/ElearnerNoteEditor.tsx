import { colors } from "@/theme/colors";
import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
} from "@blocknote/core";
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

//TODO:
/**
 * - Server side https://www.blocknotejs.org/docs/features/server-processing
 */
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

const getCustomSlashMenuItems = (editor: any): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  insertClockItem(editor),
];
export function ElearnerNoteEditor({ editor }: { editor: any }) {
  const { primary } = colors;

  const lightRedTheme = {
    colors: {
      editor: {
        text: colors.text.primary.value,
        background: "transparent",
      },
      menu: {
        text: "white",
        background: primary.DEFAULT.value,
      },
      tooltip: {
        text: "white",
        background: primary.DEFAULT.value,
      },
      hovered: {
        text: "white",
        background: primary.thick.value,
      },
      selected: {
        text: "white",
        background: primary.thick.value,
      },
      disabled: {
        text: colors.text.secondary.value,
        background: colors.stroke.DEFAULT.value,
      },
      shadow: "none",
      border: "none",
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
            {/* Extra button to toggle blue text & background */}
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

export function useElearnerCreateBlockNote({
  initialContent,
}: {
  initialContent: any[] | null;
}) {
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
      clock: customBlock(),
    },
  });

  const editor = useCreateBlockNote({
    schema,
    domAttributes: {
      editor: {
        style: "min-height: 50vh; padding-top: 1em",
      },
    },
    initialContent,
    // initialContent: [
    //   {
    //     type: "paragraph",
    //     content: [
    //       { type: "text", text: "hello world", styles: { bold: true } },
    //     ],
    //   },
    //   {
    //     id: "11",
    //     type: "clock",
    //     props: {
    //       hour: {
    //         value: "2",
    //         onChange: (e: any) => {
    //           editor.updateBlock("11", {
    //             props: {
    //               ...editor.getBlock("11")?.props,
    //               hour: {
    //                 ...(editor.getBlock("11")?.props as any).hour,
    //                 value: e.target.value,
    //               },
    //             },
    //           });
    //         },
    //       },
    //       min: "11",
    //       sec: "44",
    //     },
    //     content: "",
    //   },
    // ],
  });

  return editor;
}

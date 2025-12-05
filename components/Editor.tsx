"use client";

import { colors } from "@/theme/colors";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultProps,
  defaultStyleSpecs,
} from "@blocknote/core";
import { BlockNoteView, Theme } from "@blocknote/mantine";
import {
  createReactBlockSpec,
  createReactStyleSpec,
  useCreateBlockNote,
} from "@blocknote/react";
import { Box } from "@chakra-ui/react";

//TODO:
/**
 * - Custom block
 *    - Add new item in "/" suggestion
 *    - with content
 *    - without content
 * - Include 'code' option in FormattingToolbar https://www.blocknotejs.org/docs/react/components/formatting-toolbar
 * - Server side https://www.blocknotejs.org/docs/features/server-processing
 */
export default function Editor() {
  const customBlock = createReactBlockSpec(
    {
      type: "clock",
      propSchema: {
        textAlignment: defaultProps.textAlignment,
        textColor: defaultProps.textColor,
        type: {
          default: "warning",
          values: ["warning", "error", "info", "success"],
        },
      },
      content: "inline",
    },
    { render: (props) => <Box></Box> }
    // { render: (props) => <Box>{props.block.}</Box> }
  );

  const editor = useCreateBlockNote({
    schema: BlockNoteSchema.create({
      styleSpecs: {
        ...defaultStyleSpecs,
        backgroundColor: createReactStyleSpec(
          {
            type: "backgroundColor",
            propSchema: "string",
          },
          {
            render: (props) => (
              <Box
                as="span"
                ref={props.contentRef}
                color="green"
                bg={props.value}
              />
            ),
          }
        ),
      },
      blockSpecs: {
        ...defaultBlockSpecs,
        clock: customBlock(),
      },
    }),
    initialContent: [
      {
        type: "paragraph",
        content: "hello there",
        // children: [
        //   {
        //     type: "paragraph",
        //     content: "nested paragraph",
        //   },
        // ],
      },
      {
        type: "clock",
        content: "",
      },
    ],
  });

  const lightRedTheme = {
    colors: {
      editor: {
        text: colors.text.primary.value,
        background: colors.primary.thin.value,
      },
      menu: {
        text: "#ffffff",
        background: "#9b0000",
      },
      tooltip: {
        text: "#ffffff",
        background: "#b00000",
      },
      hovered: {
        text: "#ffffff",
        background: "#b00000",
      },
      selected: {
        text: "#ffffff",
        background: "#c50000",
      },
      disabled: {
        text: "#9b0000",
        background: "#7d0000",
      },
      shadow: "#640000",
      border: "#870000",
      sideMenu: "#bababa",
      // highlights: lightDefaultTheme.colors!.highlights,
    },
    // borderRadius: 4,
    fontFamily: "Helvetica Neue, sans-serif",
  } satisfies Theme;

  return (
    <BlockNoteView
      editor={editor}
      theme={{
        light: lightRedTheme,
        dark: lightRedTheme,
      }}
    />
  );
}

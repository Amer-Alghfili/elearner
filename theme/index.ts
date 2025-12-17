import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { heading } from "./recipes/heading";
import { textStyles } from "./text-styles";
import { button } from "./recipes/button";
import { colors } from "./colors";
import { input } from "./recipes/input";
import { checkbox } from "./recipes/checkbox";
import { blockNoteStyle } from "./block-note";
import { tabs } from "./recipes/tabs";

const config = defineConfig({
  globalCss: {
    ...blockNoteStyle,
    h1: {
      textStyle: "h1",
    },
    h2: {
      textStyle: "h2",
    },
    h3: {
      textStyle: "h3",
    },
    h4: {
      textStyle: "h4",
    },
    h5: {
      textStyle: "h5",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-inter)" },
        body: { value: "var(--font-manrope)" },
      },
      colors,
    },
    textStyles,
    recipes: {
      heading,
      button,
      input,
    },
    slotRecipes: {
      checkbox,
      tabs,
    },
  },
});

export const system = createSystem(defaultConfig, config);

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { heading } from "./recipes/heading";
import { textStyles } from "./text-styles";

const config = defineConfig({
  globalCss: {
    h1: {
      fontSize: "3.0625rem",
    },
    h2: {
      fontSize: "2.4375rem",
    },
    h3: {
      fontSize: "1.9375rem",
    },
    h4: {
      fontSize: "1.5625rem",
    },
    h5: {
      fontSize: "1.25rem",
    },
  },
  theme: {
    // tokens: {
    //   fonts: {
    //     heading: ,
    //     body: ,
    //   }
    // }
    textStyles,
    recipes: {
      heading,
    },
  },
});

export const system = createSystem(defaultConfig, config);

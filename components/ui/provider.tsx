"use client";

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defaultSystem,
  defineConfig,
} from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
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
      recipes: {
        heading: {
          variants: {
            size: {
              xs: { textStyle: "none" },
              sm: { textStyle: "none" },
              md: { textStyle: "none" },
              lg: { textStyle: "none" },
              xl: { textStyle: "none" },
              "2xl": { textStyle: "none" },
              "3xl": { textStyle: "none" },
              "4xl": { textStyle: "none" },
              "5xl": { textStyle: "none" },
              "6xl": { textStyle: "none" },
              "7xl": { textStyle: "none" },
            },
          },
        },
      },
    },
  });

  const system = createSystem(defaultConfig, config);

  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}

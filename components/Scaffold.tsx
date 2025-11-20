import { Box, BoxProps } from "@chakra-ui/react";

export function Scaffold({ children, ...props }: BoxProps) {
  return (
    <Box bg="neutral.background" minH="100vh" pt="2em" px="7.5em" {...props}>
      {children}
    </Box>
  );
}

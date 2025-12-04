import { Box, BoxProps } from "@chakra-ui/react";

export function Scaffold({ children, ...props }: BoxProps) {
  return (
    <Box
      bg="neutral.background"
      minH="100vh"
      py="2em"
      px={{ base: "2em", sm: "4em", md: "7.5em" }}
      {...props}
    >
      {children}
    </Box>
  );
}

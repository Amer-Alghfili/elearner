import { Box, BoxProps } from "@chakra-ui/react";

export default function TruncateText(props: BoxProps) {
  return (
    <Box
      overflow="hidden"
      whiteSpace="nowrap"
      textOverflow="ellipsis"
      {...props}
    />
  );
}

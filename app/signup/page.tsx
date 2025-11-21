import { GoogleIcon, OutlookIcon } from "@/components/Icons";
import { Scaffold } from "@/components/Scaffold";
import { domine, syne } from "@/fonts";
import { Box, Button, Heading, Stack, Flex } from "@chakra-ui/react";
import { CustomForm } from "./CustomForm";

export default function SignupPage() {
  return (
    <Scaffold
      pt="5em"
      bg="linear-gradient(127deg, rgba(255, 191, 84, 0.8) 0%, rgba(65, 41, 0, 0.8) 100%)"
    >
      <Box maxW="38.625em" mx="auto">
        <Stack mb="5.25em" alignItems="center">
          <Heading as="h1" color="white" {...domine.style}>
            Welcome to Elearner
          </Heading>
          <Box
            {...syne.style}
            color="white"
            fontSize="1.25rem"
            fontWeight="medium"
          >
            You’re about one step to improve your learning!
          </Box>
        </Stack>
        <Stack gap="1.875em">
          <Button variant="primary" borderColor="rgba(255, 243, 218, 0.6)">
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button variant="primary" borderColor="rgba(255, 243, 218, 0.6)">
            <OutlookIcon />
            Continue with Outlook
          </Button>
        </Stack>
        <Divider />
        <CustomForm />
      </Box>
    </Scaffold>
  );
}

function Divider() {
  return (
    <Flex mt="3.0625em" mb="1.8125em" alignItems="center" gap="0.75em">
      <Box h="1px" flex="100%" bg="white" />
      <Box color="white">OR</Box>
      <Box h="1px" flex="100%" bg="white" />
    </Flex>
  );
}

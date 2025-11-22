import Header from "@/components/Header";
import { Scaffold } from "@/components/Scaffold";
import { Stack } from "@chakra-ui/react";
import CreateLearn from "./CreateLearn";
import { Learns } from "./Learns";

export default async function HomePage() {
  return (
    <Scaffold>
      <Header />
      <Stack mt="6.4375em" alignItems="flex-start" gap="2em">
        <CreateLearn />
        <Learns />
      </Stack>
    </Scaffold>
  );
}

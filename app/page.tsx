import AddButton from "@/components/button/add";
import Header from "@/components/Header";
import { Scaffold } from "@/components/Scaffold";
import { Stack } from "@chakra-ui/react";

export default async function HomePage() {
  return (
    <Scaffold>
      <Header />
      <Stack mt="6.4375em" alignItems="flex-start">
        <AddButton
          textStyle="h3"
          iconProps={{ w: "1.9375rem", h: "1.9375rem" }}
        >
          New Learn
        </AddButton>
      </Stack>
    </Scaffold>
  );
}

import { Box, Stack } from "@chakra-ui/react";

export default async function Home() {
  async function p() {
    return new Promise<string>((res) => {
      setTimeout(() => {
        res("returned");
      }, 1000);
    });
  }

  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const todo = await res.json();

  const promise = await p();

  return (
    <Stack>
      <Box color="green">{todo.title}</Box>
      <Box color="green">{promise}</Box>
    </Stack>
  );
}

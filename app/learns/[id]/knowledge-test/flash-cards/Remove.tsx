import RemoveButton from "@/components/button/remove";
import { Button, Icon, Input } from "@chakra-ui/react";
import React from "react";
import { deleteFlashCard } from "./actions";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import { LuTrash } from "react-icons/lu";

export function Remove({ id }: { id: number }) {
  const router = useRouter();

  const [state, action, loading] = React.useActionState(
    deleteFlashCard,
    undefined
  );

  React.useEffect(
    function reset() {
      if (state == null) return;

      if (state.error) {
        toaster.create({
          title: state.error,
          type: "error",
          closable: true,
        });

        return;
      }

      router.refresh();

      toaster.create({
        title: "Flash card has been deleted successfully",
        type: "success",
        closable: true,
      });
    },
    [state]
  );

  return (
    <RemoveButton
      className="group"
      _hover={{ bg: "stroke" }}
      minW="2rem"
      h="2rem"
      icon={
        <Icon color="accent.softCoral" w="1rem" h="1rem">
          <LuTrash />
        </Icon>
      }
    >
      <form action={action}>
        <Input id="id" name="id" value={id} hidden={true} readOnly={true} />
        <Button type="submit" loading={loading} bg="feedback.error">
          Delete
        </Button>
      </form>
    </RemoveButton>
  );
}

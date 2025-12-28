import AddButton from "@/components/button/add";
import React from "react";
import Upsert from "./upsert";

export function Create({ learnId }: { learnId: number }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <AddButton alignSelf="flex-start" onClick={() => setOpen(true)}>
        New Flash Card
      </AddButton>
      <Upsert
        key={open.toString()}
        defaultValues={{ learn_id: learnId }}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

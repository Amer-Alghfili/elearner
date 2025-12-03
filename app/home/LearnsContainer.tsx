"use client";

import React from "react";
import CreateLearn from "./CreateLearn";
import { Learns } from "./Learns";
import { Learn } from "./actions";

export default function LearnsContainer(props: { learns: Learn[] }) {
  const [learns, setLearns] = React.useState<Learn[]>(props.learns);

  return (
    <>
      <CreateLearn onCreate={setLearns} />
      <Learns learns={learns} />
    </>
  );
}

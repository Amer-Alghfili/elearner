"use client";

import React from "react";
import CreateLearn from "./CreateLearn";
import { Learns } from "./Learns";
import { Learn } from "./actions";

export default function LearnsContainer(props: { learns: Learn[] }) {
  const [learns, setLearns] = React.useState<Learn[]>(props.learns);

  React.useEffect(
    function syncLearns() {
      setLearns(props.learns);
    },
    [props.learns]
  );

  return (
    <>
      <CreateLearn />
      <Learns learns={learns} />
    </>
  );
}

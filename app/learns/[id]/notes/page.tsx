import { Editor } from "@/components/editor";
import { Block } from "@blocknote/core";

export type File = {
  id: number;
  title: string;
  emoji?: string;
  blocks: Block[];
};
export default function NotesTabPage() {
  return <Editor />;
}

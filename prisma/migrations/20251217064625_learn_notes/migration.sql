/*
  Warnings:

  - You are about to drop the `learns_todos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "learns_todos" DROP CONSTRAINT "learns_todos_learn_id_fkey";

-- DropTable
DROP TABLE "learns_todos";

-- CreateTable
CREATE TABLE "learns_note_blocks" (
    "id" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "data" JSON NOT NULL,
    "order" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "learn_id" INTEGER NOT NULL,

    CONSTRAINT "learns_note_blocks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learns_note_blocks" ADD CONSTRAINT "learns_note_blocks_learn_id_fkey" FOREIGN KEY ("learn_id") REFERENCES "learns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

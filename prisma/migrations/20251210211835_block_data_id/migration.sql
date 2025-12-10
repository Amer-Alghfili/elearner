/*
  Warnings:

  - The primary key for the `learns_note_file_blocks` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "learns_note_file_blocks" DROP CONSTRAINT "learns_note_file_blocks_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "learns_note_file_blocks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "learns_note_file_blocks_id_seq";

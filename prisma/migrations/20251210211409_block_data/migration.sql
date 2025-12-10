/*
  Warnings:

  - You are about to drop the column `children` on the `learns_note_file_blocks` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `learns_note_file_blocks` table. All the data in the column will be lost.
  - You are about to drop the column `props` on the `learns_note_file_blocks` table. All the data in the column will be lost.
  - Added the required column `data` to the `learns_note_file_blocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "learns_note_file_blocks" DROP COLUMN "children",
DROP COLUMN "content",
DROP COLUMN "props",
ADD COLUMN     "data" JSON NOT NULL;

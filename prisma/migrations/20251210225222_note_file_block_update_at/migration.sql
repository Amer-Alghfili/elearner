/*
  Warnings:

  - Added the required column `updatedAt` to the `learns_note_file_blocks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "learns_note_file_blocks" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

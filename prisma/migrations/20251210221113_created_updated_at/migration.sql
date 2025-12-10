/*
  Warnings:

  - Added the required column `updatedAt` to the `learns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `learns_knowledge_tests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `learns_note_file_blocks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `learns_note_files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `learns_resources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "learns" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "learns_knowledge_tests" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "learns_note_file_blocks" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "learns_note_files" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "learns_resources" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

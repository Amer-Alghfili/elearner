/*
  Warnings:

  - You are about to drop the column `description` on the `learns_resources` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `learns_resources` table. All the data in the column will be lost.
  - Made the column `link` on table `learns_resources` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "learns_resources" DROP COLUMN "description",
DROP COLUMN "file",
ALTER COLUMN "link" SET NOT NULL;

/*
  Warnings:

  - You are about to drop the column `tags` on the `learns_resources` table. All the data in the column will be lost.
  - You are about to drop the `resource_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "resource_tags" DROP CONSTRAINT "resource_tags_learn_id_fkey";

-- AlterTable
ALTER TABLE "learns_resources" DROP COLUMN "tags";

-- DropTable
DROP TABLE "resource_tags";

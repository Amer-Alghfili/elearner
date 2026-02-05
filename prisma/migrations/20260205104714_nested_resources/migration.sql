-- AlterTable
ALTER TABLE "learns_resources" ADD COLUMN     "icon" VARCHAR(255),
ADD COLUMN     "parent_resource" INTEGER,
ALTER COLUMN "link" DROP NOT NULL;

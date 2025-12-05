-- AlterTable
ALTER TABLE "learns_resources" ADD COLUMN     "knowledge_test_id" INTEGER;

-- CreateTable
CREATE TABLE "learns_knowledge_tests" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "answer" VARCHAR(255) NOT NULL,
    "hints" VARCHAR(255),
    "stage" VARCHAR(255) NOT NULL,
    "due" TIMESTAMP(3) NOT NULL,
    "learn_id" INTEGER NOT NULL,

    CONSTRAINT "learns_knowledge_tests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learns_resources" ADD CONSTRAINT "learns_resources_knowledge_test_id_fkey" FOREIGN KEY ("knowledge_test_id") REFERENCES "learns_knowledge_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learns_knowledge_tests" ADD CONSTRAINT "learns_knowledge_tests_learn_id_fkey" FOREIGN KEY ("learn_id") REFERENCES "learns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

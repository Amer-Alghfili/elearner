-- CreateTable
CREATE TABLE "learns_note_files" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "emoji" VARCHAR(255),
    "cover" VARCHAR(255),
    "learn_id" INTEGER NOT NULL,

    CONSTRAINT "learns_note_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learns_note_files" ADD CONSTRAINT "learns_note_files_learn_id_fkey" FOREIGN KEY ("learn_id") REFERENCES "learns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

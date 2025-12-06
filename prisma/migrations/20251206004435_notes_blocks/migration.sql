-- CreateTable
CREATE TABLE "learns_note_file_blocks" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "content" JSON NOT NULL,
    "props" JSON NOT NULL,
    "children" JSON NOT NULL,
    "file_id" INTEGER NOT NULL,

    CONSTRAINT "learns_note_file_blocks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learns_note_file_blocks" ADD CONSTRAINT "learns_note_file_blocks_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "learns_note_files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

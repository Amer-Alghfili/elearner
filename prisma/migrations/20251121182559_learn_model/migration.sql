-- CreateTable
CREATE TABLE "learns" (
    "id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "learns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learns" ADD CONSTRAINT "learns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

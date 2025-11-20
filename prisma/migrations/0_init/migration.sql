-- CreateTable
CREATE TABLE "users" (
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("email")
);


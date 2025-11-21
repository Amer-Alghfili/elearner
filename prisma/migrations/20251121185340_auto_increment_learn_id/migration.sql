-- AlterTable
CREATE SEQUENCE learns_id_seq;
ALTER TABLE "learns" ALTER COLUMN "id" SET DEFAULT nextval('learns_id_seq');
ALTER SEQUENCE learns_id_seq OWNED BY "learns"."id";

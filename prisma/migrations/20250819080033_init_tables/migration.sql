-- AlterTable
ALTER TABLE "public"."Movie" ADD COLUMN     "numVotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPoints" INTEGER NOT NULL DEFAULT 0;

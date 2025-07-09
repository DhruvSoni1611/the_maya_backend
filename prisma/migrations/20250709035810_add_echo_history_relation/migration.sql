/*
  Warnings:

  - You are about to drop the column `format` on the `EchoHistory` table. All the data in the column will be lost.
  - You are about to drop the column `outputUrl` on the `EchoHistory` table. All the data in the column will be lost.
  - You are about to drop the column `promptTitle` on the `EchoHistory` table. All the data in the column will be lost.
  - You are about to drop the column `voiceUsed` on the `EchoHistory` table. All the data in the column will be lost.
  - You are about to drop the column `audioUrl` on the `Podcast` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Podcast` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrl` on the `Podcast` table. All the data in the column will be lost.
  - You are about to drop the column `voice` on the `Podcast` table. All the data in the column will be lost.
  - Added the required column `podcastId` to the `EchoHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `format` to the `Podcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputUrl` to the `Podcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Podcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voiceUsed` to the `Podcast` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EchoHistory_userId_idx";

-- AlterTable
ALTER TABLE "EchoHistory" DROP COLUMN "format",
DROP COLUMN "outputUrl",
DROP COLUMN "promptTitle",
DROP COLUMN "voiceUsed",
ADD COLUMN     "podcastId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Podcast" DROP COLUMN "audioUrl",
DROP COLUMN "duration",
DROP COLUMN "pdfUrl",
DROP COLUMN "voice",
ADD COLUMN     "format" TEXT NOT NULL,
ADD COLUMN     "outputUrl" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "voiceUsed" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EchoHistory" ADD CONSTRAINT "EchoHistory_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

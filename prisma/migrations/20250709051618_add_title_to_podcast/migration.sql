/*
  Warnings:

  - Added the required column `audioUrl` to the `Podcast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pdfUrl` to the `Podcast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Podcast" ADD COLUMN     "audioUrl" TEXT NOT NULL,
ADD COLUMN     "pdfUrl" TEXT NOT NULL;

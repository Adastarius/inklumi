/*
  Warnings:

  - You are about to drop the column `kategorie` on the `Badge` table. All the data in the column will be lost.
  - You are about to drop the `Bewertung` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ort` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BadgeToBewertung` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BadgeToOrt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bewertung" DROP CONSTRAINT "Bewertung_ortId_fkey";

-- DropForeignKey
ALTER TABLE "Bewertung" DROP CONSTRAINT "Bewertung_userId_fkey";

-- DropForeignKey
ALTER TABLE "_BadgeToBewertung" DROP CONSTRAINT "_BadgeToBewertung_A_fkey";

-- DropForeignKey
ALTER TABLE "_BadgeToBewertung" DROP CONSTRAINT "_BadgeToBewertung_B_fkey";

-- DropForeignKey
ALTER TABLE "_BadgeToOrt" DROP CONSTRAINT "_BadgeToOrt_A_fkey";

-- DropForeignKey
ALTER TABLE "_BadgeToOrt" DROP CONSTRAINT "_BadgeToOrt_B_fkey";

-- AlterTable
ALTER TABLE "Badge" DROP COLUMN "kategorie",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "Bewertung";

-- DropTable
DROP TABLE "Ort";

-- DropTable
DROP TABLE "_BadgeToBewertung";

-- DropTable
DROP TABLE "_BadgeToOrt";

-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "placeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BadgeToPlace" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BadgeToPlace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BadgeToReview" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BadgeToReview_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BadgeToPlace_B_index" ON "_BadgeToPlace"("B");

-- CreateIndex
CREATE INDEX "_BadgeToReview_B_index" ON "_BadgeToReview"("B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgeToPlace" ADD CONSTRAINT "_BadgeToPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgeToPlace" ADD CONSTRAINT "_BadgeToPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgeToReview" ADD CONSTRAINT "_BadgeToReview_A_fkey" FOREIGN KEY ("A") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgeToReview" ADD CONSTRAINT "_BadgeToReview_B_fkey" FOREIGN KEY ("B") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

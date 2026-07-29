/*
  Warnings:

  - You are about to drop the `_BadgeToPlace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BadgeToReview` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `latitude` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_BadgeToPlace" DROP CONSTRAINT "_BadgeToPlace_A_fkey";

-- DropForeignKey
ALTER TABLE "_BadgeToPlace" DROP CONSTRAINT "_BadgeToPlace_B_fkey";

-- DropForeignKey
ALTER TABLE "_BadgeToReview" DROP CONSTRAINT "_BadgeToReview_A_fkey";

-- DropForeignKey
ALTER TABLE "_BadgeToReview" DROP CONSTRAINT "_BadgeToReview_B_fkey";

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "_BadgeToPlace";

-- DropTable
DROP TABLE "_BadgeToReview";

-- CreateTable
CREATE TABLE "BadgeRating" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "badgeId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "BadgeRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BadgeRating_reviewId_badgeId_key" ON "BadgeRating"("reviewId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeRating" ADD CONSTRAINT "BadgeRating_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeRating" ADD CONSTRAINT "BadgeRating_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

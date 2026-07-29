/*
  Warnings:

  - You are about to drop the `BadgeRating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BadgeRating" DROP CONSTRAINT "BadgeRating_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "BadgeRating" DROP CONSTRAINT "BadgeRating_reviewId_fkey";

-- DropTable
DROP TABLE "BadgeRating";

-- CreateTable
CREATE TABLE "_BadgeToReview" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BadgeToReview_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BadgeToReview_B_index" ON "_BadgeToReview"("B");

-- AddForeignKey
ALTER TABLE "_BadgeToReview" ADD CONSTRAINT "_BadgeToReview_A_fkey" FOREIGN KEY ("A") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgeToReview" ADD CONSTRAINT "_BadgeToReview_B_fkey" FOREIGN KEY ("B") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

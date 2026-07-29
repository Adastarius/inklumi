-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "kategorie" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Bewertung" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ortId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Bewertung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BadgeToBewertung" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BadgeToBewertung_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BadgeToBewertung_B_index" ON "_BadgeToBewertung"("B");

-- AddForeignKey
ALTER TABLE "Bewertung" ADD CONSTRAINT "Bewertung_ortId_fkey" FOREIGN KEY ("ortId") REFERENCES "Ort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bewertung" ADD CONSTRAINT "Bewertung_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgeToBewertung" ADD CONSTRAINT "_BadgeToBewertung_A_fkey" FOREIGN KEY ("A") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgeToBewertung" ADD CONSTRAINT "_BadgeToBewertung_B_fkey" FOREIGN KEY ("B") REFERENCES "Bewertung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

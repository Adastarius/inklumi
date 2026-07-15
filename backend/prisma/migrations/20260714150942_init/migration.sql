-- CreateTable
CREATE TABLE "Ort" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "bezirk" TEXT NOT NULL,
    "kategorie" TEXT NOT NULL,
    "bild" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ort_pkey" PRIMARY KEY ("id")
);

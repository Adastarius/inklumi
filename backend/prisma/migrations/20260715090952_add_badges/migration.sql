-- CreateTable
CREATE TABLE "Badge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BadgeToOrt" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BadgeToOrt_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Badge_name_key" ON "Badge"("name");

-- CreateIndex
CREATE INDEX "_BadgeToOrt_B_index" ON "_BadgeToOrt"("B");

-- AddForeignKey
ALTER TABLE "_BadgeToOrt" ADD CONSTRAINT "_BadgeToOrt_A_fkey" FOREIGN KEY ("A") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BadgeToOrt" ADD CONSTRAINT "_BadgeToOrt_B_fkey" FOREIGN KEY ("B") REFERENCES "Ort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

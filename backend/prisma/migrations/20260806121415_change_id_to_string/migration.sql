-- 1. Foreign Keys droppen
ALTER TABLE "Place" DROP CONSTRAINT "Place_createdById_fkey";
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- 2. Spaltentypen ändern
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "id" TYPE TEXT USING "id"::text;
DROP SEQUENCE IF EXISTS "User_id_seq";

ALTER TABLE "Place" ALTER COLUMN "createdById" TYPE TEXT USING "createdById"::text;
ALTER TABLE "Review" ALTER COLUMN "userId" TYPE TEXT USING "userId"::text;

-- 3. Foreign Keys wiederherstellen (mit den korrekten onDelete-Regeln aus deinem Schema)
ALTER TABLE "Place" ADD CONSTRAINT "Place_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL;

ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT;

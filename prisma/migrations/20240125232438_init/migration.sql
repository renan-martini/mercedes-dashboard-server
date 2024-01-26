/*
  Warnings:

  - Added the required column `baumsterId` to the `Leg` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Leg" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "currentDetails" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "baumsterId" TEXT NOT NULL,
    CONSTRAINT "Leg_baumsterId_fkey" FOREIGN KEY ("baumsterId") REFERENCES "Baumster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Leg" ("createdAt", "currentDetails", "currentStatus", "id", "name", "updatedAt") SELECT "createdAt", "currentDetails", "currentStatus", "id", "name", "updatedAt" FROM "Leg";
DROP TABLE "Leg";
ALTER TABLE "new_Leg" RENAME TO "Leg";
CREATE UNIQUE INDEX "Leg_name_baumsterId_key" ON "Leg"("name", "baumsterId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Leg" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "currentStatus" TEXT,
    "currentDetails" TEXT,
    "updatedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "baumsterId" TEXT NOT NULL,
    CONSTRAINT "Leg_baumsterId_fkey" FOREIGN KEY ("baumsterId") REFERENCES "Baumster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Leg" ("baumsterId", "createdAt", "currentDetails", "currentStatus", "id", "name", "updatedAt") SELECT "baumsterId", "createdAt", "currentDetails", "currentStatus", "id", "name", "updatedAt" FROM "Leg";
DROP TABLE "Leg";
ALTER TABLE "new_Leg" RENAME TO "Leg";
CREATE UNIQUE INDEX "Leg_name_baumsterId_key" ON "Leg"("name", "baumsterId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

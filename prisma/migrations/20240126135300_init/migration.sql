-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_History" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT,
    "details" TEXT,
    "date" DATETIME NOT NULL,
    "legId" TEXT,
    CONSTRAINT "History_legId_fkey" FOREIGN KEY ("legId") REFERENCES "Leg" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_History" ("date", "details", "id", "legId", "status") SELECT "date", "details", "id", "legId", "status" FROM "History";
DROP TABLE "History";
ALTER TABLE "new_History" RENAME TO "History";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

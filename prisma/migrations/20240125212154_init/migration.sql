-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Leg" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "currentDetails" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Leg" ("currentDetails", "currentStatus", "id", "name", "updatedAt") SELECT "currentDetails", "currentStatus", "id", "name", "updatedAt" FROM "Leg";
DROP TABLE "Leg";
ALTER TABLE "new_Leg" RENAME TO "Leg";
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Project" ("id", "name") SELECT "id", "name" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE TABLE "new_Baumster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "projectId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Baumster_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Baumster" ("code", "id", "projectId") SELECT "code", "id", "projectId" FROM "Baumster";
DROP TABLE "Baumster";
ALTER TABLE "new_Baumster" RENAME TO "Baumster";
CREATE UNIQUE INDEX "Baumster_code_key" ON "Baumster"("code");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

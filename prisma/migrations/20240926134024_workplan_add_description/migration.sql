/*
  Warnings:

  - Added the required column `description` to the `WorkPlan` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "periodId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkPlan_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "Period" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkPlan_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WorkPlan" ("authorId", "createdAt", "id", "periodId", "updatedAt") SELECT "authorId", "createdAt", "id", "periodId", "updatedAt" FROM "WorkPlan";
DROP TABLE "WorkPlan";
ALTER TABLE "new_WorkPlan" RENAME TO "WorkPlan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

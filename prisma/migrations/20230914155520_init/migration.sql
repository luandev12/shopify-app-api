/*
  Warnings:

  - The primary key for the `Store` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Store` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Store" (
    "access_token" TEXT NOT NULL,
    "shop" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Store" ("access_token", "shop") SELECT "access_token", "shop" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
CREATE UNIQUE INDEX "Store_shop_key" ON "Store"("shop");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

/*
  Warnings:

  - A unique constraint covering the columns `[badge_name]` on the table `tbl_badge` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tbl_badge_badge_name_key` ON `tbl_badge`(`badge_name`);

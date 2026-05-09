-- AlterTable
ALTER TABLE `tbl_badge` ADD COLUMN `badge_category` VARCHAR(191) NULL,
    ADD COLUMN `locked_description` TEXT NULL,
    ADD COLUMN `unlocked_description` TEXT NULL;

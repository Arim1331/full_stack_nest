-- AlterTable
ALTER TABLE `tbl_member` ADD COLUMN `cook_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `ingredient_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `main_badge_id` INTEGER NULL,
    ADD COLUMN `post_count` INTEGER NOT NULL DEFAULT 0;

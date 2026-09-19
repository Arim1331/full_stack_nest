-- DropForeignKey
ALTER TABLE `tbl_comment` DROP FOREIGN KEY `tbl_comment_member_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_my_fridge` DROP FOREIGN KEY `tbl_my_fridge_member_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_post` DROP FOREIGN KEY `tbl_post_member_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_post_like` DROP FOREIGN KEY `tbl_post_like_member_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_saved_recipe` DROP FOREIGN KEY `tbl_saved_recipe_member_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_user_badge` DROP FOREIGN KEY `tbl_user_badge_member_id_fkey`;

-- DropIndex
DROP INDEX `tbl_comment_member_id_fkey` ON `tbl_comment`;

-- DropIndex
DROP INDEX `tbl_post_member_id_fkey` ON `tbl_post`;

-- AddForeignKey
ALTER TABLE `tbl_user_badge` ADD CONSTRAINT `tbl_user_badge_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_my_fridge` ADD CONSTRAINT `tbl_my_fridge_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_post` ADD CONSTRAINT `tbl_post_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_comment` ADD CONSTRAINT `tbl_comment_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_saved_recipe` ADD CONSTRAINT `tbl_saved_recipe_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_post_like` ADD CONSTRAINT `tbl_post_like_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE CASCADE ON UPDATE CASCADE;

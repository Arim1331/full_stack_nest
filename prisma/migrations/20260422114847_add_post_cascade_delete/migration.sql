-- DropForeignKey
ALTER TABLE `tbl_comment` DROP FOREIGN KEY `tbl_comment_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_post_image` DROP FOREIGN KEY `tbl_post_image_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_post_ingredient_used` DROP FOREIGN KEY `tbl_post_ingredient_used_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_post_like` DROP FOREIGN KEY `tbl_post_like_post_id_fkey`;

-- DropIndex
DROP INDEX `tbl_comment_post_id_fkey` ON `tbl_comment`;

-- DropIndex
DROP INDEX `tbl_post_image_post_id_fkey` ON `tbl_post_image`;

-- DropIndex
DROP INDEX `tbl_post_like_post_id_fkey` ON `tbl_post_like`;

-- AddForeignKey
ALTER TABLE `tbl_post_image` ADD CONSTRAINT `tbl_post_image_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `tbl_post`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_comment` ADD CONSTRAINT `tbl_comment_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `tbl_post`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_post_like` ADD CONSTRAINT `tbl_post_like_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `tbl_post`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_post_ingredient_used` ADD CONSTRAINT `tbl_post_ingredient_used_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `tbl_post`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `tbl_member` (
    `member_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_email` VARCHAR(191) NOT NULL,
    `member_name` VARCHAR(191) NOT NULL,
    `member_xp` INTEGER NOT NULL DEFAULT 0,
    `member_age` INTEGER NULL,
    `member_address` VARCHAR(191) NULL,
    `member_profile` VARCHAR(191) NULL,
    `member_create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `member_updated_at` DATETIME(3) NOT NULL,
    `member_level` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `tbl_member_member_email_key`(`member_email`),
    PRIMARY KEY (`member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_auth_account` (
    `auth_account_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_provider` ENUM('LOCAL', 'GOOGLE', 'KAKAO', 'NAVER') NOT NULL,
    `member_provider_id` VARCHAR(191) NULL,
    `member_password` VARCHAR(191) NULL,
    `member_id` INTEGER NOT NULL,

    UNIQUE INDEX `tbl_auth_account_member_provider_member_provider_id_key`(`member_provider`, `member_provider_id`),
    PRIMARY KEY (`auth_account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_badge` (
    `badge_id` INTEGER NOT NULL AUTO_INCREMENT,
    `badge_name` VARCHAR(191) NOT NULL,
    `badge_description` VARCHAR(191) NOT NULL,
    `badge_image_url` VARCHAR(191) NULL,
    `badge_reward_xp` INTEGER NOT NULL DEFAULT 0,
    `badge_condition_type` VARCHAR(191) NULL,
    `badge_condition_value` INTEGER NULL,

    PRIMARY KEY (`badge_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_user_badge` (
    `user_badge_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `badge_id` INTEGER NOT NULL,
    `user_badge_achieve_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbl_user_badge_member_id_badge_id_key`(`member_id`, `badge_id`),
    PRIMARY KEY (`user_badge_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_recipe` (
    `recipe_id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_title` VARCHAR(191) NOT NULL,
    `recipe_desc` VARCHAR(191) NULL,
    `recipe_image_url` VARCHAR(191) NULL,
    `recipe_cook_time_min` INTEGER NULL,
    `recipe_difficulty` VARCHAR(191) NOT NULL,
    `recipe_xp` INTEGER NOT NULL DEFAULT 0,
    `recipe_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `recipe_updated_at` DATETIME(3) NULL,
    `recipe_deleted_at` DATETIME(3) NULL,
    `recipe_category` VARCHAR(191) NULL,

    PRIMARY KEY (`recipe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_recipe_ingredient` (
    `recipe_ingredient_id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_ingredient_amount` VARCHAR(191) NULL,
    `recipe_ingredient_sort_order` INTEGER NOT NULL DEFAULT 0,
    `recipe_id` INTEGER NOT NULL,
    `ingredient_id` INTEGER NOT NULL,

    UNIQUE INDEX `tbl_recipe_ingredient_recipe_id_ingredient_id_key`(`recipe_id`, `ingredient_id`),
    PRIMARY KEY (`recipe_ingredient_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_ingredient` (
    `ingredient_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ingredient_name` VARCHAR(191) NOT NULL,
    `ingredient_created_at` DATETIME(3) NULL,
    `ingredient_category` VARCHAR(191) NOT NULL,
    `ingredient_image_url` VARCHAR(191) NULL,

    UNIQUE INDEX `tbl_ingredient_ingredient_name_key`(`ingredient_name`),
    PRIMARY KEY (`ingredient_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_my_fridge` (
    `fridge_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `fridge_quantity` VARCHAR(191) NOT NULL,
    `fridge_expire_date` INTEGER NULL,
    `fridge_created_at` DATETIME(3) NULL,
    `fridge_updated_at` DATETIME(3) NULL,
    `fridge_deleted_at` DATETIME(3) NULL,
    `ingredient_id` INTEGER NOT NULL,

    UNIQUE INDEX `tbl_my_fridge_member_id_ingredient_id_fridge_expire_date_key`(`member_id`, `ingredient_id`, `fridge_expire_date`),
    PRIMARY KEY (`fridge_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_post` (
    `post_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `post_title` VARCHAR(191) NOT NULL,
    `post_content` VARCHAR(191) NOT NULL,
    `post_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `post_updated_at` DATETIME(3) NULL,
    `post_xp` INTEGER NOT NULL DEFAULT 0,
    `recipe_id` INTEGER NOT NULL,
    `post_deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_post_image` (
    `post_image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_id` INTEGER NOT NULL,
    `post_image_url` VARCHAR(191) NOT NULL,
    `post_image_order` INTEGER NOT NULL DEFAULT 0,
    `post_image_create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`post_image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_comment` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` INTEGER NOT NULL,
    `post_id` INTEGER NOT NULL,
    `comment_content` VARCHAR(191) NOT NULL,
    `comment_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `comment_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_saved_recipe` (
    `saved_recipe_id` INTEGER NOT NULL AUTO_INCREMENT,
    `saved_recipe_created_at` DATETIME(3) NULL,
    `member_id` INTEGER NOT NULL,
    `recipe_id` INTEGER NOT NULL,

    UNIQUE INDEX `tbl_saved_recipe_member_id_recipe_id_key`(`member_id`, `recipe_id`),
    PRIMARY KEY (`saved_recipe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_post_like` (
    `post_like_id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_like_created_at` DATETIME(3) NULL,
    `member_id` INTEGER NOT NULL,
    `post_id` INTEGER NOT NULL,

    UNIQUE INDEX `tbl_post_like_member_id_post_id_key`(`member_id`, `post_id`),
    PRIMARY KEY (`post_like_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_post_ingredient_used` (
    `post_ingredient_used_id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_ingredient_used_created_at` DATETIME(3) NULL,
    `post_id` INTEGER NOT NULL,
    `ingredient_id` INTEGER NOT NULL,

    UNIQUE INDEX `tbl_post_ingredient_used_post_id_ingredient_id_key`(`post_id`, `ingredient_id`),
    PRIMARY KEY (`post_ingredient_used_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_auth_account` ADD CONSTRAINT `tbl_auth_account_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_user_badge` ADD CONSTRAINT `tbl_user_badge_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_user_badge` ADD CONSTRAINT `tbl_user_badge_badge_id_fkey` FOREIGN KEY (`badge_id`) REFERENCES `tbl_badge`(`badge_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_recipe_ingredient` ADD CONSTRAINT `tbl_recipe_ingredient_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `tbl_recipe`(`recipe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_recipe_ingredient` ADD CONSTRAINT `tbl_recipe_ingredient_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `tbl_ingredient`(`ingredient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_my_fridge` ADD CONSTRAINT `tbl_my_fridge_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_my_fridge` ADD CONSTRAINT `tbl_my_fridge_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `tbl_ingredient`(`ingredient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_post` ADD CONSTRAINT `tbl_post_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_post` ADD CONSTRAINT `tbl_post_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `tbl_recipe`(`recipe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_post_image` ADD CONSTRAINT `tbl_post_image_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `tbl_post`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_comment` ADD CONSTRAINT `tbl_comment_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_comment` ADD CONSTRAINT `tbl_comment_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `tbl_post`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_saved_recipe` ADD CONSTRAINT `tbl_saved_recipe_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_saved_recipe` ADD CONSTRAINT `tbl_saved_recipe_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `tbl_recipe`(`recipe_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_post_like` ADD CONSTRAINT `tbl_post_like_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `tbl_member`(`member_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_post_like` ADD CONSTRAINT `tbl_post_like_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `tbl_post`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_post_ingredient_used` ADD CONSTRAINT `tbl_post_ingredient_used_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `tbl_post`(`post_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_post_ingredient_used` ADD CONSTRAINT `tbl_post_ingredient_used_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `tbl_ingredient`(`ingredient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

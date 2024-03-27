/*
  Warnings:

  - Added the required column `authVariant` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerAccountId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `authVariant` VARCHAR(191) NOT NULL,
    ADD COLUMN `providerAccountId` VARCHAR(191) NOT NULL;

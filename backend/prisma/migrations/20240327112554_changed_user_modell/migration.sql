/*
  Warnings:

  - You are about to drop the column `access_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `providerAccountId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_provider_providerAccountId_key` ON `User`;

-- DropIndex
DROP INDEX `User_sessionToken_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `access_token`,
    DROP COLUMN `expires`,
    DROP COLUMN `expires_at`,
    DROP COLUMN `id_token`,
    DROP COLUMN `provider`,
    DROP COLUMN `providerAccountId`,
    DROP COLUMN `refresh_token`,
    DROP COLUMN `scope`,
    DROP COLUMN `sessionToken`,
    DROP COLUMN `session_state`,
    DROP COLUMN `token_type`;

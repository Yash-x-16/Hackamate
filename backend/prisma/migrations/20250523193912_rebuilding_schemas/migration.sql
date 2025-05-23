/*
  Warnings:

  - You are about to drop the `Hackathon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hackathon" DROP CONSTRAINT "Hackathon_userid_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_recieverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserTag" DROP CONSTRAINT "UserTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "UserTag" DROP CONSTRAINT "UserTag_userId_fkey";

-- DropTable
DROP TABLE "Hackathon";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserTag";

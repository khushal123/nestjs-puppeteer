/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_postId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_postId_fkey";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Video";

-- CreateTable
CREATE TABLE "Tweet" (
    "id" SERIAL NOT NULL,
    "tweetUserName" TEXT NOT NULL,
    "tweetText" TEXT NOT NULL,
    "retweets" TEXT NOT NULL,
    "replies" TEXT NOT NULL,
    "likes" TEXT NOT NULL,
    "views" TEXT NOT NULL,
    "tweetImage" TEXT NOT NULL,
    "tweetVideo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoNotification" (
    "id" SERIAL NOT NULL,
    "tweetId" INTEGER NOT NULL,
    "notified" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoNotification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VideoNotification" ADD CONSTRAINT "VideoNotification_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

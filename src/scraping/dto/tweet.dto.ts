import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class TweetDto {

    @IsOptional()
    @IsNumber()
    tweetId: number

    @IsOptional()
    @IsString()
    tweetUserName: string;

    @IsOptional()
    @IsString()
    tweetText: string;

    @IsOptional()
    @IsString()
    retweets: string;

    @IsOptional()
    @IsString()
    replies: string;

    @IsOptional()
    @IsString()
    likes: string;

    @IsString()
    @IsOptional()
    views?: string;

    @IsString()
    @IsOptional()
    tweetImage?: string;

    @IsString()
    @IsOptional()
    tweetVideo?: string;
}



class VideoNotificationDto {
    @IsNumber()
    tweetId: number
    @IsBoolean()
    notified: boolean = false
}
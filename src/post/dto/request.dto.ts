import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class PostEntityDto {
    @IsInt()
    @IsOptional()
    id?: number;

    @IsString()
    @MinLength(10, {
        message: 'The text must be at least 10 characters long.',
    })
    @MaxLength(280, {
        message: 'The text must not exceed 280 characters.',
    })
    text: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsOptional()
    video?: string;

    // Add more fields as necessary, such as creation date, etc.
}
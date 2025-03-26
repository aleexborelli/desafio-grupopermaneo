import { IsString, IsNotEmpty, Length, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Name of the user posting the comment',
    minLength: 2,
    maxLength: 50,
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  user: string;

  @ApiProperty({
    description: 'Text content of the comment',
    minLength: 5,
    maxLength: 500,
    example: 'This lesson was very helpful!',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  text: string;

  @ApiProperty({
    description: 'Date when the comment was posted (ISO format)',
    example: '2023-10-15',
  })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}

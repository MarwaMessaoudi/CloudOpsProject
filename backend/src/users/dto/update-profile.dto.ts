import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'New Name' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}
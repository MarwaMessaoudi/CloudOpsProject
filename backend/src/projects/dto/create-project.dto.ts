import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Site vitrine Acme' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  name: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional() @IsString() @MaxLength(100)
  client?: string;
}
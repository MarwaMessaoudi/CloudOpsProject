import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ServerStatus } from '../entities/server.entity';

export class QueryServersDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({ description: 'Search in name or IP address' })
  @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ServerStatus })
  @IsOptional() @IsEnum(ServerStatus)
  status?: ServerStatus;

  @ApiPropertyOptional({ example: 'AWS' })
  @IsOptional() @IsString()
  provider?: string;

  @ApiPropertyOptional({ example: 'eu-west-3' })
  @IsOptional() @IsString()
  region?: string;
}
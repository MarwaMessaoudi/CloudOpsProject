import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUrl } from 'class-validator';
import { EnvType } from '../entities/environment.entity';

export class CreateEnvironmentDto {
  @ApiProperty({ enum: EnvType })
  @IsEnum(EnvType)
  type: EnvType;

  @ApiPropertyOptional({ example: 'https://staging.acme.com' })
  @IsOptional() @IsUrl({ require_tld: false })
  url?: string;
}
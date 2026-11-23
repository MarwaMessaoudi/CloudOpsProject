import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsIP, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ServerStatus } from '../entities/server.entity';

export class CreateServerDto {
  @ApiProperty({ example: 'srv-01' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'AWS' })
  @IsString() @IsNotEmpty() @MaxLength(50)
  provider: string;

  @ApiProperty({ example: 'eu-west-3' })
  @IsString() @IsNotEmpty() @MaxLength(50)
  region: string;

  @ApiProperty({ example: 2, description: 'vCPU count' })
  @IsInt() @Min(1)
  cpu: number;

  @ApiProperty({ example: 4, description: 'RAM in GB' })
  @IsInt() @Min(1)
  ramGb: number;

  @ApiProperty({ example: 50, description: 'Storage in GB' })
  @IsInt() @Min(1)
  storageGb: number;

  @ApiPropertyOptional({ example: '10.0.1.15' })
  @IsOptional() @IsIP()
  ipAddress?: string;

  @ApiPropertyOptional({ enum: ServerStatus, default: ServerStatus.ONLINE })
  @IsOptional() @IsEnum(ServerStatus)
  status?: ServerStatus;
}
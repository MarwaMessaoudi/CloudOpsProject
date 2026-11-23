import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateEnvironmentDto } from './create-environment.dto';

export class UpdateEnvironmentDto extends PartialType(OmitType(CreateEnvironmentDto, ['type'] as const)) {}
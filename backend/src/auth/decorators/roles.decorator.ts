import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/enums/role.enum';

export const ROLES_KEY = 'minRole';
// @Roles(Role.DEVOPS) means "DevOps or higher"
export const Roles = (minRole: Role) => SetMetadata(ROLES_KEY, minRole);
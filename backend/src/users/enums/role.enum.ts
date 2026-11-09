export enum Role {
  VIEWER = 'viewer',
  DEVOPS = 'devops',
  ADMIN = 'admin',
}

export const ROLE_LEVEL: Record<Role, number> = {
  [Role.VIEWER]: 1,
  [Role.DEVOPS]: 2,
  [Role.ADMIN]: 3,
};
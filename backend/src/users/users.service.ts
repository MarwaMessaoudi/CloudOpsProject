import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryUsersDto } from './dto/list-users.query';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async findAll({ page, limit, search, role }: QueryUsersDto) {
    const qb = this.users
      .createQueryBuilder('u')
      .orderBy('u.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (role) qb.andWhere('u.role = :role', { role });
    if (search) {
      qb.andWhere('(u.email ILIKE :s OR u.firstName ILIKE :s OR u.lastName ILIKE :s)', {
        s: `%${search}%`,
      });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    await this.users.update(id, dto);
    return this.findOne(id);
  }

  async updateRole(targetId: string, role: Role, currentUserId: string) {
    if (targetId === currentUserId) throw new BadRequestException('You cannot change your own role');
    await this.findOne(targetId);
    await this.users.update(targetId, { role });
    return this.findOne(targetId);
  }

  async setActive(targetId: string, isActive: boolean, currentUserId: string) {
    if (targetId === currentUserId) throw new BadRequestException('You cannot deactivate yourself');
    await this.findOne(targetId);
    await this.users.update(targetId, isActive ? { isActive } : { isActive, refreshTokenHash: null });
    return this.findOne(targetId);
  }
}
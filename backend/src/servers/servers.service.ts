import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServerDto } from './dto/create-server.dto';
import { QueryServersDto } from './dto/query-servers.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { Server } from './entities/server.entity';

@Injectable()
export class ServersService {
  constructor(@InjectRepository(Server) private readonly servers: Repository<Server>) {}

  async create(dto: CreateServerDto) {
    await this.assertNameFree(dto.name);
    return this.servers.save(this.servers.create(dto));
  }

  async findAll({ page, limit, search, status, provider, region }: QueryServersDto) {
    const qb = this.servers
      .createQueryBuilder('s')
      .orderBy('s.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) qb.andWhere('s.status = :status', { status });
    if (provider) qb.andWhere('s.provider ILIKE :provider', { provider });
    if (region) qb.andWhere('s.region ILIKE :region', { region });
    if (search) {
      qb.andWhere('(s.name ILIKE :s OR s.ipAddress ILIKE :s)', { s: `%${search}%` });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const server = await this.servers.findOne({ where: { id } });
    if (!server) throw new NotFoundException('Server not found');
    return server;
  }

  async update(id: string, dto: UpdateServerDto) {
    const server = await this.findOne(id);
    if (dto.name && dto.name !== server.name) await this.assertNameFree(dto.name);
    return this.servers.save(Object.assign(server, dto));
  }

  async remove(id: string) {
    const server = await this.findOne(id);
    await this.servers.remove(server);
    return { message: 'Server deleted' };
  }

  private async assertNameFree(name: string) {
    if (await this.servers.exists({ where: { name } })) {
      throw new ConflictException('A server with this name already exists');
    }
  }
}
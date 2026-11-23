import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { Environment } from './entities/environment.entity';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class EnvironmentsService {
  constructor(
    @InjectRepository(Environment) private readonly envs: Repository<Environment>,
    private readonly projects: ProjectsService,
  ) {}

  async create(projectId: string, dto: CreateEnvironmentDto) {
    await this.projects.findOne(projectId); // 404 si le projet n'existe pas
    if (await this.envs.exists({ where: { projectId, type: dto.type } })) {
      throw new ConflictException(`This project already has a "${dto.type}" environment`);
    }
    return this.envs.save(this.envs.create({ ...dto, projectId }));
  }

  async findAll(projectId: string) {
    await this.projects.findOne(projectId);
    return this.envs.find({ where: { projectId }, order: { type: 'ASC' } });
  }

  async findOne(projectId: string, id: string) {
    const env = await this.envs.findOne({ where: { id, projectId } });
    if (!env) throw new NotFoundException('Environment not found');
    return env;
  }

  async update(projectId: string, id: string, dto: UpdateEnvironmentDto) {
    const env = await this.findOne(projectId, id);
    return this.envs.save(Object.assign(env, dto));
  }

  async remove(projectId: string, id: string) {
    const env = await this.findOne(projectId, id);
    await this.envs.remove(env);
    return { message: 'Environment deleted' };
  }
}
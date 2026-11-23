import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private readonly projects: Repository<Project>) {}

  async create(dto: CreateProjectDto) {
    await this.assertNameFree(dto.name);
    return this.projects.save(this.projects.create(dto));
  }

  async findAll({ page, limit, search }: QueryProjectsDto) {
    const qb = this.projects
      .createQueryBuilder('p')
      .orderBy('p.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere('(p.name ILIKE :s OR p.client ILIKE :s)', { s: `%${search}%` });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
  }

  

  async findOne(id: string, withEnvironments = false) {
  const project = await this.projects.findOne({
    where: { id },
    relations: withEnvironments ? { environments: true } : {},
  });
  if (!project) throw new NotFoundException('Project not found');
  return project;
}

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.findOne(id);
    if (dto.name && dto.name !== project.name) await this.assertNameFree(dto.name);
    return this.projects.save(Object.assign(project, dto));
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    await this.projects.remove(project);
    return { message: 'Project deleted' };
  }

  private async assertNameFree(name: string) {
    if (await this.projects.exists({ where: { name } })) {
      throw new ConflictException('A project with this name already exists');
    }
  }
}
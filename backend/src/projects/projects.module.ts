import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Environment } from '../environments/entities/environment.entity';
import { EnvironmentsController } from '../environments/environments.controller';
import { EnvironmentsService } from '../environments/environments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Environment])],
  controllers: [ProjectsController,EnvironmentsController],
  providers: [ProjectsService,EnvironmentsService],
  exports: [ProjectsService, EnvironmentsService, TypeOrmModule],
})
export class ProjectsModule {}
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List projects with pagination and search (any role)' })
  findAll(@Query() query: QueryProjectsDto) {
    return this.projects.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project (any role)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projects.findOne(id, true);
  }

  @Post()
  @Roles(Role.DEVOPS, Role.ADMIN)
  @ApiOperation({ summary: 'Create a project (DEVOPS, ADMIN)' })
  create(@Body() dto: CreateProjectDto) {
    return this.projects.create(dto);
  }

  @Patch(':id')
  @Roles(Role.DEVOPS, Role.ADMIN)
  @ApiOperation({ summary: 'Update a project (DEVOPS, ADMIN)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProjectDto) {
    return this.projects.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.DEVOPS, Role.ADMIN)
  @ApiOperation({ summary: 'Delete a project (DEVOPS, ADMIN)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projects.remove(id);
  }
}
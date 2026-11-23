import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { EnvironmentsService } from './environments.service';

@ApiTags('Environments')
@ApiBearerAuth()
@Controller('projects/:projectId/environments')
export class EnvironmentsController {
  constructor(private readonly envs: EnvironmentsService) {}

  @Get()
  @ApiOperation({ summary: 'List environments of a project (any role)' })
  findAll(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.envs.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an environment (any role)' })
  findOne(@Param('projectId', ParseUUIDPipe) projectId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.envs.findOne(projectId, id);
  }

  @Post()
  @Roles(Role.DEVOPS, Role.ADMIN)
  @ApiOperation({ summary: 'Add an environment to a project (DEVOPS, ADMIN)' })
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() dto: CreateEnvironmentDto) {
    return this.envs.create(projectId, dto);
  }

  @Patch(':id')
  @Roles(Role.DEVOPS, Role.ADMIN)
  @ApiOperation({ summary: 'Update an environment URL (DEVOPS, ADMIN)' })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEnvironmentDto,
  ) {
    return this.envs.update(projectId, id, dto);
  }

  @Delete(':id')
  @Roles(Role.DEVOPS, Role.ADMIN)
  @ApiOperation({ summary: 'Delete an environment (DEVOPS, ADMIN)' })
  remove(@Param('projectId', ParseUUIDPipe) projectId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.envs.remove(projectId, id);
  }
}
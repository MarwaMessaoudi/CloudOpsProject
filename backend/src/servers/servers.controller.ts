import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/enums/role.enum';
import { CreateServerDto } from './dto/create-server.dto';
import { QueryServersDto } from './dto/query-servers.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServersService } from './servers.service';

@ApiTags('Servers')
@ApiBearerAuth()
@Controller('servers')
export class ServersController {
  constructor(private readonly servers: ServersService) {}

  @Get()
  @ApiOperation({ summary: 'List servers with pagination, search and filters (any role)' })
  findAll(@Query() query: QueryServersDto) {
    return this.servers.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a server (any role)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servers.findOne(id);
  }

  @Post()
  @Roles(Role.DEVOPS, Role.ADMIN)
  @ApiOperation({ summary: 'Create a server (DEVOPS, ADMIN)' })
  create(@Body() dto: CreateServerDto) {
    return this.servers.create(dto);
  }

  @Patch(':id')
  @Roles(Role.DEVOPS, Role.ADMIN)
  @ApiOperation({ summary: 'Update a server (DEVOPS, ADMIN)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateServerDto) {
    return this.servers.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.DEVOPS, Role.ADMIN)
  @ApiOperation({ summary: 'Delete a server (DEVOPS, ADMIN)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servers.remove(id);
  }
}
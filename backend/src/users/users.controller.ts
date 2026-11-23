import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { QueryUsersDto } from './dto/list-users.query';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UsersService } from './users.service';
import { Role } from './enums/role.enum';
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'My profile (any role)' })
  me(@CurrentUser('id') id: string) {
    return this.users.findOne(id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update my profile (any role)' })
  updateMe(@CurrentUser('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List users with pagination, search and role filter (ADMIN)' })
  findAll(@Query() query: QueryUsersDto) {
    return this.users.findAll(query);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a user (ADMIN)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.findOne(id);
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Change a user role (ADMIN)' })
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.users.updateRole(id, dto.role, currentUserId);
  }

  @Patch(':id/deactivate')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Deactivate a user and revoke their session (ADMIN)' })
  deactivate(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') currentUserId: string) {
    return this.users.setActive(id, false, currentUserId);
  }

  @Patch(':id/activate')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Reactivate a user (ADMIN)' })
  activate(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') currentUserId: string) {
    return this.users.setActive(id, true, currentUserId);
  }
}
import {
  Controller, Get, Post, Delete,
  Body, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { RolesGuard } from '../../common/guards/role.guard'
import { Roles } from '../../common/decorators/role.decorators'

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users — admin only' })
  findAll() {
    return this.usersService.findAll()
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create user — admin only' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user — admin only' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}
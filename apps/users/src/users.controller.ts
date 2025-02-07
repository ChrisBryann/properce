import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUserDecorator } from 'apps/auth/src/decorators/current-user.decorator';
import { PublicUser, User } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<PublicUser[]> {
    return await this.usersService.getAllUsers();
  }

  @Get('/me')
  async getCurrentUser(@CurrentUserDecorator() user: PublicUser): Promise<User | PublicUser> {
    return await this.usersService.getUserById(user.id);
  }

  @Patch('/me')
  async updateCurrentUser(@CurrentUserDecorator() user: PublicUser, @Body() updateUserDto: UpdateUserDto): Promise<PublicUser> {
    return await this.usersService.updateUserById(user.id, updateUserDto)
  }

  @Delete('/me')
  async deleteCurrentUser(@CurrentUserDecorator() user: PublicUser): Promise<void> {
    await this.usersService.deleteUserById(user.id)
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: string): Promise<User | PublicUser> {
    return await this.usersService.getUserById(userId);
  }
  
  @Patch('/:userId')
  async updateUserById(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<PublicUser> {
    return await this.usersService.updateUserById(userId, updateUserDto);
  }

  @Delete('/:userId')
  async deleteUserById(@Param('userId') userId: string): Promise<void> {
    await this.usersService.deleteUserById(userId)
  }
}

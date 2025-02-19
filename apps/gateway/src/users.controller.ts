import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CurrentUserDecorator } from 'apps/auth/src/decorators/current-user.decorator';
import { AuthGatewayGuard } from '@app/common/auth-gateway/auth-gateway.guard';
import { PublicUser, User } from 'apps/users/src/entities/user.entity';
import { UpdateUserDto } from 'apps/users/src/dtos/update-user.dto';
import { USERS_MICROSERVICE } from './gateway.constant';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@UseGuards(AuthGatewayGuard)
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_MICROSERVICE) private readonly usersMicroservice: ClientProxy,
  ) {}

  @Get()
  async getAllUsers(): Promise<PublicUser[]> {
    return firstValueFrom(
      await this.usersMicroservice.send({ cmd: 'getAllUsers' }, {}),
    );
  }

  @Get('/me')
  async getCurrentUser(
    @CurrentUserDecorator() user: PublicUser,
  ): Promise<User | PublicUser> {
    return firstValueFrom(
      await this.usersMicroservice.send(
        { cmd: 'getUserById' },
        {
          id: user.id,
        },
      ),
    );
  }

  @Patch('/me')
  async updateCurrentUser(
    @CurrentUserDecorator() user: PublicUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<PublicUser> {
    return firstValueFrom(
      await this.usersMicroservice.send(
        { cmd: 'updateUserById' },
        {
          id: user.id,
          updateUserDto,
        },
      ),
    );
  }

  @Delete('/me')
  async deleteCurrentUser(
    @CurrentUserDecorator() user: PublicUser,
  ): Promise<void> {
    await this.usersMicroservice.send(
      { cmd: 'deleteUserById' },
      {
        id: user.id,
      },
    );
  }

  @Get('/:userId')
  async getUserById(
    @Param('userId') userId: string,
  ): Promise<User | PublicUser> {
    return firstValueFrom(
      await this.usersMicroservice.send(
        { cmd: 'getUserById' },
        {
          id: userId,
        },
      ),
    );
  }

  @Patch('/:userId')
  async updateUserById(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<PublicUser> {
    return firstValueFrom(
      await this.usersMicroservice.send(
        { cmd: 'updateUserById' },
        {
          id: userId,
          updateUserDto,
        },
      ),
    );
  }

  @Delete('/:userId')
  async deleteUserById(@Param('userId') userId: string): Promise<void> {
    await this.usersMicroservice.send(
      { cmd: 'deleteUserById' },
      {
        id: userId,
      },
    );
  }
}

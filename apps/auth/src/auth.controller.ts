import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { PublicUser, User } from 'apps/users/src/entities/user.entity';
import { CurrentUserDecorator } from './decorators/current-user.decorator';
import { Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<PublicUser> {
    return await this.authService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUserDecorator() user: PublicUser, @Res({passthrough: true}) response: Response) {
    await this.authService.login(user, response);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUserDecorator() user: PublicUser) {
    return user;
  }
}

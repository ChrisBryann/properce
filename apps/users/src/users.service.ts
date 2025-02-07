import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicUser, User } from './entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CryptoService } from '@app/common/crypto/crypto.service';
import { RegisterUserDto } from 'apps/auth/src/dtos/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly cryptoService: CryptoService,
  ) {}

  async createUser(registerUserDto: RegisterUserDto): Promise<PublicUser> {
    const user = await this.usersRepository.save({
      ...registerUserDto,
      password: await this.cryptoService.hashPassword(registerUserDto.password),
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(): Promise<PublicUser[]> {
    const users: User[] = await this.usersRepository.find({});
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      
      return userWithoutPassword;
    });
  }

  async getUserByEmail(
    email: string,
    includePassword: boolean = false,
  ): Promise<User | PublicUser> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const { password, ...userWithoutPassword } = user;
    return includePassword ? user : userWithoutPassword;
  }

  async getUserById(
    userId: string,
    includePassword: boolean = false,
  ): Promise<User | PublicUser> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const { password, ...userWithoutPassword } = user;
    return includePassword ? user : userWithoutPassword;
  }

  async updateUserById(
    userId: string,
    updateUserDto: DeepPartial<User>,
  ): Promise<PublicUser> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const { password, ...updatedUser } = await this.usersRepository.save({
      id: userId,
      ...updateUserDto,
    });
    return updatedUser;
  }

  async deleteUserById(userId: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    await this.usersRepository.remove(user);
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { LoginUserDto } from './models/login-user.dto';
import { RegisterUserDto } from './models/register-user.dto';
import { User } from './models/user.interface';

@Injectable()
export class AuthService {
  private users: User[] = [
    {
      id: 1,
      firstName: 'Ahmed',
      lastName: 'Mikulash',
      email: 'jazdimlacne@motorky.sk',
      password: '$2b$12$s50omJrK/N3yCM6ynZYmNeen9WERDIVTncywePc75.Ul8.9PUk0LK', // Passw0rd!
      role: 'admin',
    },
    {
      id: 2,
      firstName: 'Arpad',
      lastName: 'Toma',
      email: 'mamvelkypeniz@gmail.com',
      password: '$2b$12$FHUV7sHexgNoBbP8HsD4Su/CeiWbuX/JCo8l2nlY1yCo2LcR3SjmC', // P4ssword!
      role: 'user',
    },
  ];

  async validateUser(user: LoginUserDto): Promise<Omit<User, 'password'>> {
    const foundUser = this.users.find((x) => x.email === user.email);
    if (
      foundUser === undefined ||
      (await compare(user.password, foundUser.password)) === false
    ) {
      throw new UnauthorizedException('Incorrect username or password');
    }
    const { password, ...retUser } = foundUser;
    return retUser;
  }

  async registerUser(user: RegisterUserDto): Promise<Omit<User, 'password'>> {
    if (this.users.find((x) => x.email === user.email) !== undefined) {
      throw new BadRequestException('User email must be unique');
    }
    if (user.password !== user.confirmPassword) {
      throw new BadRequestException(
        'Password and Confirmation Password must match',
      );
    }
    const { confirmPassword, ...newUser } = user;
    this.users.push({
      ...newUser,
      password: await hash(user.password, 12),
      id: this.users.length + 1,
    });
    return {
      id: this.users.length,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }

  findById(id: number): Omit<User, 'password'> {
    const foundUser = this.users.find((x) => x.id === id);
    if (foundUser === undefined) {
      throw new BadRequestException(`No user found with id ${id}`);
    }
    const { password, ...user } = foundUser;
    return user;
  }
}

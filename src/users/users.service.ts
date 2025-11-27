import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserAttributes } from './models/user.model';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  private users: UserAttributes[] = [
    {
      id: 1,
      name: "Asmodan",
      email: "redstone@gmail.com",
      password: "$2b$10$W.Duj6uW/AUOqkU6yWM7q.62JLfbYOIsR9IswbI0JRkdc2YwosnLW",
      role: "admin",
      avatarUrl: "",
    },
    {
      id: 3,
      name: "Cassandra",
      email: "cassidy@gmail.com",
      password: "$2b$10$O6aEnfyhZMCZTnvIhjfdSeHNn.bqIVvwqNShfkvb6bKzrO46ekPui",
      role: "admin",
      avatarUrl: "",
    },
  ];

  async findByUserName(username: string): Promise<UserAttributes | undefined> {
    return this.users.find(user => user.email === username);
  }

  async updateAvatarUrl(id: number, avatarUrl: string): Promise<User> {
    const user = this.users.find(u => u.id === id);

    if (!user) {
      throw new NotFoundException(`User ID ${id} not found.`);
    }

    user.avatarUrl = avatarUrl;
    return user as User;
  }

  findAll(page: number = 1, limit: number = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const usersPage = this.users.slice(startIndex, endIndex);
    const totalItems = this.users.length;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: usersPage,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserAttributes> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);

    const newUser: UserAttributes = {
      id: this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1,
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role ?? 'user',
      avatarUrl: '',
    };

    this.users.push(newUser);
    return newUser;
  }

  findOne(id: number) {
    const user = this.users.find(user => user.id === id);
    if (!user) {
      throw new NotFoundException(`User ID ${id} not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDTO) {
    const existingUser = this.findOne(id);
    const index = this.users.findIndex(user => user.id === id);

    this.users[index] = {
      ...existingUser,
      ...updateUserDto,
    };
  }

  remove(id: number) {
    const index = this.users.findIndex(user => user.id === id);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }
}

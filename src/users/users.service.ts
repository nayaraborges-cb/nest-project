import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserAttributes } from './models/user.model';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  async findByUserName(username: string): Promise<UserAttributes | undefined> {
      return this.users.find(user => user.email === username); 
        throw new Error('Method not implemented.');
    }

  async updateAvatarUrl(id: number, avatarUrl: string): Promise<User>
  {
    throw new Error('Method not implemented.');
  }

 findAll(page: number = 1, limit: number = 10) {
    const startIndex = (page -1) * limit;
    const endIndex = page * limit;
    const booksOnePage = this.users.slice(startIndex, endIndex);
    const totalItems = this.users.length;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: booksOnePage,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  private users: UserAttributes[] = [
    {
      id: 1,
      name: "Asmodan",
      email: "redstone@gmail.com",
      password: "$2b$10$W.Duj6uW/AUOqkU6yWM7q.62JLfbYOIsR9IswbI0JRkdc2YwosnLW",
      role: "admin",
    },
  ]
  usersService: any;

   async create(createUserDto: CreateUserDto): Promise<UserAttributes> {

      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
      const newUser: UserAttributes = {
          id: this.users.length > 0 ? Math.max(...this.users.map(b => b.id)) + 1 : 1,
          ...createUserDto,
          password: hashedPassword,
          role: (createUserDto as any).role ?? (createUserDto as any).role ?? [],
      };
      this.users.push(newUser);
      return newUser;
    }
 

  findOne(id: number) {
    const user = this.users.find(user => user.id === id) 
    if (!user) {
      throw new NotFoundException(`User ID ${id} not found`)
    }
    return user
  }

  update(id: number, updateUserDto: UpdateUserDTO) {
    const existingUser = this.findOne(id)
    if (existingUser as any) {
      const index = this.users.findIndex(user => user.id === id)
      this.users[index] = {
        id,
        ...updateUserDto,
      } as UserAttributes;
    }
  }

  remove(id: number) {
    const index = this.users.findIndex( user => user.id === id)
    if (index >= 0) {
      this.users.splice(index, 1)
    }
  }
}

import { Injectable } from '@nestjs/common';
import { UserStatus } from '@feedback/schema';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async findUserById(id: string) {
    return this.userRepository.findOne({ id });
  }

  async createUser(name: string, email: string) {
    return this.userRepository.create({
      name,
      email,
    });
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    return this.userRepository.updateUser(userId, { status: status });
  }

  async createGoogleUser(name: string, email: string, status: UserStatus) {
    return this.userRepository.create({
      name,
      email,
      status,
    });
  }
  }

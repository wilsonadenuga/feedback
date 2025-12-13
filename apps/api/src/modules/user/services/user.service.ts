import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  async createUser(name: string, email: string) {
    return this.userRepository.create({
      name,
      email,
    });
  }
}

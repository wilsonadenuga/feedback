import { Injectable } from '@nestjs/common';
import { version, name } from '../../../package.json';

@Injectable()
export class AppService {
  getHello(): { name: string; version: string } {
    return {
      name: name,
      version: version,
    };
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class PropertiesService {
  getHello(): string {
    return 'Hello World!';
  }
}

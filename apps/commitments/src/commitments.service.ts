import { Injectable } from '@nestjs/common';

@Injectable()
export class CommitmentsService {
  getHello(): string {
    return 'Hello World!';
  }
}

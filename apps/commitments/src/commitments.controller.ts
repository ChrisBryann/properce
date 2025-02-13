import { Controller, Get } from '@nestjs/common';
import { CommitmentsService } from './commitments.service';

@Controller()
export class CommitmentsController {
  constructor(private readonly commitmentsService: CommitmentsService) {}

  @Get()
  getHello(): string {
    return this.commitmentsService.getHello();
  }
}

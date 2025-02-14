import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CommitmentsService } from './commitments.service';
import { AuthGatewayGuard } from '@app/common/auth-gateway/auth-gateway.guard';
import { CurrentUserDecorator } from 'apps/auth/src/decorators/current-user.decorator';
import { PublicUser } from 'apps/users/src/entities/user.entity';
import { CreateCommitmentDto } from './dto/create-commitment.dto';

@UseGuards(AuthGatewayGuard)
@Controller('commitments')
export class CommitmentsController {
  constructor(private readonly commitmentsService: CommitmentsService) {}

  @Get()
  getHello(): string {
    return this.commitmentsService.getHello();
  }

  @Post()
  async create(@CurrentUserDecorator() user: PublicUser, @Body() createCommitmentDto: CreateCommitmentDto) {
    return await this.commitmentsService.create(user.id, createCommitmentDto);
  } 

  @Get(':listingId') // for seller and admins
  async findAllByListingId(@CurrentUserDecorator() user: PublicUser, @Param('listingId') listingId: string) {
    return await this.commitmentsService.findAllByListingId(user.id, listingId);
  }

  @Get('status/:listingId') // for seller and admins
  async getAggregatedDataByListingId(@CurrentUserDecorator() user: PublicUser, @Param('listingId') listingId: string) {
    return await this.commitmentsService.getAggregatedDataByListingId(user.id, listingId);
  }

  @Put(':id/cancel')
  async cancelCommitment(@CurrentUserDecorator() user: PublicUser, @Param('id') id: string) {
    return await this.commitmentsService.cancelCommitment(user.id, id);
  }
}

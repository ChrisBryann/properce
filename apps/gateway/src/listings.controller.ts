import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUserDecorator } from 'apps/auth/src/decorators/current-user.decorator';
import { PublicUser } from 'apps/users/src/entities/user.entity';
import { AuthGatewayGuard } from '@app/common/auth-gateway/auth-gateway.guard';
import { CreateListingDto } from 'apps/listings/src/dto/create-listing.dto';
import { UpdateListingDto } from 'apps/listings/src/dto/update-listing.dto';
import { ListingsService } from 'apps/listings/src/listings.service';

@UseGuards(AuthGatewayGuard)
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get('hello')
  getHello(): string {
    return this.listingsService.getHello();
  }

  @Post()
  async create(
    @CurrentUserDecorator() user: PublicUser,
    @Body() createListingDto: CreateListingDto,
  ) {
    return await this.listingsService.create(user.id, createListingDto);
  }

  @Get()
  async findAll(@CurrentUserDecorator() user: PublicUser) {
    return await this.listingsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(
    @CurrentUserDecorator() user: PublicUser,
    @Param('id') id: string,
  ) {
    return await this.listingsService.findOne(id);
  }

  @Put(':id')
  async update(
    @CurrentUserDecorator() user: PublicUser,
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return await this.listingsService.update(user.id, id, updateListingDto);
  }

  @Delete(':id')
  async remove(
    @CurrentUserDecorator() user: PublicUser,
    @Param('id') id: string,
  ) {
    return await this.listingsService.remove(user.id, id);
  }

  @Put(':id/close')
  async closeListing(
    @CurrentUserDecorator() user: PublicUser,
    @Param('id') id: string,
  ) {
    await this.listingsService.closeListing(user.id, id);
  }
}

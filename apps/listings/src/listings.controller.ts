import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CurrentUserDecorator } from 'apps/auth/src/decorators/current-user.decorator';
import { PublicUser } from 'apps/users/src/entities/user.entity';
import { AuthGatewayGuard } from '@app/common/auth-gateway/auth-gateway.guard';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@UseGuards(AuthGatewayGuard)
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get('hello')
  getHello(): string {
    return this.listingsService.getHello();
  }

  @Post()
  create(@CurrentUserDecorator() user: PublicUser, @Body() createListingDto: CreateListingDto) {
    return this.listingsService.create(user.id, createListingDto);
  }

  @Get()
  findAll(@CurrentUserDecorator() user: PublicUser) {
    return this.listingsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUserDecorator() user: PublicUser, @Param('id') id: string) {
    return this.listingsService.findOne(user.id, id);
  }

  @Put(':id')
  update(@CurrentUserDecorator() user: PublicUser, @Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this.listingsService.update(user.id, id, updateListingDto);
  }

  @Delete(':id')
  remove(@CurrentUserDecorator() user: PublicUser, @Param('id') id: string) {
    return this.listingsService.remove(user.id, id);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { AuthGatewayGuard } from '@app/common/auth-gateway/auth-gateway.guard';
import { CurrentUserDecorator } from 'apps/auth/src/decorators/current-user.decorator';
import { PublicUser } from 'apps/users/src/entities/user.entity';

@UseGuards(AuthGatewayGuard)
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  getHello(): string {
    return this.propertiesService.getHello();
  }

  @Post()
  async addProperty(
    @CurrentUserDecorator() user: PublicUser,
    @Body() addPropertyDto: AddPropertyDto,
  ) {
    return await this.propertiesService.addProperty(user.id, addPropertyDto);
  }

  @Get('seller')
  async getAllPropertiesBySeller(@CurrentUserDecorator() user: PublicUser) {
    // enable pagination
    return await this.propertiesService.getProperty({
      sellerId: user.id,
    });
  }

  @Get(':propertyId')
  async getPropertyById(@Param('propertyId') propertyId: string) {
    return await this.propertiesService.getProperty({
      id: propertyId,
    });
  }

  @Get('search')
  async getPropertyByFilter(
    @Query() query: { type?: string; min_price?: string; province_id?: string },
  ) {
    return await this.propertiesService.getProperty({
      type: query.type,
      province: query.province_id,
    });
  }
}

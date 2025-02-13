import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGatewayGuard } from '@app/common/auth-gateway/auth-gateway.guard';
import { CurrentUserDecorator } from 'apps/auth/src/decorators/current-user.decorator';
import { PublicUser } from 'apps/users/src/entities/user.entity';

@UseGuards(AuthGatewayGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@CurrentUserDecorator() user: PublicUser, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(user.id, createProductDto);
  }

  @Get()
  findAll(@CurrentUserDecorator() user: PublicUser) {
    return this.productsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUserDecorator() user: PublicUser, @Param('id') id: string) {
    return this.productsService.findOne(user.id, id);
  }

  @Put(':id')
  update(@CurrentUserDecorator() user: PublicUser, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(user.id, id, updateProductDto);
  }

  @Delete(':id')
  remove(@CurrentUserDecorator() user: PublicUser, @Param('id') id: string) {
    return this.productsService.remove(user.id, id);
  }
}

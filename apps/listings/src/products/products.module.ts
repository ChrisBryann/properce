import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { User } from 'apps/users/src/entities/user.entity';
import { AuthGatewayModule } from '@app/common/auth-gateway/auth-gateway.module';

@Module({
  imports: [AuthGatewayModule, TypeOrmModule.forFeature([Product, User])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService, AuthGatewayModule],
})
export class ProductsModule {}

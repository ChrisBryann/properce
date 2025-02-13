import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { ProductListing } from './entities/product-listing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/listings/.env.development',
    }),
    ProductsModule,
    DatabaseModule,
    TypeOrmModule.forFeature([ProductListing]),
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}

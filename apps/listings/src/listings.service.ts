import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductListing } from './entities/product-listing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ProductsService } from './products/products.service';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(ProductListing)
    private readonly productListingRepository: Repository<ProductListing>,
    private readonly productService: ProductsService,
  ) {}
  async create(sellerId: string, createListingDto: CreateListingDto) {
    // find the product from productId and confirm if it's from the same seller
    try {
      await this.productService.findOne(sellerId, createListingDto.productId);
    } catch (error) {
      throw new ForbiddenException(
        'Product in this listing does not belong to this seller!',
      );
    }

    const productListing = this.productListingRepository.create({
      ...createListingDto,
      product: {
        id: createListingDto.productId,
      },
    });
    return await this.productListingRepository.save(productListing);
  }

  async findAll(sellerId: string) {
    return await this.productListingRepository.find({
      where: {
        product: {
          seller: {
            id: sellerId,
          },
        },
      },
      select: {
        product: {
          seller: {
            id: true,
          },
        },
      },
      relations: {
        product: {
          seller: true,
        },
      },
    });
  }

  async findOne(sellerId: string, id: string) {
    const productListing = await this.productListingRepository.findOneBy({
      id,
    });

    if (!productListing) {
      throw new NotFoundException('Product listing does not exist!');
    }

    if (productListing.product.seller.id !== sellerId) {
      throw new ForbiddenException(
        'Product in this listing does not belong to this seller!',
      );
    }

    return productListing;
  }

  async update(
    sellerId: string,
    id: string,
    updateListingDto: UpdateListingDto,
  ) {
    await this.findOne(sellerId, id);

    return await this.productListingRepository.update(
      {
        id,
      },
      {
        ...updateListingDto,
        ...(updateListingDto.productId && {
          product: {
            id: updateListingDto.productId,
          },
        }),
      },
    );
  }

  async remove(sellerId: string, id: string) {
    await this.productListingRepository.remove(
      await this.findOne(sellerId, id),
    );
  }

  getHello(): string {
    return 'Hello World!';
  }
}

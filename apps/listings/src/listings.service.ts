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
import { InjectQueue } from '@nestjs/bullmq';
import { LISTING_BMQ } from '@app/common/bullmq/bullmq.constant';
import { Queue } from 'bullmq';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(ProductListing)
    private readonly productListingRepository: Repository<ProductListing>,
    private readonly productService: ProductsService,
    @InjectQueue(LISTING_BMQ) private readonly listingQueue: Queue,
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

    const listing = this.productListingRepository.create({
      ...createListingDto,
      deadline: new Date(createListingDto.deadline),
      product: {
        id: createListingDto.productId,
      },
    });
    // send out an event to queue to close the listing when deadline is met
    await this.listingQueue.add(
      'closeListing',
      {
        id: listing.id,
        sellerId,
      },
      {
        delay: listing.deadline.getTime() - Date.now(),
        jobId: listing.id,
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
    return await this.productListingRepository.save(listing);
  }

  async findAll(sellerId: string) {
    // return await this.productListingRepository.find({
    //   where: {
    //     expired: false,
    //     product: {
    //       seller: {
    //         id: sellerId,
    //       },
    //     },
    //   },
    //   select: {
    //     product: {
    //       id: true,
    //       seller: {
    //         id: true,
    //       },
    //     },
    //   },
    //   relations: {
    //     product: {
    //       seller: true,
    //     },
    //   },
    // });
    return await this.productListingRepository
      .createQueryBuilder('listing')
      .leftJoin('listing.product', 'product')
      .addSelect('product.id')
      .addSelect('product.seller')
      // Join seller, but don't use leftJoinAndSelect for seller so we can limit its fields
      .leftJoin('product.seller', 'seller')
      .addSelect('seller.id')
      .where('seller.id = :id', { id: sellerId })
      .andWhere('listing.expired = :expired', { expired: false })
      .getMany();
  }

  async findOne(id: string) {
    // const listing = await this.productListingRepository.findOne({
    //   where: {
    //     id,
    //     expired: false,
    //   },
    //   select: {
    //     product: {
    //       id: true,
    //       seller: {
    //         id: true,
    //       },
    //     },
    //   },
    //   relations: {
    //     product: {
    //       seller: true,
    //     },
    //   },
    // });

    const listing = await this.productListingRepository
      .createQueryBuilder('listing')
      .leftJoin('listing.product', 'product')
      .addSelect('product.id')
      .addSelect('product.seller')
      // Join seller, but don't use leftJoinAndSelect for seller so we can limit its fields
      .leftJoin('product.seller', 'seller')
      .addSelect('seller.id')
      .where('listing.id = :id', { id })
      .andWhere('listing.expired = :expired', { expired: false })
      .getOne();

    if (!listing) {
      throw new NotFoundException('Product listing does not exist!');
    }

    // if (listing.product.seller.id !== sellerId) {
    //   throw new ForbiddenException(
    //     'Product in this listing does not belong to this seller!',
    //   );
    // }

    return listing;
  }

  async update(
    sellerId: string,
    id: string,
    updateListingDto: UpdateListingDto,
  ) {
    await this.findOne(id);

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
    const listing = await this.findOne(id);
    if (listing.product.seller.id !== sellerId) {
      throw new ForbiddenException(
        'This listing does not belong to this seller!',
      );
    }
    const job = await this.listingQueue.getJob(id);
    await job?.remove();
    await this.productListingRepository.remove(listing);
  }

  async closeListing(sellerId: string, id: string) {
    await this.listingQueue.add(
      'closeListing',
      {
        id,
        sellerId,
      },
      {
        jobId: id,
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }

  async closeExpiredListing(id: string) {
    await this.productListingRepository.update(
      {
        id,
      },
      {
        expired: true,
      },
    );
  }

  getHello(): string {
    return 'Hello World!';
  }
}

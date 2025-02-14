import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCommitmentDto } from './dto/create-commitment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Commitment } from './entities/commitment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommitmentsService {
  constructor(
    @InjectRepository(Commitment)
    private readonly commitmentRepository: Repository<Commitment>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async create(buyerId: string, createCommitmentDto: CreateCommitmentDto) {
    const commitment = await this.commitmentRepository.create({
      quantity: createCommitmentDto.quantity,
      buyer: {
        id: buyerId,
      },
      listing: {
        id: createCommitmentDto.listingId,
      },
    });
    return await this.commitmentRepository.save(commitment);
  }

  async findOne(id: string) {
    return await this.commitmentRepository.findOne({
      where: {
        id,
      },
      select: {
        buyer: {
          id: true,
        },
        listing: {
          product: {
            seller: {
              id: true,
            },
          },
        },
      },
    });
  }

  async findAllByListingId(sellerId: string, listingId: string, excludeListing = true) {
    // find all commitments that are tied to the seller's listing
    return await this.commitmentRepository.find({
      where: {
        listing: {
          id: listingId,
          product: {
            seller: {
              id: sellerId,
            },
          },
        },
      },
      select: {
        buyer: {
          id: true,
        },
        listing: {
          id: excludeListing,
          product: {
            seller: {
              id: true,
            },
          },
        },
      },
      relations: {
        buyer: true,
        listing: true,
      },
    });
  }

  async getAggregatedDataByListingId(sellerId: string, listingId: string) {
    // total quantity committed, threshold status, remaining time
    const commitments = await this.findAllByListingId(sellerId, listingId, false);
    return {
      totalCommitments: commitments.length,
      minThreshold:
        commitments.length > 0 ? commitments[0].listing.minThreshold : 0,
      remainingTime:
        commitments.length > 0
          ? commitments[0].listing.deadline.getTime() - Date.now()
          : 0,
    };
  }

  async cancelCommitment(buyerId: string, id: string) {
    const commitment = await this.findOne(id);
    if (commitment.buyer.id !== buyerId) {
      throw new ForbiddenException('This commitment does not belong to this buyer!');
    }

    if(commitment.listing.deadline.getTime() < Date.now()){
      // this listing window has closed, so commitment must be locked
      throw new ForbiddenException('This listing window has closed and this commitment cannot be cancelled!')
    }
    await this.commitmentRepository.remove(commitment);
  }
}

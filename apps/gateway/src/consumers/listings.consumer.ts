import { LISTING_BMQ } from '@app/common/bullmq/bullmq.constant';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import {
  COMMITMENTS_MICROSERVICE,
  LISTINGS_MICROSERVICE,
  ORDERS_MICROSERVICE,
} from '../gateway.constant';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UpdateListingDto } from 'apps/listings/src/dto/update-listing.dto';
import { ProductListing } from 'apps/listings/src/entities/product-listing.entity';
import { Commitment } from 'apps/commitments/src/entities/commitment.entity';
import { CreateOrderDto } from 'apps/orders/src/dto/create-order.dto';
import { OrderStatus } from '@app/common/enums/order-status.enum';

@Processor(LISTING_BMQ)
export class ListingsConsumer extends WorkerHost {
  private readonly logger: Logger = new Logger(ListingsConsumer.name);
  constructor(
    @Inject(LISTINGS_MICROSERVICE)
    private readonly listingsMicroservice: ClientProxy,
    @Inject(COMMITMENTS_MICROSERVICE)
    private readonly commitmentsMicroservice: ClientProxy,
    @Inject(ORDERS_MICROSERVICE)
    private readonly ordersMicroservice: ClientProxy,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case 'closeListing':
        // find out if this listing totalCommitment >= minThreshold
        // if true, send out an order job event for creating the order (order bulk)
        // else,  mark this listing as expired

        const { id: listingId, sellerId } = job.data;
        // find out if this listing totalCommitment >= minThreshold
        const aggregatedCommitmentData = await firstValueFrom(
          this.commitmentsMicroservice.send(
            { cmd: 'getAggregatedDataByListingId' },
            {
              userId: sellerId,
              listingId,
            },
          ),
        );

        if (
          aggregatedCommitmentData.totalCommitments >=
          aggregatedCommitmentData.minThreshold
        ) {
          const listing: ProductListing = await firstValueFrom(
            this.listingsMicroservice.send(
              {
                cmd: 'getListingById',
              },
              {
                id: listingId,
              },
            ),
          );
          const commitments: Commitment[] = await firstValueFrom(
            this.commitmentsMicroservice.send(
              {
                cmd: 'findAllByListingId',
              },
              {
                userId: sellerId,
                listingId,
              },
            ),
          );
          // lock the listing and set the final price
          const finalPrice =
            ((Math.random() * aggregatedCommitmentData.totalCommitments) /
              aggregatedCommitmentData.totalCommitments) *
            listing.proposedPrice;

          await firstValueFrom(
            this.listingsMicroservice.send(
              { cmd: 'updateListingId' },
              {
                userId: sellerId,
                id: listingId,
                updateListingDto: {
                  locked: true,
                  finalPrice,
                } as UpdateListingDto,
              },
            ),
          );
          // send out an order job event for creating the order (order bulk)
          await this.ordersMicroservice.emit('createOrderBulk', {
            createOrderDtos: commitments.map(
              (commitment) =>
                ({
                  commitmentId: commitment.id,
                  buyerId: commitment.buyer.id,
                  price: finalPrice,
                  lockedAt: listing.updatedAt.toDateString(), // TODO: not sure if correct/accurate
                  shippingAddress: '1211 Ratel St', // TODO: add shippingAddress attribute to User
                  status: OrderStatus.Pending,
                }) as CreateOrderDto,
            ),
          });
        } else {
          // mark this listing as expired
          this.listingsMicroservice.emit('closeExpiredListing', {
            id: listingId,
          });
        }

        return {};

      default:
        break;
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(
      `Completed job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: any) {
    this.logger.log(
      `Job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)} has failed.\nError details: ${JSON.stringify(error)}`,
    );
  }

  @OnWorkerEvent('error')
  onError(failedReason: any) {
    this.logger.log(
      `Error occured while running job: ${JSON.stringify(failedReason)}.`,
    );
  }
}

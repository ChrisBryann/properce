import { LISTING_BMQ } from '@app/common/bullmq/bullmq.constant';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { ListingsService } from './listings.service';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { CommitmentsService } from 'apps/commitments/src/commitments.service';

@Processor(LISTING_BMQ)
export class ListingConsumer extends WorkerHost {
  private readonly logger: Logger = new Logger(ListingConsumer.name);
  constructor(
    private readonly listingService: ListingsService,
    private readonly commitmentsService: CommitmentsService,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case 'closeListing': {
        // find out if this listing totalCommitment >= minThreshold
        // if true, send out an order job event for creating the order (order bulk)
        // else,  mark this listing as expired

        const { id: productId, sellerId } = job.data;
        // find out if this listing totalCommitment >= minThreshold
        const aggregatedCommitmentData =
          await this.commitmentsService.getAggregatedDataByListingId(
            sellerId,
            productId,
          );
        if (
          aggregatedCommitmentData.totalCommitments >=
          aggregatedCommitmentData.minThreshold
        ) {
          // send out an order job event for creating the order (order bulk)
        } else {
          // mark this listing as expired
          await this.listingService.closeExpiredListing(productId);
        }

        return {};
      }

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

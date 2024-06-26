import type { S3ClientConfig } from '@aws-sdk/client-s3';
import type { IBucketData } from './bucket-data.interface';

export interface S3Options {
  clientConfig: S3ClientConfig;
  bucketData: IBucketData;
}

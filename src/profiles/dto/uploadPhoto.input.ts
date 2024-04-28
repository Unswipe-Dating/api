import { InputType, Field } from '@nestjs/graphql';
import { ReadStream } from 'fs';
import { GraphQLUpload } from 'graphql-upload';

export interface FileUploadType {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(): ReadStream;
  userId: string;
}

@InputType()
export class UploadProfilePhotosInput {
  @Field(() => [GraphQLUpload])
  files: [Promise<FileUploadType>];
}

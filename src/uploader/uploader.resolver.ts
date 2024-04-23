import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { createWriteStream } from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@Resolver()
export class UploadResolver {
  @Mutation(() => Boolean)
  async singleUpload(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
  ) {
    // TODO: upload to S3. And allow multiple images to be uploaded here.
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(`./uploads/${filename}`))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );
  }
}

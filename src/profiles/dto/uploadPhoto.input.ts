import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UploadPhotosInput {
  @Field()
  @IsNotEmpty()
  id: string;
}

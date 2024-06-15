import { Request } from "./request.model";
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreateRequest extends Request {
    @Field(() => String, { nullable: true })
    userProfileImage?: string;
  
    @Field(() => String, { nullable: true })
    requesteeProfileImage?: string;
}
import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestResolver } from './request.resolver';

@Module({
  imports: [],
  providers: [RequestService, RequestResolver],
})
export class RequestModule {}

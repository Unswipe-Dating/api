import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestResolver } from './request.resolver';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [],
  providers: [RequestService, RequestResolver, DatabaseService],
})
export class RequestModule {}

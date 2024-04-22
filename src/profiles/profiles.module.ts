import { Module } from '@nestjs/common';
import { ProfilesResolver } from './profiles.resolver';
import { DatabaseService } from '../database/database.service';

@Module({
  imports: [],
  providers: [ProfilesResolver, DatabaseService],
})
export class ProfileModule {}

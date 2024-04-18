import { Module } from '@nestjs/common';
import { ProfilesResolver } from './profiles.resolver';

@Module({
  imports: [],
  providers: [ProfilesResolver],
})
export class ProfileModule {}

import { Module } from '@nestjs/common';
import { ProfilesResolver } from './profiles.resolver';
import { DatabaseService } from '../database/database.service';
import { UploaderModule } from 'src/uploader/uploader.module';
import config from '../common/configs/config';
@Module({
  imports: [UploaderModule.forRoot(config().s3Config)],
  providers: [ProfilesResolver, DatabaseService],
})
export class ProfileModule {}

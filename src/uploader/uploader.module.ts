import { DynamicModule, Global, Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { UPLOADER_OPTIONS } from './constants';
import { S3Options } from './interfaces';

@Global()
@Module({})
export class UploaderModule {
  public static forRoot(options: S3Options): DynamicModule {
    return {
      global: true,
      module: UploaderModule,
      providers: [
        {
          provide: UPLOADER_OPTIONS,
          useValue: options,
        },
        UploaderService,
      ],
      exports: [UploaderService],
    };
  }
}

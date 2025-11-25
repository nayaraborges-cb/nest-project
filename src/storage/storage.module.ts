import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [ConfigModule],
  providers: [
    StorageService,
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService) => {
        const endpoint = configService.get<string>('MINIO_ENDPOINT');
        const port = configService.get<string>('MINIO_PORT');
        const accessKeyId = configService.get<string>('MINIO_ACCESS_KEY');
        const secretAccessKey = configService.get<string>('MINIO_SECRET_KEY');

        if (!endpoint || !port || !accessKeyId || !secretAccessKey) {
          throw new Error('Variáveis de ambiente MinIO não definidas corretamente');
        }

        return new S3Client({
          region: 'us-east-1',
          endpoint: 'http://${endpoint}:${port}',
          credentials: { accessKeyId, secretAccessKey },
          forcePathStyle: true,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}

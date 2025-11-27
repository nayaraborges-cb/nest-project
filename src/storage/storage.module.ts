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
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const endpoint = config.get<string>('MINIO_ENDPOINT');
        const port = config.get<string>('MINIO_PORT');
        const accessKeyId = config.get<string>('MINIO_ACCESS_KEY');
        const secretAccessKey = config.get<string>('MINIO_SECRET_KEY');

        if (!endpoint || !port || !accessKeyId || !secretAccessKey) {
          throw new Error('Variáveis de ambiente MinIO não definidas corretamente');
        }

        return new S3Client({
          region: 'us-east-1',
          endpoint: `${endpoint}:${port}`,
          credentials: { accessKeyId, secretAccessKey },
          forcePathStyle: true,
        });
      },
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}

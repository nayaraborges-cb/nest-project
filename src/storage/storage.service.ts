import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  updateFile(file: Express.Multer.File, arg1: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private configService: ConfigService,
    @Inject('S3_CLIENT') private readonly s3Client: S3Client, 
  ) {}

async uploadFile(file: Express.Multer.File, folder: string, fileKey?: string): Promise<string> {
  const bucketName = this.configService.get<string>('MINIO_BUCKET_NAME')!;
  const key = fileKey ?? `${folder}/${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return key;
    } catch (error) {
      console.error('Erro ao fazer upload para MinIO:', error);
      throw new InternalServerErrorException('Falha ao fazer upload do arquivo.');
    }
  }
}

import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export interface PresignedUrlOptions {
  contentType?: string
  expiresInSeconds?: number
}

@Injectable()
export class StorageService {
  private readonly client: S3Client

  constructor(private readonly config: ConfigService) {
    this.client = new S3Client({
      region: this.config.get<string>("S3_REGION", "us-east-1"),
      endpoint: this.config.get<string>("S3_ENDPOINT", "http://localhost:9000"),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.config.get<string>("S3_ACCESS_KEY", "minioadmin"),
        secretAccessKey: this.config.get<string>("S3_SECRET_KEY", "minioadmin"),
      },
    })
  }

  async getPresignedUploadUrl(
    bucket: string,
    objectKey: string,
    options?: PresignedUrlOptions,
  ): Promise<string> {
    const expiresIn = options?.expiresInSeconds ?? 60 * 5
    const contentType = options?.contentType
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: contentType,
    })
    return getSignedUrl(this.client, command, { expiresIn })
  }
}

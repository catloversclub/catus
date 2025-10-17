import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { S3Client } from "@aws-sdk/client-s3"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"

export interface PresignedUrlOptions {
  contentType?: string
  expiresInSeconds?: number
  maxSizeBytes?: number
}

export interface PresignedPostResponse {
  url: string
  fields: Record<string, string>
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
  ): Promise<PresignedPostResponse> {
    const expiresIn = options?.expiresInSeconds ?? 60 * 2
    const contentType = options?.contentType
    const maxSizeBytes = options?.maxSizeBytes ?? 10 * 1024 * 1024

    const conditions: any[] = [["content-length-range", 0, maxSizeBytes]]

    if (contentType) {
      conditions.push(["eq", "$Content-Type", contentType])
    }

    const { url, fields } = await createPresignedPost(this.client, {
      Bucket: bucket,
      Key: objectKey,
      Conditions: conditions,
      Fields: contentType ? { "Content-Type": contentType } : {},
      Expires: expiresIn,
    })

    return { url, fields }
  }
}

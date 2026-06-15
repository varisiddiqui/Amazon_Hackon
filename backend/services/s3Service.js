import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { awsConfig, isAwsConfigured } from "../config/aws.js";

let s3Client = null;

function getClient() {
  if (!isAwsConfigured()) {
    throw new Error("AWS S3 is not configured. Set AWS_* variables in .env");
  }
  if (!s3Client) {
    s3Client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }
  return s3Client;
}

function buildPublicUrl(key) {
  return `https://${awsConfig.s3Bucket}.s3.${awsConfig.region}.amazonaws.com/${key}`;
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export async function checkS3Connection() {
  if (!isAwsConfigured()) {
    return { ok: false, message: "AWS credentials not configured" };
  }
  try {
    const client = getClient();
    await client.send(new HeadBucketCommand({ Bucket: awsConfig.s3Bucket }));
    return { ok: true, bucket: awsConfig.s3Bucket, region: awsConfig.region };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

/**
 * Upload buffer to S3
 * @returns {{ key, url, bucket, size }}
 */
export async function uploadToS3({ buffer, fileName, mimeType, folder, userId }) {
  const client = getClient();
  const safeName = sanitizeFileName(fileName);
  const key = `${folder}/${userId}/${Date.now()}-${safeName}`;

  await client.send(
    new PutObjectCommand({
      Bucket: awsConfig.s3Bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: {
        uploadedBy: String(userId),
        originalName: safeName,
      },
    })
  );

  return {
    key,
    url: buildPublicUrl(key),
    bucket: awsConfig.s3Bucket,
    size: buffer.length,
    fileName: safeName,
    mimeType,
  };
}

export async function deleteFromS3(key) {
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: awsConfig.s3Bucket,
      Key: key,
    })
  );
}

/** Presigned URL for direct browser upload (expires in 5 min) */
export async function getPresignedUploadUrl({ fileName, mimeType, folder, userId }) {
  const client = getClient();
  const safeName = sanitizeFileName(fileName);
  const key = `${folder}/${userId}/${Date.now()}-${safeName}`;

  const command = new PutObjectCommand({
    Bucket: awsConfig.s3Bucket,
    Key: key,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });

  return {
    uploadUrl,
    key,
    publicUrl: buildPublicUrl(key),
    expiresIn: 300,
  };
}

/** Presigned URL to download private files */
export async function getPresignedDownloadUrl(key) {
  const client = getClient();
  const command = new GetObjectCommand({
    Bucket: awsConfig.s3Bucket,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn: 3600 });
}

export { awsConfig, buildPublicUrl };

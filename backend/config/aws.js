export const awsConfig = {
  region: process.env.AWS_REGION || "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: process.env.AWS_S3_BUCKET || "campusflow-uploads",
  sesFromEmail: process.env.AWS_SES_FROM_EMAIL || "noreply@campusflow.app",
};

export function isAwsConfigured() {
  return Boolean(
    awsConfig.accessKeyId &&
      awsConfig.secretAccessKey &&
      awsConfig.s3Bucket &&
      awsConfig.region
  );
}

export function isSesConfigured() {
  return isAwsConfigured() && Boolean(awsConfig.sesFromEmail);
}

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"



const bucketName = 'officemart-images'
const region = 'ap-south-1';
const accessKeyId = 'AKIAZI2LF6CAVGIWQ6GS'
const secretAccessKey = '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'


const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

//to post to bucket
export function uploadFile(fileBuffer: any, fileName: string, mimetype: string) {

  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimetype,
  };
  return s3Client.send(new PutObjectCommand(uploadParams));

};

//get from bucket
export async function getObjectSignedUrl(key: string) {
  const params = {
    Bucket: bucketName,
    Key: key 
  }

  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3Client, command);

  return url
};

// delete from bucket
export function deleteFile(fileName: string) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  }

  return s3Client.send(new DeleteObjectCommand(deleteParams));
}




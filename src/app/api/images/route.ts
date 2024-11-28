import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3BucketName = process.env.S3_BUCKET_NAME;

if (!accessKeyId || !secretAccessKey || !s3BucketName) {
  throw new Error("Missing data in .env file");
}

//Initializaing S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function POST(request: Request) {
  try {
    //Parse the request to get the image file
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Validate file existence
    if (!file) {
      return new Response(JSON.stringify({ error: "File is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    //Generating a unique name for every uploaded file
    const fileKey = `${uuidv4()}_${file.name}`;

    //Preparing the upload
    const uploadParams = {
      Bucket: s3BucketName,
      Key: fileKey,
      Body: Buffer.from(await file.arrayBuffer()), //Converts the file into binary format
      ContentType: file.type,
    };

    //Uploading to S3
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    return new Response(
      JSON.stringify({
        message: "Image uploaded successfully",
        filekey: fileKey,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to upload image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

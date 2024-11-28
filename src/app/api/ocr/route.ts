import {
  RekognitionClient,
  DetectTextCommand,
  TextDetection,
} from "@aws-sdk/client-rekognition";

import { regionConfigs, getConfig } from "./config";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3BucketName = process.env.S3_BUCKET_NAME;

if (!accessKeyId || !secretAccessKey || !s3BucketName) {
  throw new Error("Missing data in .env file");
}

//Initializing Rekognition client
const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function POST(request: Request) {
  try {
    // Parse the request
    const { fileKey, state } = await request.json();

    // Validate
    if (!fileKey || !state) {
      return new Response(
        JSON.stringify({ error: "File key and State are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    //Fetch country and states configurations

    const { country, noiseWords, stateConfig } = getConfig(state);

    // Preparing the Rekognition parameters
    const params = {
      Image: {
        S3Object: {
          Bucket: s3BucketName,
          Name: fileKey,
        },
      },
    };

    // Use AWS Rekognition to detect text in the image
    const command = new DetectTextCommand(params);
    const response = await rekognition.send(command);

    // Parse response
    const detectedTextObjects = response.TextDetections || [];

       if (detectedTextObjects.length == 0) {
         return new Response(JSON.stringify({ error: "No text detected" }), {
           status: 400,
           headers: { "Content-Type": "application/json" },
         });
       }


    //Checks for filtering texts
    const isAlphaNumeric = (text: string) => /^[A-Z0-9\s-]+$/.test(text);
    const isNotNoise = (text: string) =>
      !noiseWords.includes(text.toUpperCase());
    const matchesAnyStateRegex = (text: string) =>
      Object.values(stateConfig).some((state) => state.regex.test(text)); // Validate against all state regexes

    //Process LINEs first: plates with LINE type text can be broken down into seperate words by Rekognition
    const validLine = detectedTextObjects
      .filter((detectedTextObject) => detectedTextObject.Type === "LINE")
      .map((detectedTextObject) => detectedTextObject.DetectedText || "")
      .find(
        (detectedText) =>
          isAlphaNumeric(detectedText) &&
          isNotNoise(detectedText) &&
          matchesAnyStateRegex(detectedText)
      );

      console.log(detectedTextObjects)

    //Process WORDs now
    const validWord = detectedTextObjects
      .filter((detectedTextObject) => detectedTextObject.Type === "WORD")
      .map((detectedTextObject) => detectedTextObject.DetectedText || "")
      .find(
        (detectedText) =>
          isAlphaNumeric(detectedText) &&
          isNotNoise(detectedText) &&
          matchesAnyStateRegex(detectedText)
      );

    const licensePlate = validLine || validWord || null;
    return new Response(JSON.stringify({ licensePlate }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error detecting the texts" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

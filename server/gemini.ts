import OpenAI from "openai";
import { Buffer } from "buffer";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export interface GeneratedImageResult {
  success: boolean;
  imageData?: Buffer;
  error?: string;
}

export async function generateImageFromDrawing(
  imageBuffer: Buffer,
  prompt: string,
): Promise<GeneratedImageResult> {
  try {
    // Convert buffer to base64
    const base64Image = imageBuffer.toString("base64");

    console.log("Generating image with prompt:", prompt);

    const response = await client.chat.completions.create({
      model: "google/gemini-2.5-flash-image-preview:free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate an image based on this image and prompt31111111111111111111111111111e111111111111111111111111111111: ${prompt}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    if (response.choices && response.choices[0].message) {
      const message = response.choices[0].message;

      // Print any textual content for debugging
      if (message.content) {
        console.log("Gemini text response:", message.content);
        console.log("Message object keys:", Object.keys(message));
        console.log("Message content type:", typeof message.content);
        console.log("Message content is array:", Array.isArray(message.content));
        if (Array.isArray(message.content)) {
          console.log("Content parts:", message.content.map(part => Object.keys(part)));
        }
      }

      // Extract and save the image from the response - following the known pattern
      if (response.choices && response.choices[0].message) {
        const message = response.choices[0].message;
        
        // Check if there are images in the message
        if (message.images && Array.isArray(message.images)) {
          console.log("Found images array with", message.images.length, "images");
          
          for (const imageData of message.images) {
            if (imageData.type === "image_url" && imageData.image_url && imageData.image_url.url) {
              const dataUrl = imageData.image_url.url;
              if (dataUrl.startsWith("data:image")) {
                console.log("Found image with data URL, extracting base64...");
                // Extract base64 data from data URL - Format: data:image/png;base64,<base64_data>
                const base64Data = dataUrl.split(',', 2)[1];
                
                const imageBuffer = Buffer.from(base64Data, "base64");
                console.log("Successfully extracted image, size:", imageBuffer.length, "bytes");
                
                return {
                  success: true,
                  imageData: imageBuffer,
                };
              }
            }
          }
        } else {
          console.log("No images found in message, checking content array...");
          
          // Fallback: check content array for image parts
          if (Array.isArray(message.content)) {
            for (const part of message.content) {
              if (part.type === "image_url" && part.image_url && part.image_url.url) {
                const dataUrl = part.image_url.url;
                if (dataUrl.startsWith("data:image")) {
                  console.log("Found image in content array, extracting base64...");
                  const base64Data = dataUrl.split(',', 2)[1];
                  
                  const imageBuffer = Buffer.from(base64Data, "base64");
                  console.log("Successfully extracted image from content, size:", imageBuffer.length, "bytes");
                  
                  return {
                    success: true,
                    imageData: imageBuffer,
                  };
                }
              }
            }
          }
        }
        
        // Fallback: Check if the response content contains an image URL
        if (typeof content === "string") {
          const imageUrlRegex =
            /!\[.*?\]\((https:\/\/.*?\.(?:png|jpg|jpeg|gif|webp))\)/g;
          const matches = content.match(imageUrlRegex);

          if (matches && matches.length > 0) {
            const imageUrl = matches[0].match(/\((https:\/\/.*?)\)/)?.[1];
            if (imageUrl) {
              try {
                const response = await fetch(imageUrl);
                const imageBuffer = Buffer.from(await response.arrayBuffer());
                console.log(
                  "Downloaded generated image, size:",
                  imageBuffer.length,
                  "bytes",
                );

                return {
                  success: true,
                  imageData: imageBuffer,
                };
              } catch (fetchError) {
                console.error("Error downloading generated image:", fetchError);
              }
            }
          }
        }
      }

      // If no images found, return error
      console.log("No images found in Gemini response");
      console.log("Full response object:", JSON.stringify(response, null, 2));
      return {
        success: false,
        error: "No images generated by the model",
      };
    }

    return {
      success: false,
      error: "No response from the model",
    };
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    return {
      success: false,
      error: `Failed to generate image: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

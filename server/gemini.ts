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

      // Check for image data in response - from the actual logged structure
      if (response.choices && response.choices[0].message.content) {
        const content = response.choices[0].message.content;
        
        // Gemini returns content as array with text and image parts
        if (Array.isArray(content)) {
          for (const part of content) {
            console.log("Checking part with keys:", Object.keys(part));
            
            // Check for image_url part (standard OpenAI format)
            if (part.type === "image_url" && part.image_url && part.image_url.url) {
              const dataUrl = part.image_url.url;
              if (dataUrl.startsWith("data:image/")) {
                const base64Data = dataUrl.split(',')[1];
                const imageBuffer = Buffer.from(base64Data, "base64");
                console.log("Found base64 image in image_url part, size:", imageBuffer.length, "bytes");
                
                return {
                  success: true,
                  imageData: imageBuffer,
                };
              }
            }
            
            // Check for direct image part (Gemini specific)
            if (part.type === "image" && part.image) {
              let base64Data = part.image;
              // Remove data URL prefix if present
              if (base64Data.includes(',')) {
                base64Data = base64Data.split(',')[1];
              }
              const imageBuffer = Buffer.from(base64Data, "base64");
              console.log("Found base64 image in image part, size:", imageBuffer.length, "bytes");
              
              return {
                success: true,
                imageData: imageBuffer,
              };
            }
            
            // Check for any field containing base64 data
            Object.keys(part).forEach(key => {
              if (typeof part[key] === "string" && part[key].length > 1000 && 
                  (part[key].startsWith("data:image/") || /^[A-Za-z0-9+/=]{100,}$/.test(part[key]))) {
                console.log(`Found potential base64 data in field '${key}', length:`, part[key].length);
                
                let base64Data = part[key];
                if (base64Data.startsWith("data:image/")) {
                  base64Data = base64Data.split(',')[1];
                }
                
                try {
                  const imageBuffer = Buffer.from(base64Data, "base64");
                  console.log("Successfully decoded base64 from field", key, "size:", imageBuffer.length, "bytes");
                  
                  return {
                    success: true,
                    imageData: imageBuffer,
                  };
                } catch (e) {
                  console.log("Failed to decode base64 from field", key);
                }
              }
            });
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

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDrawingSchema } from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";
import { generateImageFromDrawing } from "./gemini";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint for serving public objects (saved drawings)
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Endpoint for getting upload URL for drawings
  app.post("/api/drawings/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Save drawing endpoint
  app.post("/api/drawings", async (req, res) => {
    try {
      const validatedData = insertDrawingSchema.parse(req.body);
      
      const objectStorageService = new ObjectStorageService();
      const normalizedPath = objectStorageService.normalizeObjectEntityPath(
        validatedData.imagePath,
      );
      
      const drawing = await storage.createDrawing({
        ...validatedData,
        imagePath: normalizedPath,
      });
      
      res.json(drawing);
    } catch (error) {
      console.error("Error saving drawing:", error);
      res.status(500).json({ error: "Failed to save drawing" });
    }
  });

  // Get all drawings
  app.get("/api/drawings", async (req, res) => {
    try {
      const drawings = await storage.getAllDrawings();
      res.json(drawings);
    } catch (error) {
      console.error("Error fetching drawings:", error);
      res.status(500).json({ error: "Failed to fetch drawings" });
    }
  });

  // Generate AI image from drawing
  app.post("/api/drawings/:id/generate", async (req, res) => {
    try {
      const { id } = req.params;
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Get the drawing to fetch its image
      const drawings = await storage.getAllDrawings();
      const drawing = drawings.find(d => d.id === id);
      
      if (!drawing) {
        return res.status(404).json({ error: "Drawing not found" });
      }

      // Get the original image from object storage
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(drawing.imagePath);
      
      // Download the image data
      const chunks: Buffer[] = [];
      const stream = objectFile.createReadStream();
      
      await new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', resolve);
        stream.on('error', reject);
      });
      
      const imageBuffer = Buffer.concat(chunks);

      // Generate new image using Gemini
      const result = await generateImageFromDrawing(imageBuffer, prompt);
      
      if (!result.success || !result.imageData) {
        return res.status(500).json({ 
          error: result.error || "Failed to generate image" 
        });
      }

      // Upload the generated image to object storage
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: result.imageData,
        headers: {
          "Content-Type": "image/png",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload generated image");
      }

      // Update the drawing with the generated image path
      const generatedImagePath = objectStorageService.normalizeObjectEntityPath(uploadURL);
      await storage.updateDrawingGeneratedImage(id, generatedImagePath);

      res.json({ 
        success: true, 
        generatedImagePath,
        message: "Image generated successfully"
      });

    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ 
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

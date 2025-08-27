import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDrawingSchema } from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";

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

  const httpServer = createServer(app);
  return httpServer;
}

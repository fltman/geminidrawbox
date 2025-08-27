import { type Drawing, type InsertDrawing } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createDrawing(drawing: InsertDrawing): Promise<Drawing>;
  getAllDrawings(): Promise<Drawing[]>;
  updateDrawingGeneratedImage(id: string, generatedImagePath: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private drawings: Map<string, Drawing>;

  constructor() {
    this.drawings = new Map();
  }

  async createDrawing(insertDrawing: InsertDrawing): Promise<Drawing> {
    const id = randomUUID();
    const drawing: Drawing = { 
      ...insertDrawing, 
      id,
      prompt: insertDrawing.prompt ?? null,
      generatedImagePath: null,
      createdAt: new Date()
    };
    this.drawings.set(id, drawing);
    return drawing;
  }

  async getAllDrawings(): Promise<Drawing[]> {
    return Array.from(this.drawings.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateDrawingGeneratedImage(id: string, generatedImagePath: string): Promise<void> {
    const drawing = this.drawings.get(id);
    if (drawing) {
      const updatedDrawing = { ...drawing, generatedImagePath };
      this.drawings.set(id, updatedDrawing);
    }
  }
}

export const storage = new MemStorage();

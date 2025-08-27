import { type Drawing, type InsertDrawing } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createDrawing(drawing: InsertDrawing): Promise<Drawing>;
  getAllDrawings(): Promise<Drawing[]>;
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
}

export const storage = new MemStorage();

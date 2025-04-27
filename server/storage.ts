import fs from 'fs';
import path from 'path';
import { DrawingStep } from './drawingService';

// Define types for our storage
export type User = {
  id: number;
  username: string;
  password: string; // In a real app, this would be hashed
};

export type Drawing = {
  id: number;
  userId: number | null;
  prompt: string | null;
  inputType: 'text' | 'image';
  inputImageUrl: string | null;
  outputImageUrl: string | null;
  steps: DrawingStep[];
  createdAt: Date;
};

export type InsertDrawing = Omit<Drawing, 'id' | 'createdAt'>;

// Path to our data files
const dataDir = path.resolve(process.cwd(), 'server/data');
const usersPath = path.join(dataDir, 'users.json');
const drawingsPath = path.join(dataDir, 'drawings.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Simple in-memory storage with file persistence
class FileStorage {
  private users: Map<number, User>;
  private drawings: Map<number, Drawing>;
  private userCurrentId: number;
  private drawingCurrentId: number;

  constructor() {
    this.loadData();
  }

  // Load data from files
  private loadData() {
    try {
      // Initialize with empty data
      this.users = new Map();
      this.drawings = new Map();
      this.userCurrentId = 1;
      this.drawingCurrentId = 1;

      // Load users if file exists
      if (fs.existsSync(usersPath)) {
        const userData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        this.users = new Map(userData.users);
        this.userCurrentId = userData.nextId;
      }

      // Load drawings if file exists
      if (fs.existsSync(drawingsPath)) {
        const drawingData = JSON.parse(fs.readFileSync(drawingsPath, 'utf-8'));
        
        // Convert string dates back to Date objects
        const drawings = drawingData.drawings.map(([id, drawing]: [number, Drawing]) => {
          drawing.createdAt = new Date(drawing.createdAt);
          return [id, drawing];
        });
        
        this.drawings = new Map(drawings);
        this.drawingCurrentId = drawingData.nextId;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Initialize with empty data if loading fails
      this.users = new Map();
      this.drawings = new Map();
      this.userCurrentId = 1;
      this.drawingCurrentId = 1;
    }
  }

  // Save data to files
  private saveData() {
    try {
      // Save users
      const userData = {
        users: Array.from(this.users.entries()),
        nextId: this.userCurrentId
      };
      fs.writeFileSync(usersPath, JSON.stringify(userData, null, 2));

      // Save drawings
      const drawingData = {
        drawings: Array.from(this.drawings.entries()),
        nextId: this.drawingCurrentId
      };
      fs.writeFileSync(drawingsPath, JSON.stringify(drawingData, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const id = this.userCurrentId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    this.saveData();
    return newUser;
  }

  // Drawing methods
  async getDrawing(id: number): Promise<Drawing | undefined> {
    return this.drawings.get(id);
  }

  async getAllDrawings(): Promise<Drawing[]> {
    return Array.from(this.drawings.values());
  }

  async getDrawingsByUserId(userId: number): Promise<Drawing[]> {
    return Array.from(this.drawings.values()).filter(
      (drawing) => drawing.userId === userId
    );
  }

  async createDrawing(insertDrawing: InsertDrawing): Promise<Drawing> {
    const id = this.drawingCurrentId++;
    const currentDate = new Date();
    const drawing: Drawing = {
      ...insertDrawing,
      id,
      createdAt: currentDate
    };
    this.drawings.set(id, drawing);
    this.saveData();
    return drawing;
  }
}

// Export a singleton instance
export const storage = new FileStorage();

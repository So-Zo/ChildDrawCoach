import { TextInputResponse, ImageInputResponse, CategoryResponse, DrawingTutorialResponse } from "./types";
import { apiRequest } from "./queryClient";

// Send text prompt to generate drawing
export async function generateDrawingFromText(prompt: string): Promise<TextInputResponse> {
  const response = await apiRequest("POST", "/api/drawing/text", { prompt });
  return await response.json();
}

// Send image to generate drawing
export async function generateDrawingFromImage(file: File): Promise<ImageInputResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/drawing/image", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }

  return await response.json();
}

// Get a specific drawing by ID
export async function getDrawing(id: number): Promise<Response> {
  return await apiRequest("GET", `/api/drawing/${id}`);
}

// Get all drawing categories
export async function getCategories(): Promise<CategoryResponse[]> {
  const response = await apiRequest("GET", "/api/categories");
  return await response.json();
}

// Get all drawings in a category
export async function getDrawingsInCategory(categoryId: string): Promise<any[]> {
  const response = await apiRequest("GET", `/api/category/${categoryId}`);
  return await response.json();
}

// Get a specific drawing tutorial
export async function getDrawingTutorial(categoryId: string, drawingId: string): Promise<DrawingTutorialResponse> {
  const response = await apiRequest("GET", `/api/tutorial/${categoryId}/${drawingId}`);
  return await response.json();
}

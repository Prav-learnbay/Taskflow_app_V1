"use client"

import type { Task } from "./types"

// In a real application, this would be a database or API call
// For simplicity, we're using localStorage

const STORAGE_KEY = "todo-app-tasks"

// Mock data for development
let tasks: Task[] = []

export async function getTasks(): Promise<Task[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...tasks]
}

export async function getTask(id: string): Promise<Task | null> {
  const task = tasks.find((t) => t.id === id)
  return task || null
}

export async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt">): Promise<Task> {
  const newTask = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  }
  tasks.push(newTask)
  return newTask
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const taskIndex = tasks.findIndex((t) => t.id === id)
  if (taskIndex === -1) {
    throw new Error("Task not found")
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  tasks[taskIndex] = updatedTask
  return updatedTask
}

export async function deleteTask(id: string): Promise<void> {
  const taskIndex = tasks.findIndex((t) => t.id === id)
  if (taskIndex === -1) {
    throw new Error("Task not found")
  }
  tasks.splice(taskIndex, 1)
}


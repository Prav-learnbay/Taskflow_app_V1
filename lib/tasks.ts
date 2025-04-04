"use client"

import type { Task } from "./types"

// In a real application, this would be a database or API call
// For simplicity, we're using localStorage

const STORAGE_KEY = "todo-app-tasks"

export async function getTasks(): Promise<Task[]> {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const tasks = localStorage.getItem(STORAGE_KEY)
    return tasks ? JSON.parse(tasks) : []
  } catch (error) {
    console.error("Error getting tasks:", error)
    return []
  }
}

export async function addTask(task: Task): Promise<void> {
  if (typeof window === "undefined") {
    return
  }

  try {
    const tasks = await getTasks()
    tasks.push(task)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error("Error adding task:", error)
    throw error
  }
}

export async function updateTask(updatedTask: Task): Promise<void> {
  if (typeof window === "undefined") {
    return
  }

  try {
    const tasks = await getTasks()
    const index = tasks.findIndex((task) => task.id === updatedTask.id)

    if (index !== -1) {
      tasks[index] = updatedTask
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }
  } catch (error) {
    console.error("Error updating task:", error)
    throw error
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  if (typeof window === "undefined") {
    return
  }

  try {
    const tasks = await getTasks()
    const filteredTasks = tasks.filter((task) => task.id !== taskId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks))
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}


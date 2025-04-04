"use client"

import { useState } from "react"
import type { Task } from "@/lib/types"
import { updateTask, deleteTask } from "@/lib/tasks"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, CheckCircle, Clock, Edit, Flag, Trash, User, AlertTriangle, CheckSquare } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"

interface TaskItemProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState(task.status)
  const [priority, setPriority] = useState(task.priority)

  const handleStatusChange = async (newStatus: string) => {
    const updatedTask: Task = {
      ...task,
      status: newStatus as "todo" | "in-progress" | "completed",
      completedAt: newStatus === "completed" ? new Date().toISOString() : null,
    }

    try {
      await updateTask(updatedTask)
      setStatus(newStatus as "todo" | "in-progress" | "completed")
      onUpdate(updatedTask)
    } catch (error) {
      console.error("Failed to update task status:", error)
    }
  }

  const handlePriorityChange = async (newPriority: string) => {
    const updatedTask: Task = {
      ...task,
      priority: newPriority as "low" | "medium" | "high",
    }

    try {
      await updateTask(updatedTask)
      setPriority(newPriority as "low" | "medium" | "high")
      onUpdate(updatedTask)
    } catch (error) {
      console.error("Failed to update task priority:", error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTask(task.id)
      onDelete(task.id)
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return ""
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500"
      case "in-progress":
        return "text-blue-500"
      case "todo":
        return "text-gray-500"
      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{task.title}</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this task? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
          {task.collaborator && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-gray-500" />
              <span>{task.collaborator}</span>
            </div>
          )}
          {task.category && (
            <div className="flex items-center gap-1">
              <CategoryIcon category={task.category} className="h-4 w-4 text-gray-500" />
              <span className="capitalize">{task.category.replace("-", " ")}</span>
            </div>
          )}
          {task.completedAt && (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Completed: {formatDate(task.completedAt)}</span>
            </div>
          )}
          {!task.completedAt && task.createdAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Created: {formatDate(task.createdAt)}</span>
            </div>
          )}
        </div>
        {(task.isUrgent || task.isImportant) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {task.isUrgent && (
              <div className="flex items-center gap-1 text-orange-500 text-xs bg-orange-50 px-2 py-1 rounded-full">
                <AlertTriangle className="h-3 w-3" />
                <span>Urgent</span>
              </div>
            )}
            {task.isImportant && (
              <div className="flex items-center gap-1 text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded-full">
                <CheckSquare className="h-3 w-3" />
                <span>Important</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex flex-wrap gap-2">
        {isEditing ? (
          <>
            <div className="flex items-center gap-2">
              <Flag className={`h-4 w-4 ${getPriorityColor(priority)}`} />
              <Select value={priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-28 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${getStatusColor(status)}`} />
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-28 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <Flag className={`h-4 w-4 ${getPriorityColor(priority)}`} />
              <span className="capitalize">{priority} Priority</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className={`h-4 w-4 ${getStatusColor(status)}`} />
              <span className="capitalize">{status.replace("-", " ")}</span>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}


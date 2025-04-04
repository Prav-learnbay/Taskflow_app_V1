"use client"

import { useEffect, useState } from "react"
import type { Task } from "@/lib/types"
import { getTasks } from "@/lib/tasks"
import { TaskItem } from "@/components/task-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckSquare, Clock, XCircle } from "lucide-react"

export function EisenhowerMatrix() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const taskData = await getTasks()
        // Filter out completed tasks
        setTasks(taskData.filter((task) => task.status !== "completed"))
      } catch (error) {
        console.error("Failed to load tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  // Group tasks by quadrant
  const urgentImportant = tasks.filter((task) => task.isUrgent && task.isImportant)
  const notUrgentImportant = tasks.filter((task) => !task.isUrgent && task.isImportant)
  const urgentNotImportant = tasks.filter((task) => task.isUrgent && !task.isImportant)
  const notUrgentNotImportant = tasks.filter((task) => !task.isUrgent && !task.isImportant)

  if (isLoading) {
    return <div className="text-center py-8">Loading tasks...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-700">Do First</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Urgent & Important</p>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {urgentImportant.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No urgent and important tasks</div>
            ) : (
              urgentImportant.map((task) => (
                <TaskItem key={task.id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-blue-700">Schedule</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Important but Not Urgent</p>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {notUrgentImportant.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No important but not urgent tasks</div>
            ) : (
              notUrgentImportant.map((task) => (
                <TaskItem key={task.id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-orange-700">Delegate</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Urgent but Not Important</p>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {urgentNotImportant.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No urgent but not important tasks</div>
            ) : (
              urgentNotImportant.map((task) => (
                <TaskItem key={task.id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="bg-gray-50 rounded-t-lg">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-gray-500" />
              <CardTitle className="text-gray-700">Eliminate</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Neither Urgent nor Important</p>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {notUrgentNotImportant.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No tasks to eliminate</div>
            ) : (
              notUrgentNotImportant.map((task) => (
                <TaskItem key={task.id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


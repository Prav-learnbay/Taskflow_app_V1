"use client"

import { useEffect, useState } from "react"
import type { Task } from "@/lib/types"
import { getTasks } from "@/lib/tasks"
import { TaskItem } from "@/components/task-item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CategoryIcon } from "@/components/category-icon"

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const taskData = await getTasks()
        setTasks(taskData)
      } catch (error) {
        console.error("Failed to load tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true
      if (filter === "completed") return task.status === "completed"
      if (filter === "in-progress") return task.status === "in-progress"
      if (filter === "todo") return task.status === "todo"
      if (filter === "high") return task.priority === "high"
      if (filter === "medium") return task.priority === "medium"
      if (filter === "low") return task.priority === "low"
      return true
    })
    .filter((task) => {
      if (categoryFilter === "all") return true
      return task.category === categoryFilter
    })
    .filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.collaborator.toLowerCase().includes(search.toLowerCase()),
    )

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="purchase" className="flex items-center gap-2">
                <CategoryIcon category="purchase" className="h-4 w-4" />
                <span>Purchase</span>
              </SelectItem>
              <SelectItem value="renewals" className="flex items-center gap-2">
                <CategoryIcon category="renewals" className="h-4 w-4" />
                <span>Renewals</span>
              </SelectItem>
              <SelectItem value="bill-payments" className="flex items-center gap-2">
                <CategoryIcon category="bill-payments" className="h-4 w-4" />
                <span>Bill Payments</span>
              </SelectItem>
              <SelectItem value="outings" className="flex items-center gap-2">
                <CategoryIcon category="outings" className="h-4 w-4" />
                <span>Outings</span>
              </SelectItem>
              <SelectItem value="routines" className="flex items-center gap-2">
                <CategoryIcon category="routines" className="h-4 w-4" />
                <span>Routines</span>
              </SelectItem>
              <SelectItem value="family-time" className="flex items-center gap-2">
                <CategoryIcon category="family-time" className="h-4 w-4" />
                <span>Family Time</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No tasks found. Add a new task to get started.</div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} />
          ))}
        </div>
      )}
    </div>
  )
}


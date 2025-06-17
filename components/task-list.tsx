"use client"

import { useState, useEffect } from "react"
import { Task } from "@/lib/types"
import { TaskItem } from "@/components/task-item"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/tasks"

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Task["status"] | "all">("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [serviceFilter, setServiceFilter] = useState<string>("all")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      setError("Failed to load tasks")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskAdded = async (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt">) => {
    try {
      const newTask = await createTask(task)
      setTasks((prev) => [...prev, newTask])
    } catch (err) {
      setError("Failed to add task")
    }
  }

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    try {
      const updatedTask = await updateTask(taskId, { status })
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      )
    } catch (err) {
      setError("Failed to update task")
    }
  }

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (err) {
      setError("Failed to delete task")
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filter === "all" || task.status === filter
    const matchesDepartment = departmentFilter === "all" || task.department === departmentFilter
    const matchesService = serviceFilter === "all" || task.services.includes(serviceFilter)
    const matchesSearch = !search || task.title.toLowerCase().includes(search.toLowerCase()) || task.description.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesDepartment && matchesService && matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto">
          <Select value={filter} onValueChange={(value: Task["status"] | "all") => setFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="hiring">Hiring</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="deboarding">Deboarding</SelectItem>
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="HouseKeeping">HouseKeeping</SelectItem>
              <SelectItem value="Gardening">Gardening</SelectItem>
              <SelectItem value="Pest control">Pest control</SelectItem>
              <SelectItem value="STP">STP</SelectItem>
              <SelectItem value="WTP">WTP</SelectItem>
              <SelectItem value="Swimming Pool">Swimming Pool</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Plumbing">Plumbing</SelectItem>
              <SelectItem value="Management">Management</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onSelect={() => setSelectedTask(task)}
              isSelected={selectedTask?.id === task.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}


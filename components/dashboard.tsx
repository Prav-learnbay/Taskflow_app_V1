"use client"

import { useEffect, useState } from "react"
import type { Task } from "@/lib/types"
import { getTasks } from "@/lib/tasks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
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

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard data...</div>
  }

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const todoTasks = tasks.filter((task) => task.status === "todo").length

  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium").length
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low").length

  // Calculate completion time for completed tasks
  const completionTimes = tasks
    .filter((task) => task.status === "completed" && task.completedAt && task.createdAt)
    .map((task) => {
      const created = new Date(task.createdAt).getTime()
      const completed = new Date(task.completedAt!).getTime()
      const daysToComplete = Math.ceil((completed - created) / (1000 * 60 * 60 * 24))
      return {
        title: task.title,
        days: daysToComplete,
      }
    })

  // Status distribution data for pie chart
  const statusData = [
    { name: "To Do", value: todoTasks, color: "#94a3b8" },
    { name: "In Progress", value: inProgressTasks, color: "#3b82f6" },
    { name: "Completed", value: completedTasks, color: "#22c55e" },
  ]

  // Priority distribution data for pie chart
  const priorityData = [
    { name: "Low", value: lowPriorityTasks, color: "#22c55e" },
    { name: "Medium", value: mediumPriorityTasks, color: "#eab308" },
    { name: "High", value: highPriorityTasks, color: "#ef4444" },
  ]

  // Add to the statistics section after the priority distribution data
  // Add this after the priorityData declaration
  const matrixData = [
    { name: "Do First", value: tasks.filter((task) => task.isUrgent && task.isImportant).length, color: "#ef4444" },
    { name: "Schedule", value: tasks.filter((task) => !task.isUrgent && task.isImportant).length, color: "#3b82f6" },
    { name: "Delegate", value: tasks.filter((task) => task.isUrgent && !task.isImportant).length, color: "#f97316" },
    { name: "Eliminate", value: tasks.filter((task) => !task.isUrgent && !task.isImportant).length, color: "#94a3b8" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <div className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion rate
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Priority Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityTasks}</div>
            <div className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((highPriorityTasks / totalTasks) * 100) : 0}% of all tasks
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            {totalTasks > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded p-2 shadow-sm">
                              <p className="font-medium">{payload[0].name}</p>
                              <p>Tasks: {payload[0].value}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No tasks available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Priority</CardTitle>
          </CardHeader>
          <CardContent>
            {totalTasks > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded p-2 shadow-sm">
                              <p className="font-medium">{payload[0].name}</p>
                              <p>Tasks: {payload[0].value}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No tasks available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eisenhower Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            {totalTasks > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={matrixData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {matrixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded p-2 shadow-sm">
                              <p className="font-medium">{payload[0].name}</p>
                              <p>Tasks: {payload[0].value}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No tasks available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Completion Time (Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {completionTimes.length > 0 ? (
            <div className="h-[300px]">
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completionTimes}>
                    <XAxis
                      dataKey="title"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
                    />
                    <YAxis />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent>
                              <div className="font-medium">{label}</div>
                              <div>Completed in: {payload[0].value} days</div>
                            </ChartTooltipContent>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="days" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No completed tasks available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


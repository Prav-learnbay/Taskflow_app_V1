"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { addTask } from "@/lib/tasks"
import { Checkbox } from "@/components/ui/checkbox"

type FormValues = {
  title: string
  priority: string
  status: string
  dueDate: string
  collaborator: string
  isUrgent: boolean
  isImportant: boolean
  category: string
}

export function AddTaskForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      priority: "medium",
      status: "todo",
      dueDate: new Date().toISOString().split("T")[0],
      collaborator: "",
      isUrgent: false,
      isImportant: false,
      category: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      await addTask({
        id: Date.now().toString(),
        title: data.title,
        priority: data.priority as "low" | "medium" | "high",
        status: data.status as "todo" | "in-progress" | "completed",
        dueDate: data.dueDate,
        collaborator: data.collaborator,
        createdAt: new Date().toISOString(),
        completedAt: null,
        isUrgent: data.isUrgent,
        isImportant: data.isImportant,
        category: data.category,
      })
      form.reset({
        title: "",
        priority: "medium",
        status: "todo",
        dueDate: new Date().toISOString().split("T")[0],
        collaborator: "",
        isUrgent: false,
        isImportant: false,
        category: "",
      })
    } catch (error) {
      console.error("Failed to add task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">Add New Task</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} required />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="collaborator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collaborator</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter collaborator name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="renewals">Renewals</SelectItem>
                    <SelectItem value="bill-payments">Bill Payments</SelectItem>
                    <SelectItem value="outings">Outings</SelectItem>
                    <SelectItem value="routines">Routines</SelectItem>
                    <SelectItem value="family-time">Family Time</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              control={form.control}
              name="isImportant"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Important</FormLabel>
                    <p className="text-sm text-muted-foreground">This task is important for long-term goals</p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isUrgent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Urgent</FormLabel>
                    <p className="text-sm text-muted-foreground">This task requires immediate attention</p>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </form>
      </Form>
    </div>
  )
}


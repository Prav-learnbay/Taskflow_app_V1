"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { addTask } from "@/lib/tasks"
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string(),
  department: z.string(),
  services: z.array(z.string()),
  zone: z.string(),
  siteName: z.string(),
  taskOwner: z.string(),
  city: z.string(),
  isUrgent: z.boolean(),
  isImportant: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export function AddTaskForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)
  const [isImportant, setIsImportant] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      department: '',
      services: [],
      zone: '',
      siteName: '',
      taskOwner: '',
      city: '',
      isUrgent: false,
      isImportant: false,
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      await addTask({
        id: Date.now().toString(),
        title: data.title,
        description: data.description || '',
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        department: data.department,
        services: data.services,
        zone: data.zone,
        siteName: data.siteName,
        taskOwner: data.taskOwner,
        city: data.city,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
        isUrgent: data.isUrgent,
        isImportant: data.isImportant,
        notes: [],
        attachments: []
      })
      form.reset({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        department: '',
        services: [],
        zone: '',
        siteName: '',
        taskOwner: '',
        city: '',
        isUrgent: false,
        isImportant: false,
      })
    } catch (error) {
      console.error('Error adding task:', error)
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
              name="taskOwner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Owner</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task owner name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="hiring">Hiring</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="deboarding">Deboarding</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange([value])}
                    defaultValue={field.value?.[0]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select services" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="housekeeping">Housekeeping</SelectItem>
                      <SelectItem value="gardening">Gardening</SelectItem>
                      <SelectItem value="pest-control">Pest Control</SelectItem>
                      <SelectItem value="stp">STP</SelectItem>
                      <SelectItem value="wtp">WTP</SelectItem>
                      <SelectItem value="swimming-pool">Swimming Pool</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="north">North Zone</SelectItem>
                      <SelectItem value="south">South Zone</SelectItem>
                      <SelectItem value="east">East Zone</SelectItem>
                      <SelectItem value="west">West Zone</SelectItem>
                      <SelectItem value="central">Central Zone</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter site name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="vijaywada">Vijaywada</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isUrgent"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center p-4 border rounded-lg bg-destructive/5 hover:bg-destructive/10 transition-colors">
                  <FormControl>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5"
                      />
                      <Label className="text-lg font-medium text-destructive cursor-pointer">Urgent</Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isImportant"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center p-4 border rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <FormControl>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5"
                      />
                      <Label className="text-lg font-medium text-primary cursor-pointer">Important</Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Enter task description"
                      className="min-h-[100px]"
                      {...field}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.multiple = true;
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files) {
                              // Handle file upload here
                              console.log('Files selected:', files);
                            }
                          };
                          input.click();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-paperclip"
                        >
                          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                        Attach Files
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Upload images, documents, or other files
                      </span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}


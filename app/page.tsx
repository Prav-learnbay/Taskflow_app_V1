import { TaskList } from "@/components/task-list"
import { AddTaskForm } from "@/components/add-task-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dashboard } from "@/components/dashboard"
import { EisenhowerMatrix } from "@/components/eisenhower-matrix"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Taskflow</h1>

      <Tabs defaultValue="tasks">
        <TabsList className="mb-4">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="matrix">Eisenhower Matrix</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <AddTaskForm />
          <TaskList />
        </TabsContent>

        <TabsContent value="matrix">
          <EisenhowerMatrix />
        </TabsContent>

        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>
      </Tabs>
    </main>
  )
}


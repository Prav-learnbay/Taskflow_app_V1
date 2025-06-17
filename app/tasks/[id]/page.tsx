import { notFound } from "next/navigation"
import { getTask, updateTask } from "@/lib/tasks"
import { TaskNotes } from "@/components/task-notes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Building, Wrench, MapPin, Home, Map, User } from "lucide-react"

interface TaskDetailsPageProps {
  params: {
    id: string
  }
}

export default async function TaskDetailsPage({ params }: TaskDetailsPageProps) {
  const task = await getTask(params.id)

  if (!task) {
    notFound()
  }

  const handleAddNote = async (content: string) => {
    "use server"
    const newNote = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
      createdBy: "Current User", // Replace with actual user name
    }
    const updatedNotes = [...(task.notes || []), newNote]
    await updateTask(task.id, { notes: updatedNotes })
  }

  const handleAddAttachment = async (file: File) => {
    "use server"
    // Here you would typically upload the file to your storage service
    // and get back a URL. For now, we'll create a mock attachment
    const newAttachment = {
      id: Date.now().toString(),
      name: file.name,
      url: "#", // Replace with actual file URL
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }
    const updatedAttachments = [...(task.attachments || []), newAttachment]
    await updateTask(task.id, { attachments: updatedAttachments })
  }

  const handleDeleteAttachment = async (attachmentId: string) => {
    "use server"
    const updatedAttachments = (task.attachments || []).filter(
      (a) => a.id !== attachmentId
    )
    await updateTask(task.id, { attachments: updatedAttachments })
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Status</h3>
                <p className="text-sm text-muted-foreground capitalize">{task.status}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Priority</h3>
                <p className="text-sm text-muted-foreground capitalize">{task.priority}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Due Date</h3>
                <p className="text-sm text-muted-foreground">{formatDate(task.dueDate)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {task.department && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{task.department}</span>
                </div>
              )}
              {task.services && task.services.length > 0 && (
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{task.services.join(", ")}</span>
                </div>
              )}
              {task.zone && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{task.zone}</span>
                </div>
              )}
              {task.siteName && (
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{task.siteName}</span>
                </div>
              )}
              {task.city && (
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{task.city}</span>
                </div>
              )}
              {task.taskOwner && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{task.taskOwner}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <TaskNotes
        taskId={task.id}
        notes={task.notes || []}
        attachments={task.attachments || []}
        onAddNote={handleAddNote}
        onAddAttachment={handleAddAttachment}
        onDeleteAttachment={handleDeleteAttachment}
      />
    </div>
  )
} 
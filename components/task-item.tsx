"use client"

import { useState } from "react"
import { Task } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Calendar, Clock, User, Building, Wrench, MapPin, Home, Map, MessageSquare } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface TaskItemProps {
  task: Task
  onStatusChange: (taskId: string, status: Task["status"]) => void
  onDelete: (taskId: string) => void
  onSelect: () => void
  isSelected: boolean
}

export function TaskItem({ task, onStatusChange, onDelete, onSelect, isSelected }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [newNote, setNewNote] = useState("")

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(task.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    const newNoteObj = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
    }
    const updatedNotes = [...(task.notes || []), newNoteObj]
    onStatusChange(task.id, task.status)
    setNewNote("")
  }

  return (
    <Card className={`${isSelected ? 'border-primary' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={task.status}
            onValueChange={(value: Task["status"]) => onStatusChange(task.id, value)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">{task.description}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
            {task.priority}
          </Badge>
          <Badge variant="outline">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </Badge>
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(task.dueDate).toLocaleTimeString()}
          </Badge>
          <Badge variant="outline">
            <User className="h-3 w-3 mr-1" />
            {task.taskOwner}
          </Badge>
          {task.department && (
            <Badge variant="outline">
              <Building className="h-3 w-3 mr-1" />
              {task.department}
            </Badge>
          )}
          {task.services && task.services.length > 0 && (
            <Badge variant="outline">
              <Wrench className="h-3 w-3 mr-1" />
              {task.services.join(", ")}
            </Badge>
          )}
          {task.zone && (
            <Badge variant="outline">
              <MapPin className="h-3 w-3 mr-1" />
              {task.zone}
            </Badge>
          )}
          {task.siteName && (
            <Badge variant="outline">
              <Home className="h-3 w-3 mr-1" />
              {task.siteName}
            </Badge>
          )}
          {task.city && (
            <Badge variant="outline">
              <Map className="h-3 w-3 mr-1" />
              {task.city}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2"
            onClick={() => setShowNotes(!showNotes)}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            {showNotes ? "Hide Notes" : "Show Notes"}
          </Button>
        </div>

        {showNotes && (
          <div className="mt-4 border-t pt-4">
            <div className="space-y-4">
              {/* Add Note Section */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                  >
                    Add Note
                  </Button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-4">
                {task.notes?.map((note) => (
                  <div key={note.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {note.createdBy} • {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


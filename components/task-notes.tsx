"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Paperclip, MessageSquare, X, FileText, Image, File } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Note, Attachment } from "@/lib/types"

interface TaskNotesProps {
  taskId: string;
  notes: Note[];
  attachments: Attachment[];
  onAddNote: (content: string) => Promise<void>;
  onAddAttachment: (file: File) => Promise<void>;
  onDeleteAttachment: (attachmentId: string) => Promise<void>;
}

export function TaskNotes({
  taskId,
  notes,
  attachments,
  onAddNote,
  onAddAttachment,
  onDeleteAttachment,
}: TaskNotesProps) {
  const [newNote, setNewNote] = useState("")
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setIsAddingNote(true)
    try {
      await onAddNote(newNote)
      setNewNote("")
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await onAddAttachment(file)
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />
    if (type.includes("pdf")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Notes & Attachments
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                disabled={isAddingNote || !newNote.trim()}
              >
                {isAddingNote ? "Adding..." : "Add Note"}
              </Button>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  disabled={isUploading}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Attach File"}
                </Button>
              </label>
            </div>
          </div>

          {/* Notes List */}
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm">{note.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {note.createdBy} • {formatDistanceToNow(new Date(note.createdAt))} ago
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Attachments List */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Attachments</h4>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center gap-2">
                      {getFileIcon(attachment.type)}
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(attachment.size)} •{" "}
                          {formatDistanceToNow(new Date(attachment.uploadedAt))} ago
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteAttachment(attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 
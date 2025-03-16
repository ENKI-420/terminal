"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Upload, FileText, RefreshCw, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

// Define types for our content
interface ContentItem {
  id: string
  title: string
  content: string
  type: string
  created_at: string
  updated_at: string
}

export default function ContentManagementPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [activeTab, setActiveTab] = useState("quick-replies")
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // Check if admin is authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem("admin_authenticated")
    if (adminAuth === "true") {
      setIsAuthenticated(true)
      fetchContentItems()
    } else {
      router.push("/admin")
    }
  }, [router])

  // Fetch content items from database
  const fetchContentItems = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("content_items").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setContentItems(data || [])
    } catch (error) {
      console.error("Error fetching content:", error)
      toast({
        title: "Error",
        description: "Failed to load content items",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Save a new content item
  const handleSaveContent = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const newItem = {
        title: newTitle,
        content: newContent,
        type: activeTab,
      }

      const { data, error } = await supabase.from("content_items").insert([newItem]).select()

      if (error) throw error

      toast({
        title: "Success",
        description: "Content saved successfully",
      })

      // Reset form and refresh list
      setNewTitle("")
      setNewContent("")
      fetchContentItems()
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Update an existing content item
  const handleUpdateContent = async () => {
    if (!editingItem || !newTitle.trim() || !newContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const updatedItem = {
        title: newTitle,
        content: newContent,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("content_items").update(updatedItem).eq("id", editingItem.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Content updated successfully",
      })

      // Reset form and refresh list
      setNewTitle("")
      setNewContent("")
      setEditingItem(null)
      fetchContentItems()
    } catch (error) {
      console.error("Error updating content:", error)
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Delete a content item
  const handleDeleteContent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const { error } = await supabase.from("content_items").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Content deleted successfully",
      })

      fetchContentItems()
    } catch (error) {
      console.error("Error deleting content:", error)
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      })
    }
  }

  // Set up editing mode for a content item
  const startEditing = (item: ContentItem) => {
    setEditingItem(item)
    setNewTitle(item.title)
    setNewContent(item.content)
    setActiveTab(item.type)
  }

  // Cancel editing mode
  const cancelEditing = () => {
    setEditingItem(null)
    setNewTitle("")
    setNewContent("")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in as an administrator to access this page.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/admin")} className="w-full">
              Go to Admin Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Content Management</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Back to Admin
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Editor */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{editingItem ? "Edit Content" : "Add New Content"}</CardTitle>
                <CardDescription>
                  {editingItem ? "Update existing content item" : "Create new content for the application"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="quick-replies">Quick Replies</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                    <TabsTrigger value="system">System Messages</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter content"
                      rows={8}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="resize-none"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {editingItem ? (
                  <>
                    <Button variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateContent} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleSaveContent} className="w-full" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Save Content
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Content List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Content Library</CardTitle>
                  <CardDescription>Manage all content items</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchContentItems}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : contentItems.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-md">
                    <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No content items found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add your first content item using the form on the left
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="quick-replies">Quick Replies</TabsTrigger>
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                        <TabsTrigger value="system">System</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all" className="mt-4">
                        <ContentList items={contentItems} onEdit={startEditing} onDelete={handleDeleteContent} />
                      </TabsContent>
                      <TabsContent value="quick-replies" className="mt-4">
                        <ContentList
                          items={contentItems.filter((item) => item.type === "quick-replies")}
                          onEdit={startEditing}
                          onDelete={handleDeleteContent}
                        />
                      </TabsContent>
                      <TabsContent value="faq" className="mt-4">
                        <ContentList
                          items={contentItems.filter((item) => item.type === "faq")}
                          onEdit={startEditing}
                          onDelete={handleDeleteContent}
                        />
                      </TabsContent>
                      <TabsContent value="system" className="mt-4">
                        <ContentList
                          items={contentItems.filter((item) => item.type === "system")}
                          onEdit={startEditing}
                          onDelete={handleDeleteContent}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

// Content list component
function ContentList({
  items,
  onEdit,
  onDelete,
}: {
  items: ContentItem[]
  onEdit: (item: ContentItem) => void
  onDelete: (id: string) => void
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-md">
        <p className="text-muted-foreground">No items in this category</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 border rounded-md hover:bg-muted/50 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()} · {item.type}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </Button>
            </div>
          </div>
          <p className="text-sm line-clamp-2">{item.content}</p>
        </motion.div>
      ))}
    </div>
  )
}


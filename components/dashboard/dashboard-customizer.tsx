"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Save, RotateCcw } from "lucide-react"

export function DashboardCustomizer() {
  // Mock available widgets
  const [availableWidgets, setAvailableWidgets] = useState([
    { id: "health-summary", name: "Health Summary", enabled: true },
    { id: "appointments", name: "Upcoming Appointments", enabled: true },
    { id: "lab-results", name: "Recent Lab Results", enabled: true },
    { id: "medications", name: "Medication Tracker", enabled: true },
    { id: "health-metrics", name: "Health Metrics", enabled: true },
    { id: "treatment-plan", name: "Treatment Plan", enabled: true },
    { id: "notifications", name: "Notifications", enabled: true },
    { id: "resources", name: "Resources", enabled: true },
    { id: "care-team", name: "Care Team", enabled: false },
    { id: "documents", name: "Documents", enabled: false },
    { id: "insurance", name: "Insurance Information", enabled: false },
  ])

  // Mock layout configuration
  const [layoutConfig, setLayoutConfig] = useState({
    overview: [
      { id: "health-summary", size: "full" },
      { id: "appointments", size: "half" },
      { id: "lab-results", size: "half" },
      { id: "medications", size: "third" },
      { id: "notifications", size: "third" },
      { id: "resources", size: "third" },
    ],
    health: [
      { id: "health-metrics", size: "half" },
      { id: "treatment-plan", size: "half" },
      { id: "lab-results", size: "full" },
    ],
  })

  // Toggle widget enabled state
  const toggleWidget = (id: string) => {
    setAvailableWidgets(
      availableWidgets.map((widget) => (widget.id === id ? { ...widget, enabled: !widget.enabled } : widget)),
    )
  }

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const tab = result.source.droppableId
    const items = Array.from(layoutConfig[tab as keyof typeof layoutConfig])
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setLayoutConfig({
      ...layoutConfig,
      [tab]: items,
    })
  }

  // Change widget size
  const changeWidgetSize = (tab: string, id: string, size: string) => {
    setLayoutConfig({
      ...layoutConfig,
      [tab]: layoutConfig[tab as keyof typeof layoutConfig].map((widget) =>
        widget.id === id ? { ...widget, size } : widget,
      ),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Dashboard</CardTitle>
        <CardDescription>Choose which widgets to display and arrange them to your preference</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="widgets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="widgets">Available Widgets</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableWidgets.map((widget) => (
                <div key={widget.id} className="flex items-center space-x-2 border p-3 rounded-md">
                  <Checkbox
                    id={`widget-${widget.id}`}
                    checked={widget.enabled}
                    onCheckedChange={() => toggleWidget(widget.id)}
                  />
                  <Label htmlFor={`widget-${widget.id}`} className="flex-1 cursor-pointer">
                    {widget.name}
                  </Label>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview Tab</TabsTrigger>
                <TabsTrigger value="health">Health Tab</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="overview">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {layoutConfig.overview.map((widget, index) => {
                          const widgetInfo = availableWidgets.find((w) => w.id === widget.id)
                          if (!widgetInfo) return null

                          return (
                            <Draggable key={widget.id} draggableId={widget.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="flex items-center border p-3 rounded-md bg-muted/40"
                                >
                                  <div {...provided.dragHandleProps} className="mr-2">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{widgetInfo.name}</p>
                                  </div>
                                  <select
                                    value={widget.size}
                                    onChange={(e) => changeWidgetSize("overview", widget.id, e.target.value)}
                                    className="bg-background border rounded-md px-2 py-1 text-sm"
                                  >
                                    <option value="full">Full Width</option>
                                    <option value="half">Half Width</option>
                                    <option value="third">One Third</option>
                                  </select>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </TabsContent>

              <TabsContent value="health">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="health">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {layoutConfig.health.map((widget, index) => {
                          const widgetInfo = availableWidgets.find((w) => w.id === widget.id)
                          if (!widgetInfo) return null

                          return (
                            <Draggable key={widget.id} draggableId={widget.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="flex items-center border p-3 rounded-md bg-muted/40"
                                >
                                  <div {...provided.dragHandleProps} className="mr-2">
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{widgetInfo.name}</p>
                                  </div>
                                  <select
                                    value={widget.size}
                                    onChange={(e) => changeWidgetSize("health", widget.id, e.target.value)}
                                    className="bg-background border rounded-md px-2 py-1 text-sm"
                                  >
                                    <option value="full">Full Width</option>
                                    <option value="half">Half Width</option>
                                    <option value="third">One Third</option>
                                  </select>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="gap-1">
          <RotateCcw className="h-4 w-4" />
          Reset to Default
        </Button>
        <Button className="gap-1">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}

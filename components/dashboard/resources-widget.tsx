"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Video, BookOpen, ExternalLink } from "lucide-react"
import Link from "next/link"

export function ResourcesWidget() {
  // Mock resources data
  const resources = [
    {
      id: 1,
      type: "article",
      title: "Understanding Your Genomic Test Results",
      description: "A guide to interpreting your genomic testing results and what they mean for your treatment.",
      url: "/resources/genomic-test-results",
    },
    {
      id: 2,
      type: "video",
      title: "Managing Treatment Side Effects",
      description: "Dr. Johnson explains common side effects and strategies to manage them effectively.",
      url: "/resources/managing-side-effects",
    },
    {
      id: 3,
      type: "guide",
      title: "Nutrition During Cancer Treatment",
      description: "Dietary recommendations to support your body during treatment.",
      url: "/resources/nutrition-guide",
    },
  ]

  // Function to get icon based on resource type
  const getIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "video":
        return <Video className="h-4 w-4 text-red-500" />
      case "guide":
        return <BookOpen className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Educational materials and guides</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/resources">Browse All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.id} className="flex gap-3 p-3 rounded-lg bg-muted/40">
            <div className="mt-0.5">{getIcon(resource.type)}</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{resource.title}</p>
              <p className="text-xs text-muted-foreground">{resource.description}</p>
              <div>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                  <Link href={resource.url}>View Resource</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href="/dashboard/resources">
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Explore All Resources
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

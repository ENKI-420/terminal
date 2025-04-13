"use client"

import { useState } from "react"
import { updateData } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function UpdateForm() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    try {
      setIsPending(true)
      setError(null)

      const result = await updateData(formData)

      if (!result.success) {
        setError(result.error || "An error occurred")
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to update data",
        })
        return
      }

      toast({
        title: "Success",
        description: "Data updated successfully",
      })
    } catch (err) {
      setError("An unexpected error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <Input id="name" name="name" required />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update"}
      </Button>
    </form>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, CreditCard, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data for payment methods
const mockPaymentMethods = [
  {
    id: "1",
    type: "credit",
    cardType: "Visa",
    lastFour: "4242",
    expiryMonth: "12",
    expiryYear: "2025",
    isDefault: true,
    name: "John Doe",
  },
  {
    id: "2",
    type: "credit",
    cardType: "Mastercard",
    lastFour: "5555",
    expiryMonth: "09",
    expiryYear: "2024",
    isDefault: false,
    name: "John Doe",
  },
]

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [editingCard, setEditingCard] = useState<string | null>(null)

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to add the card
    const newCard = {
      id: Math.random().toString(36).substring(7),
      type: "credit",
      cardType: "Visa",
      lastFour: "1234",
      expiryMonth: "01",
      expiryYear: "2026",
      isDefault: paymentMethods.length === 0,
      name: "John Doe",
    }
    setPaymentMethods([...paymentMethods, newCard])
    setIsAddingCard(false)
  }

  const handleDeleteCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your payment methods for billing and subscriptions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                method.isDefault ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-medium">
                    {method.cardType} •••• {method.lastFour}
                    {method.isDefault && (
                      <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Default</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {method.expiryMonth}/{method.expiryYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                    Set Default
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit card</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Payment Method</DialogTitle>
                      <DialogDescription>Update your card information</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-name">Name on Card</Label>
                          <Input id="card-name" defaultValue={method.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input id="card-number" defaultValue={`•••• •••• •••• ${method.lastFour}`} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiry-month">Expiry Month</Label>
                          <Select defaultValue={method.expiryMonth}>
                            <SelectTrigger id="expiry-month">
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = (i + 1).toString().padStart(2, "0")
                                return (
                                  <SelectItem key={month} value={month}>
                                    {month}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiry-year">Expiry Year</Label>
                          <Select defaultValue={method.expiryYear}>
                            <SelectTrigger id="expiry-year">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => {
                                const year = (new Date().getFullYear() + i).toString()
                                return (
                                  <SelectItem key={year} value={year}>
                                    {year}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="•••" />
                        </div>
                      </div>
                    </form>
                    <DialogFooter>
                      <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete card</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this payment method? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteCard(method.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Add a new credit or debit card for billing</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-card-name">Name on Card</Label>
                  <Input id="new-card-name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-card-number">Card Number</Label>
                  <Input id="new-card-number" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-expiry-month">Expiry Month</Label>
                  <Select>
                    <SelectTrigger id="new-expiry-month">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, "0")
                        return (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-expiry-year">Expiry Year</Label>
                  <Select>
                    <SelectTrigger id="new-expiry-year">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString()
                        return (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-cvc">CVC</Label>
                  <Input id="new-cvc" placeholder="123" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-zip">Zip Code</Label>
                  <Input id="new-zip" placeholder="12345" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Card</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

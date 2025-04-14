"use client"

import { useState } from "react"
import { Download, FileText, ChevronDown, ChevronUp, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for billing history
const mockBillingHistory = [
  {
    id: "INV-001",
    date: "2023-05-15",
    amount: 150.0,
    status: "paid",
    description: "Telehealth Consultation - Dr. Smith",
    paymentMethod: "Visa •••• 4242",
    items: [
      { name: "Video Consultation", amount: 120.0 },
      { name: "Lab Test Review", amount: 30.0 },
    ],
  },
  {
    id: "INV-002",
    date: "2023-06-02",
    amount: 75.5,
    status: "paid",
    description: "Medication Refill",
    paymentMethod: "Mastercard •••• 5555",
    items: [
      { name: "Prescription Renewal", amount: 45.5 },
      { name: "Processing Fee", amount: 30.0 },
    ],
  },
  {
    id: "INV-003",
    date: "2023-06-20",
    amount: 200.0,
    status: "pending",
    description: "Comprehensive Health Assessment",
    paymentMethod: "Insurance Claim",
    items: [
      { name: "Health Assessment", amount: 180.0 },
      { name: "Report Generation", amount: 20.0 },
    ],
  },
  {
    id: "INV-004",
    date: "2023-07-05",
    amount: 95.0,
    status: "overdue",
    description: "Follow-up Consultation",
    paymentMethod: "Pending Payment",
    items: [{ name: "Follow-up Consultation", amount: 95.0 }],
  },
]

export function BillingHistory() {
  const [billingHistory, setBillingHistory] = useState(mockBillingHistory)
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateSort, setDateSort] = useState<"asc" | "desc">("desc")

  const filteredHistory = billingHistory
    .filter(
      (invoice) =>
        (statusFilter === "all" || invoice.status === statusFilter) &&
        (invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateSort === "asc" ? dateA - dateB : dateB - dateA
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleDownloadInvoice = (id: string) => {
    // In a real app, this would generate and download a PDF invoice
    console.log(`Downloading invoice ${id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>View and download your past invoices and payment history</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDateSort(dateSort === "asc" ? "desc" : "asc")}
              title={`Sort by date ${dateSort === "asc" ? "newest first" : "oldest first"}`}
            >
              {dateSort === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(invoice.id)}>
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Invoice {invoice.id}</DialogTitle>
                              <DialogDescription>Issued on {formatDate(invoice.date)}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Billed To</h4>
                                  <p className="font-medium">John Doe</p>
                                  <p className="text-sm text-muted-foreground">123 Main St, Anytown, USA</p>
                                  <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                                </div>
                                <div className="text-right">
                                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h4>
                                  <p className="font-medium">{invoice.paymentMethod}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Status: {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                  </p>
                                </div>
                              </div>
                              <div className="border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Item</TableHead>
                                      <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {invoice.items.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow>
                                      <TableCell className="font-bold">Total</TableCell>
                                      <TableCell className="text-right font-bold">
                                        {formatCurrency(invoice.amount)}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                              <div className="flex justify-end">
                                <Button onClick={() => handleDownloadInvoice(invoice.id)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Invoice
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

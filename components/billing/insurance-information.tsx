"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, Edit, Trash2, Shield, AlertCircle } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock data for insurance information
const mockInsuranceData = [
  {
    id: "1",
    type: "primary",
    provider: "Blue Cross Blue Shield",
    planName: "PPO Premium",
    memberId: "XYZ123456789",
    groupNumber: "GRP987654",
    policyHolder: "John Doe",
    relationship: "self",
    effectiveDate: "2023-01-01",
    expirationDate: "2023-12-31",
    coverageDetails: {
      deductible: 1500,
      outOfPocketMax: 5000,
      coinsurance: 20,
      copay: {
        primaryCare: 25,
        specialist: 50,
        emergency: 250,
        urgent: 75,
      },
    },
    verified: true,
  },
  {
    id: "2",
    type: "secondary",
    provider: "Aetna",
    planName: "HMO Basic",
    memberId: "ATN987654321",
    groupNumber: "GRP123456",
    policyHolder: "Jane Doe",
    relationship: "spouse",
    effectiveDate: "2023-01-01",
    expirationDate: "2023-12-31",
    coverageDetails: {
      deductible: 2000,
      outOfPocketMax: 6000,
      coinsurance: 30,
      copay: {
        primaryCare: 30,
        specialist: 60,
        emergency: 300,
        urgent: 100,
      },
    },
    verified: false,
  },
]

export function InsuranceInformation() {
  const [insuranceData, setInsuranceData] = useState(mockInsuranceData)
  const [isAddingInsurance, setIsAddingInsurance] = useState(false)
  const [editingInsurance, setEditingInsurance] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("insurance-cards")

  const handleAddInsurance = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to add the insurance
    const newInsurance = {
      id: Math.random().toString(36).substring(7),
      type: "secondary",
      provider: "United Healthcare",
      planName: "Choice Plus",
      memberId: "UHC" + Math.random().toString().substring(2, 10),
      groupNumber: "GRP" + Math.random().toString().substring(2, 8),
      policyHolder: "John Doe",
      relationship: "self",
      effectiveDate: "2023-07-01",
      expirationDate: "2024-06-30",
      coverageDetails: {
        deductible: 2500,
        outOfPocketMax: 7500,
        coinsurance: 20,
        copay: {
          primaryCare: 35,
          specialist: 70,
          emergency: 350,
          urgent: 100,
        },
      },
      verified: false,
    }
    setInsuranceData([...insuranceData, newInsurance])
    setIsAddingInsurance(false)
  }

  const handleDeleteInsurance = (id: string) => {
    setInsuranceData(insuranceData.filter((insurance) => insurance.id !== id))
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Information</CardTitle>
        <CardDescription>Manage your insurance plans and coverage details</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insurance-cards" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="insurance-cards">Insurance Cards</TabsTrigger>
            <TabsTrigger value="coverage-details">Coverage Details</TabsTrigger>
            <TabsTrigger value="claims-history">Claims History</TabsTrigger>
          </TabsList>

          <TabsContent value="insurance-cards" className="space-y-4">
            {insuranceData.map((insurance) => (
              <div
                key={insurance.id}
                className={`border rounded-lg overflow-hidden ${
                  insurance.type === "primary" ? "border-primary" : "border-border"
                }`}
              >
                <div className="bg-muted p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">{insurance.provider}</h3>
                      <p className="text-sm text-muted-foreground">{insurance.planName}</p>
                    </div>
                    {insurance.type === "primary" && <Badge className="ml-2">Primary</Badge>}
                    {insurance.type === "secondary" && (
                      <Badge variant="outline" className="ml-2">
                        Secondary
                      </Badge>
                    )}
                    {insurance.verified && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit insurance</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Insurance Information</DialogTitle>
                          <DialogDescription>Update your insurance details</DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="provider">Insurance Provider</Label>
                              <Input id="provider" defaultValue={insurance.provider} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="plan-name">Plan Name</Label>
                              <Input id="plan-name" defaultValue={insurance.planName} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="member-id">Member ID</Label>
                              <Input id="member-id" defaultValue={insurance.memberId} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="group-number">Group Number</Label>
                              <Input id="group-number" defaultValue={insurance.groupNumber} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="policy-holder">Policy Holder</Label>
                              <Input id="policy-holder" defaultValue={insurance.policyHolder} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="relationship">Relationship to Policy Holder</Label>
                              <Select defaultValue={insurance.relationship}>
                                <SelectTrigger id="relationship">
                                  <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="self">Self</SelectItem>
                                  <SelectItem value="spouse">Spouse</SelectItem>
                                  <SelectItem value="child">Child</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="effective-date">Effective Date</Label>
                              <Input id="effective-date" type="date" defaultValue={insurance.effectiveDate} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="expiration-date">Expiration Date</Label>
                              <Input id="expiration-date" type="date" defaultValue={insurance.expirationDate} />
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
                          <span className="sr-only">Delete insurance</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Insurance Information</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this insurance information? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteInsurance(insurance.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Member ID</p>
                      <p className="font-medium">{insurance.memberId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Group Number</p>
                      <p className="font-medium">{insurance.groupNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Policy Holder</p>
                      <p className="font-medium">{insurance.policyHolder}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Relationship</p>
                      <p className="font-medium capitalize">{insurance.relationship}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Effective Date</p>
                      <p className="font-medium">{formatDate(insurance.effectiveDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expiration Date</p>
                      <p className="font-medium">{formatDate(insurance.expirationDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {insuranceData.some((insurance) => !insurance.verified) && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification Required</AlertTitle>
                <AlertDescription>
                  Please upload a photo of your insurance card front and back to verify your coverage.
                </AlertDescription>
                <div className="mt-4 flex gap-4">
                  <Button variant="outline" size="sm">
                    Upload Front
                  </Button>
                  <Button variant="outline" size="sm">
                    Upload Back
                  </Button>
                </div>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="coverage-details" className="space-y-6">
            {insuranceData.map((insurance) => (
              <div key={insurance.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">
                    {insurance.provider} - {insurance.planName}
                  </h3>
                  {insurance.type === "primary" && <Badge>Primary</Badge>}
                  {insurance.type === "secondary" && <Badge variant="outline">Secondary</Badge>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Annual Deductible</p>
                      <p className="text-xl font-bold">{formatCurrency(insurance.coverageDetails.deductible)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Out-of-Pocket Max</p>
                      <p className="text-xl font-bold">{formatCurrency(insurance.coverageDetails.outOfPocketMax)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Coinsurance</p>
                      <p className="text-xl font-bold">{insurance.coverageDetails.coinsurance}%</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Copays</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex justify-between p-2 border rounded">
                      <span className="text-sm">Primary Care</span>
                      <span className="font-medium">{formatCurrency(insurance.coverageDetails.copay.primaryCare)}</span>
                    </div>
                    <div className="flex justify-between p-2 border rounded">
                      <span className="text-sm">Specialist</span>
                      <span className="font-medium">{formatCurrency(insurance.coverageDetails.copay.specialist)}</span>
                    </div>
                    <div className="flex justify-between p-2 border rounded">
                      <span className="text-sm">Emergency</span>
                      <span className="font-medium">{formatCurrency(insurance.coverageDetails.copay.emergency)}</span>
                    </div>
                    <div className="flex justify-between p-2 border rounded">
                      <span className="text-sm">Urgent Care</span>
                      <span className="font-medium">{formatCurrency(insurance.coverageDetails.copay.urgent)}</span>
                    </div>
                  </div>
                </div>

                <Separator />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="claims-history">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Claims history is not available in this view.</p>
              <p className="text-muted-foreground">
                Please contact your insurance provider for detailed claims information.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Dialog open={isAddingInsurance} onOpenChange={setIsAddingInsurance}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Insurance Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Insurance Plan</DialogTitle>
              <DialogDescription>Add your insurance information for billing and coverage</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddInsurance} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-provider">Insurance Provider</Label>
                  <Input id="new-provider" placeholder="e.g. Blue Cross Blue Shield" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-plan-name">Plan Name</Label>
                  <Input id="new-plan-name" placeholder="e.g. PPO Premium" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-member-id">Member ID</Label>
                  <Input id="new-member-id" placeholder="e.g. XYZ123456789" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-group-number">Group Number</Label>
                  <Input id="new-group-number" placeholder="e.g. GRP987654" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-policy-holder">Policy Holder</Label>
                  <Input id="new-policy-holder" placeholder="e.g. John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-relationship">Relationship to Policy Holder</Label>
                  <Select>
                    <SelectTrigger id="new-relationship">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Self</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-effective-date">Effective Date</Label>
                  <Input id="new-effective-date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-expiration-date">Expiration Date</Label>
                  <Input id="new-expiration-date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-type">Insurance Type</Label>
                  <Select>
                    <SelectTrigger id="new-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Insurance</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

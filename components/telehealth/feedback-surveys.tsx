"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Star, CheckCircle, Clock, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function FeedbackSurveys() {
  const [activeTab, setActiveTab] = useState("available")
  const [currentSurvey, setCurrentSurvey] = useState<number | null>(null)
  const [surveyResponses, setSurveyResponses] = useState<Record<string, any>>({})
  const { toast } = useToast()

  // Mock surveys data
  const availableSurveys = [
    {
      id: 1,
      title: "Telehealth Experience Feedback",
      description: "Help us improve your virtual care experience",
      deadline: "April 10, 2025",
      estimatedTime: "5 minutes",
      questions: [
        {
          id: "q1",
          type: "rating",
          question: "How would you rate the ease of connecting to your telehealth appointment?",
          options: [1, 2, 3, 4, 5],
        },
        {
          id: "q2",
          type: "rating",
          question: "How satisfied were you with the audio and video quality?",
          options: [1, 2, 3, 4, 5],
        },
        {
          id: "q3",
          type: "rating",
          question: "How well did the provider address your concerns during the virtual visit?",
          options: [1, 2, 3, 4, 5],
        },
        {
          id: "q4",
          type: "text",
          question: "What suggestions do you have to improve our telehealth services?",
        },
      ],
    },
    {
      id: 2,
      title: "Treatment Satisfaction Survey",
      description: "Share your experience with your current treatment plan",
      deadline: "April 15, 2025",
      estimatedTime: "8 minutes",
      questions: [
        {
          id: "q1",
          type: "rating",
          question: "How well is your current treatment managing your symptoms?",
          options: [1, 2, 3, 4, 5],
        },
        {
          id: "q2",
          type: "rating",
          question: "How satisfied are you with the information provided about your treatment?",
          options: [1, 2, 3, 4, 5],
        },
        {
          id: "q3",
          type: "text",
          question: "What side effects, if any, are you experiencing from your current treatment?",
        },
      ],
    },
  ]

  const completedSurveys = [
    {
      id: 3,
      title: "Initial Consultation Feedback",
      description: "Your feedback on your first appointment",
      completedDate: "March 15, 2025",
      score: 4.5,
    },
    {
      id: 4,
      title: "Patient Portal Usability",
      description: "Your experience using our digital tools",
      completedDate: "February 28, 2025",
      score: 3.8,
    },
  ]

  // Handle survey submission
  const handleSubmitSurvey = () => {
    const survey = availableSurveys.find((s) => s.id === currentSurvey)

    if (!survey) return

    // Check if all questions are answered
    const unansweredQuestions = survey.questions.filter((q) => !surveyResponses[`${currentSurvey}-${q.id}`])

    if (unansweredQuestions.length > 0) {
      toast({
        title: "Incomplete Survey",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      })
      return
    }

    // Submit survey logic would go here
    toast({
      title: "Survey Submitted",
      description: "Thank you for your feedback!",
    })

    // Reset state
    setCurrentSurvey(null)
    setSurveyResponses({})
    setActiveTab("completed")
  }

  // Handle response changes
  const handleResponseChange = (questionId: string, value: any) => {
    setSurveyResponses((prev) => ({
      ...prev,
      [`${currentSurvey}-${questionId}`]: value,
    }))
  }

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!currentSurvey) return 0

    const survey = availableSurveys.find((s) => s.id === currentSurvey)
    if (!survey) return 0

    const totalQuestions = survey.questions.length
    const answeredQuestions = survey.questions.filter((q) => surveyResponses[`${currentSurvey}-${q.id}`]).length

    return (answeredQuestions / totalQuestions) * 100
  }

  return (
    <div className="space-y-6">
      {currentSurvey ? (
        // Survey form view
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{availableSurveys.find((s) => s.id === currentSurvey)?.title}</CardTitle>
                <CardDescription>{availableSurveys.find((s) => s.id === currentSurvey)?.description}</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentSurvey(null)
                  setSurveyResponses({})
                }}
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion</span>
                <span>{Math.round(calculateCompletion())}%</span>
              </div>
              <Progress value={calculateCompletion()} className="h-2" />
            </div>

            {availableSurveys
              .find((s) => s.id === currentSurvey)
              ?.questions.map((question, index) => (
                <div key={question.id} className="space-y-3 pb-6 border-b last:border-0">
                  <h3 className="font-medium">
                    Question {index + 1}: {question.question}
                  </h3>

                  {question.type === "rating" && (
                    <RadioGroup
                      className="flex space-x-1"
                      value={surveyResponses[`${currentSurvey}-${question.id}`]}
                      onValueChange={(value) => handleResponseChange(question.id, value)}
                    >
                      {question.options?.map((option) => (
                        <div key={option} className="flex flex-col items-center space-y-1">
                          <RadioGroupItem
                            value={option.toString()}
                            id={`${question.id}-${option}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`${question.id}-${option}`}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-muted bg-popover p-0 text-center font-medium peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted hover:text-accent-foreground cursor-pointer"
                          >
                            {option}
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            {option === 1 ? "Poor" : option === 5 ? "Excellent" : ""}
                          </span>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "text" && (
                    <Textarea
                      placeholder="Type your answer here..."
                      value={surveyResponses[`${currentSurvey}-${question.id}`] || ""}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      className="min-h-[100px]"
                    />
                  )}
                </div>
              ))}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmitSurvey} className="w-full gap-2">
              <Send className="h-4 w-4" />
              Submit Survey
            </Button>
          </CardFooter>
        </Card>
      ) : (
        // Survey list view
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4">
              {availableSurveys.length > 0 ? (
                availableSurveys.map((survey) => (
                  <Card key={survey.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{survey.title}</CardTitle>
                      <CardDescription>{survey.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-amber-100 dark:bg-amber-900 p-1.5 rounded-full">
                            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <span className="text-sm">{survey.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
                            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm">Due by {survey.deadline}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => setCurrentSurvey(survey.id)}>
                        Start Survey
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Star className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                    <p className="text-muted-foreground">No surveys available at this time. Check back later!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedSurveys.length > 0 ? (
                completedSurveys.map((survey) => (
                  <Card key={survey.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{survey.title}</CardTitle>
                          <CardDescription>{survey.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span>Completed</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-sm">Completed on {survey.completedDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(survey.score)
                                  ? "text-amber-500 fill-amber-500"
                                  : i < survey.score
                                    ? "text-amber-500 fill-amber-500 opacity-50"
                                    : "text-muted-foreground"
                              }`}
                            />
                          ))}
                          <span className="text-sm ml-1">{survey.score.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Responses
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">You haven't completed any surveys yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

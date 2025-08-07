"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Star, Filter, Download, Eye, LogOut, User, Settings } from 'lucide-react'
import { CVUpload } from "../components/cv-upload"
import { CVAnalysis } from "../components/cv-analysis"
import { CandidateList } from "../components/candidate-list"
import { JobCriteria } from "../components/job-criteria"
import { EmailIntegration } from "../components/email-integration"
import { Header } from "../components/header"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [candidates, setCandidates] = useState([])
  const [jobCriteria, setJobCriteria] = useState({
    requiredSkills: [],
    preferredSkills: [],
    minExperience: 0,
    education: "",
    jobDescription: ""
  })
  const [emailSettings, setEmailSettings] = useState({
    enabled: false,
    template: "",
    subject: "",
    fromEmail: "",
    minScore: 80
  })
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "hr_manager") {
      router.push("/auth/login")
      return
    }

    setUser(parsedUser)
  }, [router])

  const handleCVsProcessed = (processedCVs) => {
    setCandidates(processedCVs)
    setActiveTab("results")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Smart Filter Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user.name}! Manage your recruitment process efficiently.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="criteria">Job Criteria</TabsTrigger>
            <TabsTrigger value="upload">Upload CVs</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          <TabsContent value="criteria">
            <JobCriteria 
              criteria={jobCriteria} 
              onCriteriaChange={setJobCriteria}
              onNext={() => setActiveTab("upload")}
            />
          </TabsContent>

          <TabsContent value="upload">
            <CVUpload 
              onCVsProcessed={handleCVsProcessed}
              jobCriteria={jobCriteria}
            />
          </TabsContent>

          <TabsContent value="analysis">
            <CVAnalysis candidates={candidates} />
          </TabsContent>

          <TabsContent value="results">
            <CandidateList 
              candidates={candidates}
              jobCriteria={jobCriteria}
            />
          </TabsContent>

          <TabsContent value="email">
            <EmailIntegration 
              candidates={candidates}
              emailSettings={emailSettings}
              onEmailSettingsChange={setEmailSettings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

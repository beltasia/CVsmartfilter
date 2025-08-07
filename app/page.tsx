"use client"

import { useState, useEffect } from "react"
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
import { Upload, FileText, Star, Filter, Download, Eye } from 'lucide-react'
import { CVUpload } from "./components/cv-upload"
import { CVAnalysis } from "./components/cv-analysis"
import { CandidateList } from "./components/candidate-list"
import { JobCriteria } from "./components/job-criteria"
import { EmailIntegration } from "./components/email-integration"

export default function CVSmartFilter() {
  const router = useRouter()
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

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      if (user.role === "hr_manager") {
        return
      }
    }
    
    // Redirect to login if not authenticated
    router.push("/auth/login")
  }, [router])

  const handleCVsProcessed = (processedCVs) => {
    setCandidates(processedCVs)
    setActiveTab("results")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Smart Filter</h1>
          <p className="text-gray-600">
            Intelligent recruitment system that automatically scans, parses, and scores CVs based on job requirements
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

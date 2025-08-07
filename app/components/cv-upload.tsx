"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

interface CVUploadProps {
  onCVsProcessed: (cvs: any[]) => void
  jobCriteria: any
}

// Mock CV data for demonstration
const mockCVData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    experience: 5,
    education: "bachelor",
    skills: ["React", "JavaScript", "Node.js", "Python", "AWS", "Docker"],
    projects: ["E-commerce Platform", "Task Management App", "API Gateway"],
    summary: "Senior Full Stack Developer with 5 years of experience in React, Node.js, and cloud technologies.",
    fileName: "john_smith_cv.pdf"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1-555-0124",
    experience: 3,
    education: "master",
    skills: ["Vue.js", "JavaScript", "Python", "Django", "PostgreSQL", "Git"],
    projects: ["Social Media Dashboard", "Inventory System"],
    summary: "Frontend Developer with strong backend skills and 3 years of experience.",
    fileName: "sarah_johnson_resume.pdf"
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "+1-555-0125",
    experience: 7,
    education: "bachelor",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "MongoDB", "Kubernetes"],
    projects: ["Microservices Architecture", "Real-time Chat App", "Analytics Dashboard"],
    summary: "Senior Software Engineer with expertise in modern web technologies and DevOps.",
    fileName: "mike_chen_cv.docx"
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "+1-555-0126",
    experience: 2,
    education: "bachelor",
    skills: ["HTML", "CSS", "JavaScript", "React", "Figma", "Adobe XD"],
    projects: ["Portfolio Website", "Landing Page Redesign"],
    summary: "Junior Frontend Developer with design background and 2 years of experience.",
    fileName: "emily_davis_resume.pdf"
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1-555-0127",
    experience: 8,
    education: "master",
    skills: ["Java", "Spring Boot", "Microservices", "AWS", "Docker", "Jenkins"],
    projects: ["Enterprise Banking System", "Payment Gateway", "Cloud Migration"],
    summary: "Senior Backend Developer with extensive experience in enterprise applications.",
    fileName: "david_wilson_cv.pdf"
  }
]

export function CVUpload({ onCVsProcessed, jobCriteria }: CVUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processed, setProcessed] = useState(false)

  const calculateScore = (candidate: any) => {
    let score = 0
    let maxScore = 100

    // Experience scoring (30 points)
    const experienceScore = Math.min((candidate.experience / Math.max(jobCriteria.minExperience, 1)) * 30, 30)
    score += experienceScore

    // Required skills scoring (40 points)
    const requiredSkillsFound = jobCriteria.requiredSkills.filter(skill => 
      candidate.skills.some(candidateSkill => 
        candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(candidateSkill.toLowerCase())
      )
    ).length
    const requiredSkillsScore = jobCriteria.requiredSkills.length > 0 
      ? (requiredSkillsFound / jobCriteria.requiredSkills.length) * 40 
      : 40
    score += requiredSkillsScore

    // Preferred skills scoring (20 points)
    const preferredSkillsFound = jobCriteria.preferredSkills.filter(skill => 
      candidate.skills.some(candidateSkill => 
        candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(candidateSkill.toLowerCase())
      )
    ).length
    const preferredSkillsScore = jobCriteria.preferredSkills.length > 0 
      ? (preferredSkillsFound / jobCriteria.preferredSkills.length) * 20 
      : 20
    score += preferredSkillsScore

    // Education scoring (10 points)
    const educationLevels = { "high-school": 1, "associate": 2, "bachelor": 3, "master": 4, "phd": 5 }
    const candidateEducationLevel = educationLevels[candidate.education] || 0
    const requiredEducationLevel = educationLevels[jobCriteria.education] || 0
    const educationScore = candidateEducationLevel >= requiredEducationLevel ? 10 : 5
    score += educationScore

    return Math.round(score)
  }

  const processFiles = async () => {
    setProcessing(true)
    setProgress(0)

    // Simulate file processing
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Process mock data and calculate scores
    const processedCandidates = mockCVData.map(candidate => ({
      ...candidate,
      score: calculateScore(candidate),
      matchedRequiredSkills: jobCriteria.requiredSkills.filter(skill => 
        candidate.skills.some(candidateSkill => 
          candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(candidateSkill.toLowerCase())
        )
      ),
      matchedPreferredSkills: jobCriteria.preferredSkills.filter(skill => 
        candidate.skills.some(candidateSkill => 
          candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(candidateSkill.toLowerCase())
        )
      )
    })).sort((a, b) => b.score - a.score)

    setProcessing(false)
    setProcessed(true)
    onCVsProcessed(processedCandidates)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || 
              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    setFiles(prev => [...prev, ...droppedFiles])
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        file => file.type === 'application/pdf' || 
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload CV Files</CardTitle>
          <CardDescription>
            Upload PDF or DOCX files to analyze and score candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop CV files here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports PDF and DOCX files up to 10MB each
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.docx"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                Browse Files
              </Button>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Selected Files ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="flex-1 text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {processing && (
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">Processing CVs...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {processed && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Processing Complete!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Successfully processed {mockCVData.length} CVs. Check the Results tab to view rankings.
              </p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button 
              onClick={processFiles} 
              disabled={processing || processed}
              className="flex-1"
            >
              {processing ? "Processing..." : processed ? "Processed" : "Process CVs"}
            </Button>
            {!processed && (
              <Button 
                variant="outline" 
                onClick={() => processFiles()}
                disabled={processing}
              >
                Use Demo Data
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Eye, Download, Mail, Phone, GraduationCap, Briefcase, Award } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface CandidateListProps {
  candidates: any[]
  jobCriteria: any
}

export function CandidateList({ candidates, jobCriteria }: CandidateListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("score")
  const [minScore, setMinScore] = useState(0)

  const filteredCandidates = candidates
    .filter(candidate => 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(candidate => candidate.score >= minScore)
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score
        case "experience":
          return b.experience - a.experience
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "Excellent Match"
    if (score >= 60) return "Good Match"
    return "Partial Match"
  }

  if (candidates.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">No candidates to display. Please upload and process CVs first.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Candidate Rankings</CardTitle>
          <CardDescription>
            {filteredCandidates.length} candidates ranked by job match score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search candidates or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Sort by Score</SelectItem>
                <SelectItem value="experience">Sort by Experience</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
              </SelectContent>
            </Select>
            <Select value={minScore.toString()} onValueChange={(value) => setMinScore(parseInt(value))}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Scores</SelectItem>
                <SelectItem value="60">60+ Score</SelectItem>
                <SelectItem value="70">70+ Score</SelectItem>
                <SelectItem value="80">80+ Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredCandidates.map((candidate, index) => (
              <Card key={candidate.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{candidate.name}</h3>
                        {index < 3 && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Top Candidate
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {candidate.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {candidate.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {candidate.experience} years
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {candidate.education}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">{candidate.summary}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.score)}`}>
                        <Award className="h-4 w-4 mr-1" />
                        {candidate.score}%
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{getScoreBadge(candidate.score)}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-2">Matched Required Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {candidate.matchedRequiredSkills.map((skill, idx) => (
                          <Badge key={idx} variant="default" className="text-xs bg-green-100 text-green-800">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.matchedRequiredSkills.length === 0 && (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-700 mb-2">Matched Preferred Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {candidate.matchedPreferredSkills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.matchedPreferredSkills.length === 0 && (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Match Score</span>
                        <span className="font-medium">{candidate.score}%</span>
                      </div>
                      <Progress value={candidate.score} className="h-2" />
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{candidate.name} - Detailed Profile</DialogTitle>
                            <DialogDescription>
                              Complete candidate information and skill analysis
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Contact Information</h4>
                                <div className="space-y-1 text-sm">
                                  <p><strong>Email:</strong> {candidate.email}</p>
                                  <p><strong>Phone:</strong> {candidate.phone}</p>
                                  <p><strong>Experience:</strong> {candidate.experience} years</p>
                                  <p><strong>Education:</strong> {candidate.education}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Match Analysis</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Overall Score:</span>
                                    <span className="font-medium">{candidate.score}%</span>
                                  </div>
                                  <Progress value={candidate.score} className="h-2" />
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">All Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {candidate.skills.map((skill, idx) => (
                                  <Badge key={idx} variant="outline">{skill}</Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Projects</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                {candidate.projects.map((project, idx) => (
                                  <li key={idx}>{project}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Summary</h4>
                              <p className="text-sm text-gray-700">{candidate.summary}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download CV
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          // Simulate sending individual email
                          alert(`Email sent to ${candidate.name}!`)
                        }}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Send Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

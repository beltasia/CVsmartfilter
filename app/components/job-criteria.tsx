"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, ArrowRight } from 'lucide-react'

interface JobCriteriaProps {
  criteria: any
  onCriteriaChange: (criteria: any) => void
  onNext: () => void
}

export function JobCriteria({ criteria, onCriteriaChange, onNext }: JobCriteriaProps) {
  const [newSkill, setNewSkill] = useState("")
  const [skillType, setSkillType] = useState("required")

  const addSkill = () => {
    if (!newSkill.trim()) return
    
    const updatedCriteria = { ...criteria }
    if (skillType === "required") {
      updatedCriteria.requiredSkills = [...criteria.requiredSkills, newSkill.trim()]
    } else {
      updatedCriteria.preferredSkills = [...criteria.preferredSkills, newSkill.trim()]
    }
    
    onCriteriaChange(updatedCriteria)
    setNewSkill("")
  }

  const removeSkill = (skill: string, type: string) => {
    const updatedCriteria = { ...criteria }
    if (type === "required") {
      updatedCriteria.requiredSkills = criteria.requiredSkills.filter(s => s !== skill)
    } else {
      updatedCriteria.preferredSkills = criteria.preferredSkills.filter(s => s !== skill)
    }
    onCriteriaChange(updatedCriteria)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Job Requirements</CardTitle>
          <CardDescription>
            Define the criteria for evaluating candidates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Enter the job description..."
              value={criteria.jobDescription}
              onChange={(e) => onCriteriaChange({ ...criteria, jobDescription: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-experience">Minimum Experience (years)</Label>
              <Input
                id="min-experience"
                type="number"
                min="0"
                value={criteria.minExperience}
                onChange={(e) => onCriteriaChange({ ...criteria, minExperience: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education Level</Label>
              <Select
                value={criteria.education}
                onValueChange={(value) => onCriteriaChange({ ...criteria, education: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="associate">Associate Degree</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add skill (e.g., React, Python, AWS)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <Select value={skillType} onValueChange={setSkillType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="preferred">Preferred</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addSkill} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills Overview</CardTitle>
          <CardDescription>
            Review the skills you've added for this position
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-red-600">Required Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {criteria.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1">
                    {skill}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeSkill(skill, "required")}
                    />
                  </Badge>
                ))}
                {criteria.requiredSkills.length === 0 && (
                  <p className="text-sm text-gray-500">No required skills added</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-blue-600">Preferred Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {criteria.preferredSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeSkill(skill, "preferred")}
                    />
                  </Badge>
                ))}
                {criteria.preferredSkills.length === 0 && (
                  <p className="text-sm text-gray-500">No preferred skills added</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={onNext} className="w-full">
              Continue to Upload CVs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

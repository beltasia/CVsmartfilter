"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Users, Award, Target } from 'lucide-react'

interface CVAnalysisProps {
  candidates: any[]
}

export function CVAnalysis({ candidates }: CVAnalysisProps) {
  if (candidates.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">No analysis data available. Please process CVs first.</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate analytics
  const avgScore = Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length)
  const topCandidates = candidates.filter(c => c.score >= 80).length
  const goodCandidates = candidates.filter(c => c.score >= 60 && c.score < 80).length
  const avgExperience = Math.round(candidates.reduce((sum, c) => sum + c.experience, 0) / candidates.length)

  // Score distribution data
  const scoreDistribution = [
    { range: "80-100%", count: candidates.filter(c => c.score >= 80).length, color: "#10b981" },
    { range: "60-79%", count: candidates.filter(c => c.score >= 60 && c.score < 80).length, color: "#f59e0b" },
    { range: "40-59%", count: candidates.filter(c => c.score >= 40 && c.score < 60).length, color: "#ef4444" },
    { range: "0-39%", count: candidates.filter(c => c.score < 40).length, color: "#6b7280" }
  ]

  // Skills frequency
  const skillsFrequency = {}
  candidates.forEach(candidate => {
    candidate.skills.forEach(skill => {
      skillsFrequency[skill] = (skillsFrequency[skill] || 0) + 1
    })
  })

  const topSkills = Object.entries(skillsFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }))

  // Experience distribution
  const experienceDistribution = [
    { range: "0-2 years", count: candidates.filter(c => c.experience <= 2).length },
    { range: "3-5 years", count: candidates.filter(c => c.experience >= 3 && c.experience <= 5).length },
    { range: "6-8 years", count: candidates.filter(c => c.experience >= 6 && c.experience <= 8).length },
    { range: "9+ years", count: candidates.filter(c => c.experience >= 9).length }
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold">{candidates.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold">{avgScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Matches</p>
                <p className="text-2xl font-bold">{topCandidates}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Experience</p>
                <p className="text-2xl font-bold">{avgExperience} yrs</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>How candidates are distributed across score ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experience Distribution</CardTitle>
            <CardDescription>Candidates grouped by years of experience</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={experienceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ range, count }) => `${range}: ${count}`}
                >
                  {experienceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Most Common Skills</CardTitle>
          <CardDescription>Skills that appear most frequently across all candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSkills.map(({ skill, count }, index) => (
              <div key={skill} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium w-4">{index + 1}</span>
                  <Badge variant="outline">{skill}</Badge>
                </div>
                <div className="flex items-center gap-3 flex-1 max-w-xs">
                  <Progress value={(count / candidates.length) * 100} className="flex-1" />
                  <span className="text-sm text-gray-600 w-12">{count}/{candidates.length}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Breakdown</CardTitle>
          <CardDescription>Detailed analysis of candidate quality distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{topCandidates}</div>
              <div className="text-sm text-gray-600 mb-2">Excellent Matches</div>
              <div className="text-xs text-gray-500">80%+ score</div>
              <Progress value={(topCandidates / candidates.length) * 100} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{goodCandidates}</div>
              <div className="text-sm text-gray-600 mb-2">Good Matches</div>
              <div className="text-xs text-gray-500">60-79% score</div>
              <Progress value={(goodCandidates / candidates.length) * 100} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {candidates.length - topCandidates - goodCandidates}
              </div>
              <div className="text-sm text-gray-600 mb-2">Partial Matches</div>
              <div className="text-xs text-gray-500">{'<60% score'}</div>
              <Progress 
                value={((candidates.length - topCandidates - goodCandidates) / candidates.length) * 100} 
                className="mt-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

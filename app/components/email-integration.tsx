"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Send, Settings, Users, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface EmailIntegrationProps {
  candidates: any[]
  emailSettings: any
  onEmailSettingsChange: (settings: any) => void
}

const emailTemplates = {
  interview: {
    subject: "Interview Invitation - {{position}} at {{company}}",
    template: `Dear {{candidateName}},

We are impressed with your background and would like to invite you for an interview for the {{position}} position at {{company}}.

Based on your CV, we believe you would be an excellent fit for our team. Your experience with {{topSkills}} particularly caught our attention.

Interview Details:
- Position: {{position}}
- Date: {{interviewDate}}
- Time: {{interviewTime}}
- Format: {{interviewFormat}}

Please confirm your availability by replying to this email.

Best regards,
{{recruiterName}}
{{company}} Recruitment Team`
  },
  followUp: {
    subject: "Thank you for your application - {{position}}",
    template: `Dear {{candidateName}},

Thank you for applying for the {{position}} position at {{company}}.

We have reviewed your application and are impressed with your qualifications, particularly your experience with {{topSkills}}.

We will be in touch within the next few days to discuss next steps.

Best regards,
{{recruiterName}}
{{company}} Recruitment Team`
  },
  screening: {
    subject: "Next Steps - {{position}} Application",
    template: `Dear {{candidateName}},

Thank you for your interest in the {{position}} role at {{company}}.

Your profile shows strong experience in {{topSkills}}, which aligns well with our requirements.

We would like to schedule a brief screening call to discuss your background and the role in more detail.

Please let us know your availability for a 30-minute call this week.

Best regards,
{{recruiterName}}
{{company}} Recruitment Team`
  }
}

export function EmailIntegration({ candidates, emailSettings, onEmailSettingsChange }: EmailIntegrationProps) {
  const [activeTemplate, setActiveTemplate] = useState("interview")
  const [sending, setSending] = useState(false)
  const [sentEmails, setSentEmails] = useState([])
  const [previewCandidate, setPreviewCandidate] = useState(null)

  const topCandidates = candidates.filter(c => c.score >= emailSettings.minScore)

  const handleTemplateChange = (templateKey: string) => {
    setActiveTemplate(templateKey)
    onEmailSettingsChange({
      ...emailSettings,
      subject: emailTemplates[templateKey].subject,
      template: emailTemplates[templateKey].template
    })
  }

  const personalizeEmail = (template: string, candidate: any) => {
    return template
      .replace(/{{candidateName}}/g, candidate.name)
      .replace(/{{position}}/g, "Software Developer")
      .replace(/{{company}}/g, "TechCorp Inc.")
      .replace(/{{topSkills}}/g, candidate.matchedRequiredSkills.slice(0, 3).join(", "))
      .replace(/{{interviewDate}}/g, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString())
      .replace(/{{interviewTime}}/g, "2:00 PM")
      .replace(/{{interviewFormat}}/g, "Video Call (Zoom)")
      .replace(/{{recruiterName}}/g, "Sarah Johnson")
  }

  const sendEmails = async () => {
    setSending(true)
    const emailsToSend = topCandidates.map(candidate => ({
      id: Date.now() + Math.random(),
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      subject: personalizeEmail(emailSettings.subject, candidate),
      content: personalizeEmail(emailSettings.template, candidate),
      status: 'pending',
      sentAt: new Date()
    }))

    // Simulate sending emails
    for (let i = 0; i < emailsToSend.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      emailsToSend[i].status = Math.random() > 0.1 ? 'sent' : 'failed'
    }

    setSentEmails(prev => [...prev, ...emailsToSend])
    setSending(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Email Setup</TabsTrigger>
          <TabsTrigger value="preview">Preview & Send</TabsTrigger>
          <TabsTrigger value="history">Email History</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
                <CardDescription>
                  Configure your email settings and sender information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-enabled"
                    checked={emailSettings.enabled}
                    onCheckedChange={(checked) => 
                      onEmailSettingsChange({ ...emailSettings, enabled: checked })
                    }
                  />
                  <Label htmlFor="email-enabled">Enable automated emails</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input
                    id="from-email"
                    type="email"
                    placeholder="recruiter@company.com"
                    value={emailSettings.fromEmail}
                    onChange={(e) => 
                      onEmailSettingsChange({ ...emailSettings, fromEmail: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-score">Minimum Score for Email</Label>
                  <Select
                    value={emailSettings.minScore.toString()}
                    onValueChange={(value) => 
                      onEmailSettingsChange({ ...emailSettings, minScore: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="70">70+ Score</SelectItem>
                      <SelectItem value="75">75+ Score</SelectItem>
                      <SelectItem value="80">80+ Score</SelectItem>
                      <SelectItem value="85">85+ Score</SelectItem>
                      <SelectItem value="90">90+ Score</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Only candidates with this score or higher will receive emails
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{topCandidates.length} candidates</span>
                    <span className="text-gray-500">will receive emails</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Choose from pre-built templates or create your own
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Template Type</Label>
                  <Select value={activeTemplate} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interview">Interview Invitation</SelectItem>
                      <SelectItem value="followUp">Follow-up Email</SelectItem>
                      <SelectItem value="screening">Screening Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject Line</Label>
                  <Input
                    id="email-subject"
                    value={emailSettings.subject}
                    onChange={(e) => 
                      onEmailSettingsChange({ ...emailSettings, subject: e.target.value })
                    }
                    placeholder="Email subject..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-template">Email Template</Label>
                  <Textarea
                    id="email-template"
                    rows={8}
                    value={emailSettings.template}
                    onChange={(e) => 
                      onEmailSettingsChange({ ...emailSettings, template: e.target.value })
                    }
                    placeholder="Email content..."
                  />
                  <div className="text-xs text-gray-500">
                    Available variables: {{candidateName}}, {{position}}, {{company}}, {{topSkills}}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Preview & Send
              </CardTitle>
              <CardDescription>
                Review recipients and send emails to top candidates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-blue-900">Ready to Send</h3>
                    <p className="text-sm text-blue-700">
                      {topCandidates.length} candidates with {emailSettings.minScore}+ score will receive emails
                    </p>
                  </div>
                  <Button 
                    onClick={sendEmails} 
                    disabled={!emailSettings.enabled || sending || topCandidates.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? "Sending..." : "Send Emails"}
                  </Button>
                </div>

                {sending && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm">Sending emails...</span>
                    </div>
                    <Progress value={50} className="w-full" />
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="font-medium">Recipients ({topCandidates.length})</h4>
                  {topCandidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                        </div>
                        <Badge variant="secondary">{candidate.score}% match</Badge>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setPreviewCandidate(candidate)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Email Preview - {candidate.name}</DialogTitle>
                            <DialogDescription>
                              Preview of the personalized email that will be sent
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">Subject:</Label>
                              <p className="text-sm bg-gray-50 p-2 rounded border">
                                {personalizeEmail(emailSettings.subject, candidate)}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Content:</Label>
                              <div className="text-sm bg-gray-50 p-4 rounded border whitespace-pre-line">
                                {personalizeEmail(emailSettings.template, candidate)}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email History</CardTitle>
              <CardDescription>
                Track sent emails and their delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sentEmails.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No emails sent yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sentEmails.map((email) => (
                    <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(email.status)}
                        <div>
                          <p className="font-medium">{email.candidateName}</p>
                          <p className="text-sm text-gray-600">{email.candidateEmail}</p>
                          <p className="text-xs text-gray-500">
                            {email.sentAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(email.status)}>
                          {email.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {email.subject.substring(0, 40)}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

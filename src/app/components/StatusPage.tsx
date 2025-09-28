'use client'

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, Download, MessageSquare, Calendar, User, Mail, Briefcase } from "lucide-react";
import { motion } from "motion/react";

interface ProjectData {
  name: string;
  email: string;
  company: string;
  projectType: string;
}

interface StatusPageProps {
  projectData: ProjectData;
  onDownloadBrief: () => void;
  onRequestRevisions: () => void;
  onBookConsultation: () => void;
  onBackToAdmin: () => void;
}

export function StatusPage({ 
  projectData, 
  onDownloadBrief, 
  onRequestRevisions, 
  onBookConsultation,
  onBackToAdmin 
}: StatusPageProps) {
  const statusSteps = [
    { id: "submitted", label: "Submitted", completed: true },
    { id: "chat", label: "In Chat", completed: true },
    { id: "completed", label: "Completed", completed: true },
    { id: "ready", label: "Brief Ready", completed: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Gator Innovation Project Overview</h1>
          <p className="text-gray-600">Powered by OpenGig - Your project brief is ready for download</p>
        </div>

        {/* Project Info Card */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Client Name</p>
                  <p className="text-gray-900">{projectData.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{projectData.email}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-gray-900">{projectData.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Project Type</p>
                  <Badge variant="secondary" className="mt-1">
                    {projectData.projectType}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Status Tracker */}
        <Card className="p-6 mb-8 shadow-lg">
          <h2 className="text-xl text-gray-900 mb-6">Project Status</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-6 w-full h-0.5 bg-gray-200">
              <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 w-full"></div>
            </div>
            
            {/* Status Steps */}
            <div className="grid grid-cols-4 gap-4">
              {statusSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center relative"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                    step.completed 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-center mt-3">
                    <p className={`text-sm ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={onDownloadBrief}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Brief (PDF)
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={onRequestRevisions}
              variant="outline"
              className="w-full h-12 border-2 hover:bg-gray-50"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Request Revisions
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onBookConsultation}
              variant="outline"
              className="w-full h-12 border-2 hover:bg-gray-50"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Consultation
            </Button>
          </motion.div>
        </div>

        {/* Brief Preview */}
        <Card className="p-6 shadow-lg">
          <h3 className="text-lg text-gray-900 mb-4">Brief Summary</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Generated</p>
                <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Pages</p>
                <p className="text-gray-900">12 pages</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Sections</p>
                <p className="text-gray-900">Executive Summary, Technical Specs, Timeline, Resources</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">File Size</p>
                <p className="text-gray-900">2.4 MB</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Back to Admin (Hidden link for demo) */}
        <div className="text-center mt-8">
          <button
            onClick={onBackToAdmin}
            className="text-sm text-gray-400 hover:text-gray-600 underline"
          >
            ← Back to Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
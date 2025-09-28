'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowLeft, ArrowRight, Edit3, CheckCircle, User, Mail, Building, Briefcase, DollarSign, Clock, FileText } from "lucide-react";
import { motion } from "motion/react";

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
}

interface ReviewEditPageProps {
  formData: FormData;
  onSave: (data: FormData) => void;
  onBack: () => void;
}

export function ReviewEditPage({ formData, onSave, onBack }: ReviewEditPageProps) {
  const [editedData, setEditedData] = useState<FormData>(formData);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateField = (key: keyof FormData, value: string) => {
    setEditedData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(editedData);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedData(formData);
    setIsEditing(false);
    setHasChanges(false);
  };

  const projectTypeOptions = [
    "Web Application",
    "Mobile App", 
    "E-commerce Site",
    "Landing Page",
    "Custom Software",
    "Other"
  ];

  const budgetOptions = [
    "Under $5,000",
    "$5,000 - $15,000", 
    "$15,000 - $50,000",
    "$50,000 - $100,000",
    "Over $100,000"
  ];

  const timelineOptions = [
    "ASAP (Rush)",
    "1-2 months",
    "3-6 months", 
    "6+ months",
    "Flexible"
  ];

  const fields = [
    { key: "name", label: "Full Name", icon: User, type: "input" },
    { key: "email", label: "Email Address", icon: Mail, type: "input" },
    { key: "company", label: "Company Name", icon: Building, type: "input" },
    { key: "projectType", label: "Project Type", icon: Briefcase, type: "select", options: projectTypeOptions },
    { key: "budget", label: "Budget Range", icon: DollarSign, type: "select", options: budgetOptions },
    { key: "timeline", label: "Timeline", icon: Clock, type: "select", options: timelineOptions },
    { key: "description", label: "Project Description", icon: FileText, type: "textarea" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Review Project Details</h1>
          <p className="text-gray-600">
            Please review and edit your project information before we generate your brief
          </p>
        </div>

        {/* Review Card */}
        <Card className="p-8 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-gray-900">Project Information</h2>
            <div className="flex space-x-3">
              {!isEditing ? (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Details</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={field.key === "description" ? "md:col-span-2" : ""}
              >
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <field.icon className="h-4 w-4 text-gray-500" />
                    <span>{field.label}</span>
                  </Label>
                  
                  {isEditing ? (
                    <>
                      {field.type === "input" && (
                        <Input
                          value={editedData[field.key as keyof FormData]}
                          onChange={(e) => updateField(field.key as keyof FormData, e.target.value)}
                          className="h-11"
                        />
                      )}
                      {field.type === "select" && (
                        <Select
                          value={editedData[field.key as keyof FormData]}
                          onValueChange={(value) => updateField(field.key as keyof FormData, value)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {field.type === "textarea" && (
                        <Textarea
                          value={editedData[field.key as keyof FormData]}
                          onChange={(e) => updateField(field.key as keyof FormData, e.target.value)}
                          className="min-h-24"
                        />
                      )}
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3 min-h-11 flex items-center">
                      <p className="text-gray-900">
                        {editedData[field.key as keyof FormData] || "Not specified"}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {hasChanges && !isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p className="text-sm text-blue-800">
                You have unsaved changes. Please review your edits above.
              </p>
            </motion.div>
          )}
        </Card>

        {/* Chat Summary */}
        <Card className="p-6 shadow-lg mb-8">
          <h3 className="text-lg text-gray-900 mb-4">Additional Details from Conversation</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              Based on our conversation, we've gathered additional insights about your target audience, 
              core feature requirements, design preferences, platform needs, integration requirements, 
              and success metrics. These details will be included in your comprehensive project brief.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Target Audience Defined</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Core Features Identified</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Technical Requirements</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Success Metrics</span>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chat
          </Button>
          <Button
            onClick={handleSave}
            disabled={isEditing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
          >
            Generate Brief
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
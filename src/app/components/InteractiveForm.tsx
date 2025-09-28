'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleSheetsService } from "@/lib/googleSheets";

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
}

interface InteractiveFormProps {
  onComplete: (data: FormData) => void;
  onBack: () => void;
}

export function InteractiveForm({ onComplete, onBack }: InteractiveFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: ""
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const steps = [
    {
      title: "Let's start with your details",
      subtitle: "We'll use this to personalize your experience",
      fields: [
        { key: "name", label: "Full Name", type: "input", placeholder: "John Doe" },
        { key: "email", label: "Email Address", type: "input", placeholder: "john@company.com" },
        { key: "company", label: "Company Name", type: "input", placeholder: "Acme Inc." }
      ]
    },
    {
      title: "Tell us about your project",
      subtitle: "This helps us understand your needs better",
      fields: [
        {
          key: "projectType",
          label: "Project Type",
          type: "select",
          options: [
            "Web Application",
            "Mobile App",
            "E-commerce Site",
            "Landing Page",
            "Custom Software",
            "Other"
          ]
        }
      ]
    },
    {
      title: "Project scope and timeline",
      subtitle: "Help us understand your constraints",
      fields: [
        {
          key: "budget",
          label: "Budget Range",
          type: "select",
          options: [
            "Under $5,000",
            "$5,000 - $15,000",
            "$15,000 - $50,000",
            "$50,000 - $100,000",
            "Over $100,000"
          ]
        },
        {
          key: "timeline",
          label: "Timeline",
          type: "select",
          options: [
            "ASAP (Rush)",
            "1-2 months",
            "3-6 months",
            "6+ months",
            "Flexible"
          ]
        }
      ]
    },
    {
      title: "Project description",
      subtitle: "Share your vision with us",
      fields: [
        {
          key: "description",
          label: "Project Description",
          type: "textarea",
          placeholder: "Describe your project goals, key features, target audience, and any specific requirements..."
        }
      ]
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConfirmation(true);
      
      // Log client data to Google Sheets
      try {
        const success = await GoogleSheetsService.logClientData(formData);
        if (success) {
          console.log('Client data logged successfully to Google Sheets');
        } else {
          console.warn('Failed to log client data to Google Sheets');
        }
      } catch (error) {
        console.error('Error logging client data:', error);
      }
      
      setTimeout(() => {
        onComplete(formData);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const isStepValid = () => {
    const currentFields = steps[currentStep].fields;
    return currentFields.every(field => formData[field.key as keyof FormData].trim() !== "");
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl mb-4 text-gray-900">Thank You!</h2>
          <p className="text-lg text-gray-600 mb-4">We've sent you an email with next steps.</p>
          <p className="text-sm text-gray-500">You'll receive a link to continue with our AI assistant shortly.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gator Innovation</h1>
          <p className="text-lg text-gray-600">Powered by OpenGig</p>
          <p className="text-base text-gray-500">Tell us about your project</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span className="font-medium">Step {currentStep + 1} of {steps.length}</span>
            <span className="font-medium">{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{steps[currentStep].title}</h2>
                <p className="text-gray-600 text-base">{steps[currentStep].subtitle}</p>
              </div>

              <div className="space-y-6">
                {steps[currentStep].fields.map((field) => (
                  <div key={field.key} className="space-y-3">
                    <Label htmlFor={field.key} className="text-sm font-medium text-gray-700">{field.label}</Label>
                    {field.type === "input" && (
                      <Input
                        id={field.key}
                        placeholder={field.type === "input" ? (field as any).placeholder : ""}
                        value={formData[field.key as keyof FormData]}
                        onChange={(e) => updateFormData(field.key, e.target.value)}
                        className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      />
                    )}
                    {field.type === "select" && (
                      <Select
                        value={formData[field.key as keyof FormData]}
                        onValueChange={(value) => updateFormData(field.key, value)}
                      >
                        <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors">
                          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {(field as any).options?.map((option: string) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {field.type === "textarea" && (
                      <Textarea
                        id={field.key}
                        placeholder={field.type === "textarea" ? (field as any).placeholder : ""}
                        value={formData[field.key as keyof FormData]}
                        onChange={(e) => updateFormData(field.key, e.target.value)}
                        className="min-h-32 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="px-6 py-3 border-gray-300 hover:bg-gray-50 transition-colors"
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
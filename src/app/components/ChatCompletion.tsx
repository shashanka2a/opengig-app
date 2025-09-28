'use client'

import { useEffect, useState } from "react";
import { CheckCircle, FileText, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface ChatCompletionProps {
  userName: string;
  onComplete: () => void;
}

export function ChatCompletion({ userName, onComplete }: ChatCompletionProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Analyzing conversation data...",
    "Extracting key requirements...",
    "Structuring project scope...",
    "Generating technical specifications...",
    "Creating project timeline...",
    "Finalizing your brief..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 1000);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 800);

    return () => clearInterval(stepInterval);
  }, [steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-3xl text-gray-900 mb-4">
              Thanks, {userName}!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              We&apos;re generating your project brief
            </p>
            <p className="text-gray-500">
              This will only take a moment...
            </p>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Processing</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: index <= currentStep ? 1 : 0.3,
                    x: 0 
                  }}
                  className="flex items-center space-x-3"
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : index === currentStep ? (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-left ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your comprehensive project brief will include:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Detailed project scope</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Technical specifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Timeline & milestones</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Resource requirements</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
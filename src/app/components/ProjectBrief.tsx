'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Download, ExternalLink, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ProjectBriefData {
  targetAudience: string;
  coreFeatures: string;
  designUX: string;
  platformTech: string;
  successGoals: string;
}

interface ProjectBriefProps {
  data: ProjectBriefData;
}

export default function ProjectBrief({ data }: ProjectBriefProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!briefRef.current) return;

    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(briefRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('project-brief.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Show user-friendly error message
      alert('Failed to generate PDF. Please try again or contact support if the issue persists.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Project Brief Complete
          </h1>
          <p className="text-xl text-gray-600">
            Your project requirements have been successfully captured
          </p>
        </div>

        {/* Project Brief Content */}
        <div ref={briefRef} className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Brief</h2>
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-8">
            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Target Audience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{data.targetAudience}</p>
              </CardContent>
            </Card>

            {/* Core Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Core Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{data.coreFeatures}</p>
              </CardContent>
            </Card>

            {/* Design & UX */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Design & UX
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{data.designUX}</p>
              </CardContent>
            </Card>

            {/* Platform & Technology */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Platform & Technology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{data.platformTech}</p>
              </CardContent>
            </Card>

            {/* Success Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Success Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{data.successGoals}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            <Download className="h-5 w-5 mr-2" />
            {isGeneratingPDF ? 'Generating PDF...' : 'Download Brief as PDF'}
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Next Steps</CardTitle>
            <CardDescription className="text-lg">
              Your project brief has been captured and our development team will review it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-2 mt-1">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Project Brief Complete</h3>
                <p className="text-gray-600">
                  All 5 key topics have been successfully captured and documented
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 mt-1">
                <ExternalLink className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Development Team Access</h3>
                <p className="text-gray-600 mb-3">
                  Our development team can access your project details through the admin dashboard
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <a
                    href="https://gatorinnovation.com/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Access Admin Dashboard
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Thank you for using our project planning tool!</p>
        </div>
      </div>
    </div>
  );
}

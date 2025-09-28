'use client'

import { useState } from "react";
import { InteractiveForm } from "@/app/components/InteractiveForm";
import { ChatbotPage } from "@/app/components/ChatbotPage";
import { ReviewEditPage } from "@/app/components/ReviewEditPage";
import { ChatCompletion } from "@/app/components/ChatCompletion";
import { StatusPage } from "@/app/components/StatusPage";
import { AdminDashboard } from "@/app/components/AdminDashboard";

type Screen = "landing" | "form" | "chatbot" | "review" | "completion" | "status" | "admin";

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("form");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  
  const handleFormComplete = (data: FormData) => {
    setFormData(data);
    setCurrentScreen("chatbot");
  };

  const handleChatFinish = () => {
    setCurrentScreen("review");
  };

  const handleReviewSave = (data: FormData) => {
    setFormData(data);
    setCurrentScreen("completion");
  };

  const handleReviewBack = () => {
    setCurrentScreen("chatbot");
  };

  const handleCompletionFinish = () => {
    setCurrentScreen("status");
  };

  const handleDownloadBrief = () => {
    // Simulate PDF download
    alert("Brief downloaded successfully!");
  };

  const handleRequestRevisions = () => {
    // Navigate back to review for revisions
    setCurrentScreen("review");
  };

  const handleBookConsultation = () => {
    // Open calendar booking
    alert("Redirecting to calendar booking...");
  };

  const handleViewProject = (lead: any) => {
    setSelectedLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email, 
      company: lead.company,
      projectType: lead.projectType,
      budget: "Not specified",
      timeline: "Not specified",
      description: "Project details from chat session"
    });
    setCurrentScreen("status");
  };

  // Render different screens based on current state
  if (currentScreen === "form") {
    return (
      <InteractiveForm
        onComplete={handleFormComplete}
        onBack={() => {}} // No landing page to go back to
      />
    );
  }

  if (currentScreen === "chatbot" && formData) {
    return (
      <ChatbotPage
        formData={formData}
        onFinishSession={handleChatFinish}
      />
    );
  }

  if (currentScreen === "review" && formData) {
    return (
      <ReviewEditPage
        formData={formData}
        onSave={handleReviewSave}
        onBack={handleReviewBack}
      />
    );
  }

  if (currentScreen === "completion" && formData) {
    return (
      <ChatCompletion
        userName={formData.name}
        onComplete={handleCompletionFinish}
      />
    );
  }

  if (currentScreen === "status" && formData) {
    return (
      <StatusPage
        projectData={{
          name: formData.name,
          email: formData.email,
          company: formData.company,
          projectType: formData.projectType
        }}
        onDownloadBrief={handleDownloadBrief}
        onRequestRevisions={handleRequestRevisions}
        onBookConsultation={handleBookConsultation}
        onBackToAdmin={() => setCurrentScreen("admin")}
      />
    );
  }

  if (currentScreen === "admin") {
    return (
      <AdminDashboard
        onViewProject={handleViewProject}
      />
    );
  }

  // Default fallback - shouldn't reach here with current flow
  return null;
}

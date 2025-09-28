'use client'

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Send, Bot, User, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { GoogleSheetsService } from "@/lib/googleSheets";
import ProjectBrief from "./ProjectBrief";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
}

interface ConversationData {
  targetAudience?: string;
  coreFeatures?: string[];
  designPreferences?: string;
  platformRequirements?: string[];
  integrations?: string[];
  contentStatus?: string;
  successMetrics?: string;
  technicalRequirements?: string;
  userFlow?: string;
  competitorInfo?: string;
}

interface ChatbotPageProps {
  formData: FormData;
  onFinishSession: () => void;
}

export function ChatbotPage({ formData, onFinishSession }: ChatbotPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hi ${formData.name}! I'm here to help clarify details about your ${formData.projectType} project. I've reviewed your initial submission and have some targeted questions to ensure we create the perfect brief for your development team.`,
      sender: "bot",
      timestamp: new Date()
    },
    {
      id: "2", 
      text: "Let's start with your target audience. Who will be the primary users of this application? Please describe their demographics, technical skill level, and main goals.",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationData, setConversationData] = useState<ConversationData>({});
  const [currentTopic, setCurrentTopic] = useState("targetAudience");
  const [collectedData, setCollectedData] = useState<string[]>([]);
  const [showProjectBrief, setShowProjectBrief] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const topics = [
    { key: "targetAudience", label: "Target Audience", completed: false },
    { key: "coreFeatures", label: "Core Features", completed: false },
    { key: "designPreferences", label: "Design & UX", completed: false },
    { key: "platformRequirements", label: "Platform & Tech", completed: false },
    { key: "successMetrics", label: "Success Goals", completed: false }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Intelligent text parsing functions
  const parseFeatures = (text: string): string[] => {
    const featureKeywords = text.toLowerCase().match(/(?:feature|function|capability|need|want|require|include)[s]?\s*(?::|like|such as)?\s*([^.!?]+)/g);
    if (!featureKeywords) return [];
    
    return featureKeywords.map(match => 
      match.replace(/(?:feature|function|capability|need|want|require|include)[s]?\s*(?::|like|such as)?\s*/i, '').trim()
    ).filter(f => f.length > 0);
  };

  const parsePlatforms = (text: string): string[] => {
    const platforms = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('mobile') || lowerText.includes('phone') || lowerText.includes('ios') || lowerText.includes('android')) {
      platforms.push('Mobile');
    }
    if (lowerText.includes('desktop') || lowerText.includes('computer') || lowerText.includes('laptop')) {
      platforms.push('Desktop');
    }
    if (lowerText.includes('tablet') || lowerText.includes('ipad')) {
      platforms.push('Tablet');
    }
    if (lowerText.includes('web') || lowerText.includes('browser')) {
      platforms.push('Web Browser');
    }
    if (lowerText.includes('responsive') || lowerText.includes('all devices')) {
      platforms.push('Responsive (All Devices)');
    }
    
    return platforms;
  };

  const parseIntegrations = (text: string): string[] => {
    const integrations = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('payment') || lowerText.includes('stripe') || lowerText.includes('paypal')) {
      integrations.push('Payment Processing');
    }
    if (lowerText.includes('analytics') || lowerText.includes('google analytics') || lowerText.includes('tracking')) {
      integrations.push('Analytics');
    }
    if (lowerText.includes('social') || lowerText.includes('facebook') || lowerText.includes('twitter') || lowerText.includes('instagram')) {
      integrations.push('Social Media');
    }
    if (lowerText.includes('email') || lowerText.includes('mailchimp') || lowerText.includes('newsletter')) {
      integrations.push('Email Marketing');
    }
    if (lowerText.includes('api') || lowerText.includes('third party') || lowerText.includes('integration')) {
      integrations.push('Third-party APIs');
    }
    if (lowerText.includes('crm') || lowerText.includes('salesforce') || lowerText.includes('hubspot')) {
      integrations.push('CRM Systems');
    }
    
    return integrations;
  };

  const getBudgetBasedRecommendations = (budget: string, projectType: string): string => {
    const isHighBudget = budget.includes('$50,000') || budget.includes('$100,000') || budget.includes('Over');
    const isMidBudget = budget.includes('$15,000') || budget.includes('$50,000');
    
    if (projectType.toLowerCase().includes('mobile')) {
      if (isHighBudget) return "With your budget, we can recommend native iOS/Android development for optimal performance and user experience.";
      if (isMidBudget) return "React Native or Flutter would be great options for cross-platform development within your budget.";
      return "A progressive web app (PWA) might be the most cost-effective solution for mobile users.";
    }
    
    if (projectType.toLowerCase().includes('e-commerce')) {
      if (isHighBudget) return "We can build a custom e-commerce solution with advanced features and integrations.";
      if (isMidBudget) return "A customized Shopify or WooCommerce solution would work well within your budget.";
      return "A template-based e-commerce solution with customizations would be most budget-friendly.";
    }
    
    return "";
  };

  const getPersonalizedResponse = (userMessage: string, topic: string): { response: string; nextTopic?: string; data?: any } => {
    const lowerMessage = userMessage.toLowerCase();
    
    switch (topic) {
      case "targetAudience":
        const audienceData = userMessage;
        setConversationData(prev => ({ ...prev, targetAudience: audienceData }));
        
        if (lowerMessage.includes('business') || lowerMessage.includes('professional') || lowerMessage.includes('enterprise')) {
          return {
            response: "Great! Since you're targeting business users, we'll focus on professional UI/UX and robust functionality. Now, what are the core features that are absolutely essential for your MVP? Please list the 3-5 most important features your users need.",
            nextTopic: "coreFeatures",
            data: { targetAudience: audienceData }
          };
        } else if (lowerMessage.includes('consumer') || lowerMessage.includes('general public') || lowerMessage.includes('everyday')) {
          return {
            response: "Perfect! For consumer-facing applications, we'll prioritize intuitive design and smooth user experience. What are the core features that are absolutely essential for your MVP? Please list the 3-5 most important features users need.",
            nextTopic: "coreFeatures",
            data: { targetAudience: audienceData }
          };
        } else {
          return {
            response: "Thanks for that insight! Understanding your audience helps us design the right experience. Now, let's talk about functionality - what are the core features that are absolutely essential for your MVP? Please list the 3-5 most important features.",
            nextTopic: "coreFeatures",
            data: { targetAudience: audienceData }
          };
        }

      case "coreFeatures":
        const features = parseFeatures(userMessage);
        const allFeatures = features.length > 0 ? features : [userMessage];
        setConversationData(prev => ({ ...prev, coreFeatures: allFeatures }));
        
        if (allFeatures.some(f => f.toLowerCase().includes('user') || f.toLowerCase().includes('account') || f.toLowerCase().includes('login'))) {
          return {
            response: "Excellent! I see user accounts are important. For design and user experience, do you have existing brand guidelines, or do you prefer a specific style? (e.g., modern/minimalist, colorful/vibrant, professional/corporate, etc.)",
            nextTopic: "designPreferences",
            data: { coreFeatures: allFeatures }
          };
        } else {
          return {
            response: "Great feature list! This gives me a clear picture of your app's functionality. Now for design and user experience - do you have existing brand guidelines, or do you prefer a specific style? (e.g., modern/minimalist, colorful/vibrant, professional/corporate, etc.)",
            nextTopic: "designPreferences",
            data: { coreFeatures: allFeatures }
          };
        }

      case "designPreferences":
        const designData = userMessage;
        setConversationData(prev => ({ ...prev, designPreferences: designData }));
        
        const budgetRecommendation = getBudgetBasedRecommendations(formData.budget, formData.projectType);
        const platforms = parsePlatforms(userMessage);
        
        return {
          response: `Perfect! ${budgetRecommendation} What devices and platforms should this work on? Please specify: Desktop, Mobile (iOS/Android), Tablet, or should it be fully responsive across all devices?`,
          nextTopic: "platformRequirements",
          data: { designPreferences: designData }
        };

      case "platformRequirements":
        const platformData = parsePlatforms(userMessage);
        const integrationData = parseIntegrations(userMessage);
        setConversationData(prev => ({ 
          ...prev, 
          platformRequirements: platformData.length > 0 ? platformData : [userMessage],
          integrations: integrationData
        }));
        
        if (integrationData.length > 0) {
          return {
            response: `Great! I noticed you mentioned some integrations. Finally, how will you measure success for this project? What are your key performance indicators or goals? (e.g., user engagement, conversion rates, daily active users, revenue targets)`,
            nextTopic: "successMetrics",
            data: { 
              platformRequirements: platformData.length > 0 ? platformData : [userMessage],
              integrations: integrationData
            }
          };
        } else {
          return {
            response: "Perfect! Understanding platform requirements helps us choose the right technology stack. Finally, how will you measure success for this project? What are your key performance indicators or goals? (e.g., user engagement, conversion rates, daily active users, revenue targets)",
            nextTopic: "successMetrics",
            data: { 
              platformRequirements: platformData.length > 0 ? platformData : [userMessage]
            }
          };
        }

      case "successMetrics":
        const metricsData = userMessage;
        setConversationData(prev => ({ ...prev, successMetrics: metricsData }));
        
        return {
          response: "Excellent! I now have all the information needed to create a comprehensive project brief. This includes your target audience insights, core feature requirements, design preferences, platform specifications, and success metrics. You'll be able to review and edit everything before we finalize your brief.",
          data: { successMetrics: metricsData }
        };

      default:
        return {
          response: "Thank you for that information. Let me process these details for your project brief.",
          data: {}
        };
    }
  };

  const simulateBotResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(async () => {
      const { response, nextTopic, data } = getPersonalizedResponse(userMessage, currentTopic);
      
      // Update collected data
      if (data) {
        setCollectedData(prev => [...prev, currentTopic]);
      }
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: response,
          sender: "bot",
          timestamp: new Date()
        }
      ]);
      
      if (nextTopic) {
        setCurrentTopic(nextTopic);
      } else {
        // Conversation is complete - log project data
        await logProjectData();
        setTimeout(() => {
          setShowProjectBrief(true);
        }, 2000);
      }
      
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // Variable response time for more natural feel
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulate bot response
    simulateBotResponse(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCompletedTopicsCount = () => {
    return collectedData.length;
  };

  const logProjectData = async () => {
    try {
      const clientId = GoogleSheetsService.generateClientId();
      const projectData = {
        clientId,
        projectName: `${formData.company} - ${formData.projectType}`,
        projectType: formData.projectType,
        targetAudience: conversationData.targetAudience || 'Not specified',
        coreFeatures: conversationData.coreFeatures || [],
        designPreferences: conversationData.designPreferences || 'Not specified',
        platformRequirements: conversationData.platformRequirements || [],
        integrations: conversationData.integrations || [],
        successMetrics: conversationData.successMetrics || 'Not specified',
        technicalRequirements: conversationData.technicalRequirements || 'Not specified',
        userFlow: conversationData.userFlow || 'Not specified',
        competitorInfo: conversationData.competitorInfo || 'Not specified',
        budget: formData.budget,
        timeline: formData.timeline,
        status: 'In Progress',
        briefGenerated: false
      };

      const success = await GoogleSheetsService.logProjectData(projectData);
      if (success) {
        console.log('Project data logged successfully to Google Sheets');
      } else {
        console.warn('Failed to log project data to Google Sheets');
      }
    } catch (error) {
      console.error('Error logging project data:', error);
    }
  };

  // Show ProjectBrief component when all topics are completed
  if (showProjectBrief) {
    const projectBriefData = {
      targetAudience: conversationData.targetAudience || 'Not specified',
      coreFeatures: Array.isArray(conversationData.coreFeatures) 
        ? conversationData.coreFeatures.join(', ') 
        : conversationData.coreFeatures || 'Not specified',
      designUX: conversationData.designPreferences || 'Not specified',
      platformTech: Array.isArray(conversationData.platformRequirements)
        ? conversationData.platformRequirements.join(', ')
        : conversationData.platformRequirements || 'Not specified',
      successGoals: conversationData.successMetrics || 'Not specified'
    };

    return <ProjectBrief data={projectBriefData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-10 h-10 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg text-gray-900">Gator Innovation AI</h1>
              <p className="text-sm text-gray-500">
                Powered by OpenGig - Clarifying {formData.projectType} details for {formData.company}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <Badge variant="outline">
                {getCompletedTopicsCount()}/5 topics
              </Badge>
            </div>
            {getCompletedTopicsCount() >= 3 && (
              <Button
                onClick={async () => {
                  await logProjectData();
                  onFinishSession();
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Finish Session
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Topics */}
      <div className="bg-white border-b border-gray-100 p-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3 overflow-x-auto">
            {topics.map((topic, index) => (
              <div key={topic.key} className="flex items-center space-x-2 flex-shrink-0">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                  collectedData.includes(topic.key) 
                    ? 'bg-green-100 text-green-800' 
                    : currentTopic === topic.key
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {collectedData.includes(topic.key) ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : currentTopic === topic.key ? (
                    <AlertCircle className="h-3 w-3" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border border-current" />
                  )}
                  <span>{topic.label}</span>
                </div>
                {index < topics.length - 1 && (
                  <div className="w-4 h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start space-x-3 max-w-2xl ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user" 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                    : "bg-gradient-to-r from-blue-100 to-purple-100"
                }`}>
                  {message.sender === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <Card className={`px-4 py-3 ${
                  message.sender === "user" 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                    : "bg-white"
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === "user" ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </Card>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-2xl">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-8 h-8 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <Card className="px-4 py-3 bg-white">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Tell me about ${currentTopic === 'targetAudience' ? 'your target audience' : 
                currentTopic === 'coreFeatures' ? 'the core features you need' :
                currentTopic === 'designPreferences' ? 'your design preferences' :
                currentTopic === 'platformRequirements' ? 'platform requirements' :
                currentTopic === 'successMetrics' ? 'how you\'ll measure success' : 'your project'}...`}
              className="flex-1 h-12"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 px-6"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Press Enter to send • The more details you provide, the better your project brief will be
          </div>
        </div>
      </div>
    </div>
  );
}
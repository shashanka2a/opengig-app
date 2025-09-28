'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Search, Filter, Eye, Download, MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  status: "New" | "In Chat" | "Completed" | "Brief Ready";
  submittedDate: string;
  briefLink?: string;
}

interface AdminDashboardProps {
  onViewProject: (lead: Lead) => void;
}

export function AdminDashboard({ onViewProject }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data
  const [leads] = useState<Lead[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@acme.com",
      company: "Acme Inc.",
      projectType: "Web Application",
      status: "Brief Ready",
      submittedDate: "2025-01-15",
      briefLink: "/briefs/john-doe-acme.pdf"
    },
    {
      id: "2", 
      name: "Sarah Wilson",
      email: "sarah@techstart.io",
      company: "TechStart",
      projectType: "Mobile App",
      status: "In Chat",
      submittedDate: "2025-01-14"
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@designco.com", 
      company: "DesignCo",
      projectType: "E-commerce Site",
      status: "Completed",
      submittedDate: "2025-01-13"
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      email: "emily@startup.com",
      company: "InnovateLab",
      projectType: "Landing Page", 
      status: "New",
      submittedDate: "2025-01-16"
    },
    {
      id: "5",
      name: "David Park",
      email: "david@enterprise.com",
      company: "Enterprise Solutions",
      projectType: "Custom Software",
      status: "Brief Ready",
      submittedDate: "2025-01-12",
      briefLink: "/briefs/david-park-enterprise.pdf"
    }
  ]);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "In Chat": return "bg-yellow-100 text-yellow-800"; 
      case "Completed": return "bg-purple-100 text-purple-800";
      case "Brief Ready": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const statusCounts = {
    total: leads.length,
    new: leads.filter(l => l.status === "New").length,
    inChat: leads.filter(l => l.status === "In Chat").length,
    completed: leads.filter(l => l.status === "Completed").length,
    briefReady: leads.filter(l => l.status === "Brief Ready").length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">OpenGig Admin Dashboard</h1>
          <p className="text-gray-600">Manage client onboarding and project briefs</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 text-center">
            <p className="text-2xl text-gray-900 mb-1">{statusCounts.total}</p>
            <p className="text-sm text-gray-500">Total Leads</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl text-blue-600 mb-1">{statusCounts.new}</p>
            <p className="text-sm text-gray-500">New</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl text-yellow-600 mb-1">{statusCounts.inChat}</p>
            <p className="text-sm text-gray-500">In Chat</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl text-purple-600 mb-1">{statusCounts.completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl text-green-600 mb-1">{statusCounts.briefReady}</p>
            <p className="text-sm text-gray-500">Brief Ready</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Chat">In Chat</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Brief Ready">Brief Ready</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="px-3">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Leads Table */}
        <Card className="shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Client</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Project Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>
                    <div>
                      <p className="text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-900">{lead.company}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.projectType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-gray-600">
                      {new Date(lead.submittedDate).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewProject(lead)}
                        className="h-8 px-3"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {lead.briefLink && (
                        <Button
                          size="sm"
                          className="h-8 px-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Brief
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-8 px-2">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No leads found matching your criteria.</p>
            </div>
          )}
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Showing {filteredLeads.length} of {leads.length} leads</p>
        </div>
      </div>
    </div>
  );
}
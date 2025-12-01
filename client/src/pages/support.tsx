import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Support() {
  const [, navigate] = useLocation();
  const { isLoading, isAuthenticated } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ticketsData } = useQuery({
    queryKey: ['/api/support/tickets'],
    enabled: isAuthenticated && !isLoading,
  });

  const { data: messagesData } = useQuery({
    queryKey: [`/api/support/tickets/${selectedTicketId}/messages`],
    enabled: !!selectedTicketId,
  });

  const createTicket = useMutation({
    mutationFn: async ({ type, subject, description }: { type: string; subject: string; description: string }) => {
      const response = await apiRequest('POST', '/api/support/tickets', {
        type,
        subject,
        description
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/support/tickets'] });
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive",
      });
    },
  });

  const sendMessage = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      const response = await apiRequest('POST', `/api/support/tickets/${ticketId}/messages`, {
        message
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/support/tickets/${selectedTicketId}/messages`] });
      setMessageText('');
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleQuickAction = (action: string) => {
    const subjects = {
      'order': 'Order Issues',
      'payment': 'Payment Help',
      'refund': 'Refund Status',
      'feedback': 'App Feedback'
    };

    // Create a mock ticket for demonstration
    const mockTicket = {
      id: `TICKET_${Date.now()}`,
      type: action,
      subject: subjects[action as keyof typeof subjects] || 'General Query',
      description: `I need help with ${action}`,
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    // Store in localStorage for demo
    const existingTickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    existingTickets.push(mockTicket);
    localStorage.setItem('supportTickets', JSON.stringify(existingTickets));

    toast({
      title: "Support Ticket Created",
      description: `Your ${subjects[action as keyof typeof subjects]} ticket has been created`,
    });

    // Try the real API call
    createTicket.mutate({
      type: action,
      subject: subjects[action as keyof typeof subjects] || 'General Query',
      description: `I need help with ${action}`
    });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedTicketId) return;
    
    sendMessage.mutate({
      ticketId: selectedTicketId,
      message: messageText.trim()
    });
  };

  if (isLoading) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MobileContainer>
    );
  }

  // Mock chat messages for demo
  const mockMessages = [
    {
      id: '1',
      message: 'Hello! How can I help you today?',
      senderType: 'agent',
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      message: 'I need help with my order #ORD123',
      senderType: 'user',
      createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      message: 'I can see your order is out for delivery. It should reach you by 4:30 PM today. Is there anything specific you\'d like to know?',
      senderType: 'agent',
      createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      message: 'Can I get the delivery partner\'s contact?',
      senderType: 'user',
      createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      message: 'Sure! Your delivery partner is Rajesh Kumar. You can call him at +91-9876543210',
      senderType: 'agent',
      createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
    }
  ];

  return (
    <MobileContainer>
      <Header 
        title="Customer Support" 
        subtitle="We're here to help"
        showBack={true}
        onBack={() => navigate('/')}
      />

      <div className="p-4 pb-32">
        {/* Chat Header */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <i className="fas fa-headset text-white"></i>
              </div>
              <div>
                <p className="font-medium text-gray-800">Support Team</p>
                <p className="text-sm text-green-500">● Online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="h-64 overflow-y-auto space-y-3" data-testid="chat-messages">
              {mockMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`chat-bubble ${message.senderType === 'user' ? 'sent' : 'received'}`}
                  data-testid={`message-${message.id}`}
                >
                  {message.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleQuickAction('order')}
              className="p-3 text-sm text-gray-700 hover:bg-gray-50"
              data-testid="button-order-issues"
            >
              Order Issues
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAction('payment')}
              className="p-3 text-sm text-gray-700 hover:bg-gray-50"
              data-testid="button-payment-help"
            >
              Payment Help
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAction('refund')}
              className="p-3 text-sm text-gray-700 hover:bg-gray-50"
              data-testid="button-refund-status"
            >
              Refund Status
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickAction('feedback')}
              className="p-3 text-sm text-gray-700 hover:bg-gray-50"
              data-testid="button-app-feedback"
            >
              App Feedback
            </Button>
          </div>
        </div>

        {/* Support Tickets */}
        {ticketsData?.tickets && ticketsData.tickets.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Your Support Tickets</h3>
              <div className="space-y-2">
                {ticketsData.tickets.slice(0, 3).map((ticket: any) => (
                  <div 
                    key={ticket.id} 
                    className="flex items-center justify-between p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedTicketId(ticket.id)}
                    data-testid={`ticket-${ticket.id}`}
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-800">{ticket.subject}</p>
                      <p className="text-xs text-gray-500">{ticket.status}</p>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400"></i>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Message Input */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <Input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border-0"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            data-testid="input-message"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="fuel-yellow fuel-yellow-hover text-white px-4 py-2 rounded-lg"
            data-testid="button-send-message"
          >
            <i className="fas fa-paper-plane"></i>
          </Button>
        </div>
      </div>

      <BottomNav activeTab="orders" />
    </MobileContainer>
  );
}


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useCreateIssue() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      orderId, 
      issueCategory, 
      issueSubCategory, 
      description, 
      orderDetails,
      bppId,
      bppUri 
    }: {
      orderId: string;
      issueCategory: string;
      issueSubCategory: string;
      description: string;
      orderDetails: any;
      bppId: string;
      bppUri: string;
    }) => {
      const response = await apiRequest('POST', '/api/issues', {
        orderId,
        issueCategory,
        issueSubCategory,
        description,
        orderDetails,
        bppId,
        bppUri
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/issues'] });
      toast({
        title: "Issue Created",
        description: "Your complaint has been registered successfully",
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
        description: "Failed to create issue",
        variant: "destructive",
      });
    },
  });
}

export function useUserIssues() {
  return useQuery({
    queryKey: ['/api/issues'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/issues');
      return response.json();
    },
  });
}

export function useIssueStatus(issueId: string) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('GET', `/api/issues/${issueId}/status`);
      return response.json();
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
        description: "Failed to fetch issue status",
        variant: "destructive",
      });
    },
  });
}

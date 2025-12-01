import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useOndcSearch() {
  return useMutation({
    mutationFn: async ({ query, category, location }: {
      query?: string;
      category?: string;
      location?: string;
    }) => {
      return await apiRequest('GET', `/api/products/search?q=${query || ''}&category=${category || ''}&location=${location || ''}`);
    },
  });
}

export function useOndcSelect() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ providerId, items, bppId, bppUri }: {
      providerId: string;
      items: any[];
      bppId: string;
      bppUri: string;
    }) => {
      const response = await apiRequest('POST', '/api/orders/select', {
        providerId,
        items,
        bppId,
        bppUri
      });
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
        description: "Failed to select items",
        variant: "destructive",
      });
    },
  });
}

export function useOndcInit() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ providerId, items, billing, fulfillment, bppId, bppUri }: {
      providerId: string;
      items: any[];
      billing: any;
      fulfillment: any;
      bppId: string;
      bppUri: string;
    }) => {
      const response = await apiRequest('POST', '/api/orders/init', {
        providerId,
        items,
        billing,
        fulfillment,
        bppId,
        bppUri
      });
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
        description: "Failed to initialize order",
        variant: "destructive",
      });
    },
  });
}

export function useOndcConfirm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ providerId, items, billing, fulfillment, payment, bppId, bppUri, providerName, totalAmount, quote }: {
      providerId: string;
      items: any[];
      billing: any;
      fulfillment: any;
      payment: any;
      bppId: string;
      bppUri: string;
      providerName: string;
      totalAmount: string;
      quote: any;
    }) => {
      const response = await apiRequest('POST', '/api/orders/confirm', {
        providerId,
        items,
        billing,
        fulfillment,
        payment,
        bppId,
        bppUri,
        providerName,
        totalAmount,
        quote
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order Confirmed",
        description: "Your order has been placed successfully",
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
        description: "Failed to place order",
        variant: "destructive",
      });
    },
  });
}

export function useOndcStatus(orderId: string) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/orders/${orderId}/status`);
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
        description: "Failed to get order status",
        variant: "destructive",
      });
    },
  });
}

export function useOndcTrack(orderId: string) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/orders/${orderId}/track`);
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
        description: "Failed to track order",
        variant: "destructive",
      });
    },
  });
}

export function useOndcCancel(orderId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      const response = await apiRequest('POST', `/api/orders/${orderId}/cancel`, { reason });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully",
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
        description: "Failed to cancel order",
        variant: "destructive",
      });
    },
  });
}

export function useOndcUpdate(orderId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ updateTarget, fulfillment }: {
      updateTarget: string;
      fulfillment: any;
    }) => {
      const response = await apiRequest('POST', `/api/orders/${orderId}/update`, {
        updateTarget,
        fulfillment
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order Updated",
        description: "Your order has been updated successfully",
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
        description: "Failed to update order",
        variant: "destructive",
      });
    },
  });
}

export function useOndcRating() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orderId, productId, overallRating, productRating, deliveryRating, reviewText, providerId }: {
      orderId: string;
      productId?: string;
      overallRating: number;
      productRating?: number;
      deliveryRating?: number;
      reviewText?: string;
      providerId: string;
    }) => {
      const payload = {
        orderId,
        overallRating,
        providerId,
        ...(productId && { productId }),
        ...(productRating && { productRating }),
        ...(deliveryRating && { deliveryRating }),
        ...(reviewText && { reviewText })
      };

      const response = await apiRequest('POST', '/api/reviews', payload);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to submit rating' }));
        throw new Error(errorData.message || 'Failed to submit rating');
      }

      return response.json();
    },
    onSuccess: () => {
      // Don't show toast here as it's handled in the component
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
      // Error handling is done in the component
      console.error('Rating submission error:', error);
    },
  });
}
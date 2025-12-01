import fetch from 'node-fetch';
import { ondcProtocol, type OndcRequest } from './protocol';
import { ondcAuth } from './auth';
import { storage } from '../storage';

export interface SearchIntent {
  item?: {
    descriptor?: {
      name?: string;
    };
  };
  category?: {
    id?: string;
  };
  provider?: {
    id?: string;
  };
}

export interface Location {
  gps?: string;
  area_code?: string;
}

export class OndcEndpoints {
  private gatewayUrl: string;
  private environment: string;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.gatewayUrl = this.environment === 'production' 
      ? 'https://prod.gateway.proteantech.in' 
      : 'https://staging.gateway.proteantech.in';
  }

  private async makeOndcRequest(endpoint: string, request: OndcRequest): Promise<any> {
    const payload = JSON.stringify(request);
    const headers = ondcAuth.createAuthHeaders(payload);

    // Store transaction for tracking
    await storage.createOndcTransaction({
      transactionId: request.context.transaction_id,
      messageId: request.context.message_id,
      action: request.context.action,
      bapId: request.context.bap_id,
      bapUri: request.context.bap_uri,
      bppId: request.context.bpp_id,
      bppUri: request.context.bpp_uri,
      domain: request.context.domain,
      context: request.context,
      message: request.message || null,
      status: 'pending'
    });

    try {
      const response = await fetch(`${this.gatewayUrl}/${endpoint}`, {
        method: 'POST',
        headers: headers as any,
        body: payload
      });

      const result = await response.json();

      // Update transaction with response
      await storage.updateOndcTransaction(request.context.transaction_id, {
        response: result,
        status: response.ok ? 'completed' : 'failed'
      });

      return result;

    } catch (error) {
      console.error(`ONDC ${endpoint} request failed:`, error);
      
      // Update transaction with error
      await storage.updateOndcTransaction(request.context.transaction_id, {
        response: { error: (error as Error).message },
        status: 'failed'
      });

      throw error;
    }
  }

  async search(intent: SearchIntent, location: Location): Promise<any> {
    const request = ondcProtocol.createSearchRequest(intent, location);
    return await this.makeOndcRequest('search', request);
  }

  async select(providerId: string, items: any[], bppId: string, bppUri: string): Promise<any> {
    const request = ondcProtocol.createSelectRequest(providerId, items, bppId, bppUri);
    return await this.makeOndcRequest('select', request);
  }

  async init(providerId: string, items: any[], billing: any, fulfillment: any, bppId: string, bppUri: string): Promise<any> {
    const request = ondcProtocol.createInitRequest(providerId, items, billing, fulfillment, bppId, bppUri);
    return await this.makeOndcRequest('init', request);
  }

  async confirm(orderId: string, providerId: string, items: any[], billing: any, fulfillment: any, payment: any, bppId: string, bppUri: string): Promise<any> {
    const request = ondcProtocol.createConfirmRequest(orderId, providerId, items, billing, fulfillment, payment, bppId, bppUri);
    return await this.makeOndcRequest('confirm', request);
  }

  async status(orderId: string, bppId: string, bppUri: string): Promise<any> {
    const request = ondcProtocol.createStatusRequest(orderId, bppId, bppUri);
    return await this.makeOndcRequest('status', request);
  }

  async track(orderId: string, bppId: string, bppUri: string): Promise<any> {
    const request = ondcProtocol.createTrackRequest(orderId, bppId, bppUri);
    return await this.makeOndcRequest('track', request);
  }

  async cancel(orderId: string, cancellationReasonId: string, bppId: string, bppUri: string): Promise<any> {
    const request = ondcProtocol.createCancelRequest(orderId, cancellationReasonId, bppId, bppUri);
    return await this.makeOndcRequest('cancel', request);
  }

  async update(orderId: string, updateTarget: string, fulfillment: any, bppId: string, bppUri: string): Promise<any> {
    const request = ondcProtocol.createUpdateRequest(orderId, updateTarget, fulfillment, bppId, bppUri);
    return await this.makeOndcRequest('update', request);
  }

  async support(refId: string, bppId?: string, bppUri?: string): Promise<any> {
    const request = ondcProtocol.createSupportRequest(refId, bppId, bppUri);
    return await this.makeOndcRequest('support', request);
  }

  async rating(ratingValue: number, ratingCategory: string, ratingId: string, bppId?: string, bppUri?: string): Promise<any> {
    const request = ondcProtocol.createRatingRequest(ratingValue, ratingCategory, ratingId, bppId, bppUri);
    return await this.makeOndcRequest('rating', request);
  }

  async issue(issueData: {
    orderId: string;
    issueCategory: string;
    issueSubCategory: string;
    description: string;
    complainantInfo: any;
    orderDetails: any;
  }, bppId: string, bppUri: string): Promise<any> {
    const request = ondcProtocol.createIssueRequest(issueData, bppId, bppUri);
    return await this.makeOndcRequest('issue', request);
  }

  async issueStatus(issueId: string, bppId: string, bppUri: string): Promise<any> {
    const request = ondcProtocol.createIssueStatusRequest(issueId, bppId, bppUri);
    return await this.makeOndcRequest('issue_status', request);
  }
}

export const ondcEndpoints = new OndcEndpoints();

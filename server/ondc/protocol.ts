import crypto from 'crypto';
import { nanoid } from 'nanoid';

export interface OndcContext {
  domain: string;
  country: string;
  city: string;
  action: string;
  core_version: string;
  bap_id: string;
  bap_uri: string;
  bpp_id?: string;
  bpp_uri?: string;
  transaction_id: string;
  message_id: string;
  timestamp: string;
  key: string;
  ttl: string;
}

export interface OndcMessage {
  [key: string]: any;
}

export interface OndcRequest {
  context: OndcContext;
  message?: OndcMessage;
}

export class OndcProtocol {
  private bapId: string;
  private bapUri: string;
  private privateKey: string;
  private publicKey: string;

  constructor() {
    this.bapId = process.env.ONDC_BAP_ID || 'cartcircle-bap.ondc.org';
    this.bapUri = process.env.ONDC_BAP_URI || 'https://cartcircle.ondc.org/';
    this.privateKey = process.env.ONDC_PRIVATE_KEY || this.generateKeyPair().privateKey;
    this.publicKey = process.env.ONDC_PUBLIC_KEY || this.generateKeyPair().publicKey;
  }

  private generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    return { publicKey, privateKey };
  }

  createContext(action: string, domain: string = 'ONDC:RET10', city: string = 'std:080', bppId?: string, bppUri?: string): OndcContext {
    const transactionId = nanoid();
    const messageId = nanoid();
    const timestamp = new Date().toISOString();

    return {
      domain,
      country: 'IND',
      city,
      action,
      core_version: '1.2.0',
      bap_id: this.bapId,
      bap_uri: this.bapUri,
      bpp_id: bppId,
      bpp_uri: bppUri,
      transaction_id: transactionId,
      message_id: messageId,
      timestamp,
      key: this.publicKey,
      ttl: 'PT30S'
    };
  }

  signRequest(request: OndcRequest): string {
    const payload = JSON.stringify(request);
    const sign = crypto.createSign('Ed25519');
    sign.update(payload);
    return sign.sign(this.privateKey, 'base64');
  }

  verifySignature(payload: string, signature: string, publicKey: string): boolean {
    try {
      const verify = crypto.createVerify('Ed25519');
      verify.update(payload);
      return verify.verify(publicKey, signature, 'base64');
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  createAuthHeader(signature: string): string {
    return `Signature keyId="${this.bapId}|${this.publicKey}|ed25519",algorithm="ed25519",created="${Math.floor(Date.now() / 1000)}",expires="${Math.floor(Date.now() / 1000) + 300}",headers="(created) (expires) digest",signature="${signature}"`;
  }

  createDigest(payload: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(payload);
    return `BLAKE-512=${hash.digest('base64')}`;
  }

  // Search request
  createSearchRequest(intent: any, location: { gps?: string; area_code?: string }): OndcRequest {
    const context = this.createContext('search');
    
    return {
      context,
      message: {
        intent: {
          ...intent,
          fulfillment: {
            end: {
              location
            }
          }
        }
      }
    };
  }

  // Select request
  createSelectRequest(providerId: string, items: any[], bppId: string, bppUri: string): OndcRequest {
    const context = this.createContext('select', 'ONDC:RET10', 'std:080', bppId, bppUri);
    
    return {
      context,
      message: {
        order: {
          provider: {
            id: providerId
          },
          items: items.map(item => ({
            id: item.id,
            quantity: {
              count: item.quantity
            }
          }))
        }
      }
    };
  }

  // Init request
  createInitRequest(providerId: string, items: any[], billing: any, fulfillment: any, bppId: string, bppUri: string): OndcRequest {
    const context = this.createContext('init', 'ONDC:RET10', 'std:080', bppId, bppUri);
    
    return {
      context,
      message: {
        order: {
          provider: {
            id: providerId
          },
          items: items.map(item => ({
            id: item.id,
            quantity: {
              count: item.quantity
            }
          })),
          billing,
          fulfillment
        }
      }
    };
  }

  // Confirm request
  createConfirmRequest(orderId: string, providerId: string, items: any[], billing: any, fulfillment: any, payment: any, bppId: string, bppUri: string): OndcRequest {
    const context = this.createContext('confirm', 'ONDC:RET10', 'std:080', bppId, bppUri);
    
    return {
      context,
      message: {
        order: {
          id: orderId,
          state: 'Created',
          provider: {
            id: providerId
          },
          items: items.map(item => ({
            id: item.id,
            quantity: {
              count: item.quantity
            }
          })),
          billing,
          fulfillment,
          payment
        }
      }
    };
  }

  // Status request
  createStatusRequest(orderId: string, bppId: string, bppUri: string): OndcRequest {
    const context = this.createContext('status', 'ONDC:RET10', 'std:080', bppId, bppUri);
    
    return {
      context,
      message: {
        order_id: orderId
      }
    };
  }

  // Track request
  createTrackRequest(orderId: string, bppId: string, bppUri: string): OndcRequest {
    const context = this.createContext('track', 'ONDC:RET10', 'std:080', bppId, bppUri);
    
    return {
      context,
      message: {
        order_id: orderId
      }
    };
  }

  // Cancel request
  createCancelRequest(orderId: string, cancellationReasonId: string, bppId: string, bppUri: string): OndcRequest {
    const context = this.createContext('cancel', 'ONDC:RET10', 'std:080', bppId, bppUri);
    
    return {
      context,
      message: {
        order_id: orderId,
        cancellation_reason_id: cancellationReasonId
      }
    };
  }

  // Update request
  createUpdateRequest(orderId: string, updateTarget: string, fulfillment: any, bppId: string, bppUri: string): OndcRequest {
    const context = this.createContext('update', 'ONDC:RET10', 'std:080', bppId, bppUri);
    
    return {
      context,
      message: {
        update_target: updateTarget,
        order: {
          id: orderId,
          fulfillment
        }
      }
    };
  }

  // Support request
  createSupportRequest(refId: string, bppId?: string, bppUri?: string): OndcRequest {
    const context = this.createContext('support', 'ONDC:RET10', 'std:080', bppId, bppUri);
    
    return {
      context,
      message: {
        ref_id: refId
      }
    };
  }

  // Rating request
  createRatingRequest(ratingValue: number, ratingCategory: string, ratingId: string, bppId?: string, bppUri?: string): OndcRequest {
    const context = this.createContext('rating', 'ONDC:RET10', 'std:080', bppId, bppUri);
    
    return {
      context,
      message: {
        id: ratingId,
        rating_category: ratingCategory,
        value: ratingValue
      }
    };
  }

  // IGM: Issue request
  createIssueRequest(issueData: {
    orderId: string;
    issueCategory: string;
    issueSubCategory: string;
    description: string;
    complainantInfo: any;
    orderDetails: any;
  }, bppId: string, bppUri: string): OndcRequest {
    const context = this.createContext('issue', 'ONDC:RET10', 'std:080', bppId, bppUri);
    const issueId = nanoid();
    
    return {
      context,
      message: {
        issue: {
          id: issueId,
          category: issueData.issueCategory,
          sub_category: issueData.issueSubCategory,
          complainant_info: issueData.complainantInfo,
          order_details: issueData.orderDetails,
          description: {
            short_desc: issueData.description,
            long_desc: issueData.description
          },
          source: {
            network_participant_id: this.bapId,
            type: 'CONSUMER'
          },
          expected_response_time: {
            duration: 'PT2H'
          },
          expected_resolution_time: {
            duration: 'P1D'
          },
          status: 'OPEN',
          issue_type: 'ISSUE',
          issue_actions: {
            complainant_actions: [{
              complainant_action: 'OPEN',
              short_desc: 'Complaint created',
              updated_at: new Date().toISOString(),
              updated_by: {
                org: {
                  name: issueData.complainantInfo.person.name
                },
                contact: {
                  phone: issueData.complainantInfo.person.phone,
                  email: issueData.complainantInfo.person.email
                },
                person: {
                  name: issueData.complainantInfo.person.name
                }
              }
            }]
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    };
  }

  // IGM: Issue Status request
  createIssueStatusRequest(issueId: string, bppId: string, bppUri: string): OndcRequest {
    const context = this.createContext('issue_status', 'ONDC:RET10', 'std:080', bppId, bppUri);
    
    return {
      context,
      message: {
        issue_id: issueId
      }
    };
  }
}

export const ondcProtocol = new OndcProtocol();

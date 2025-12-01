import crypto from 'crypto';

export interface AuthHeaders {
  Authorization: string;
  'X-Gateway-Authorization': string;
  Digest: string;
  'Content-Type': string;
}

export class OndcAuth {
  private privateKey: string;
  private publicKey: string;
  private subscriberId: string;
  private uniqueKeyId: string;

  constructor() {
    this.privateKey = process.env.ONDC_PRIVATE_KEY || this.generateKeyPair().privateKey;
    this.publicKey = process.env.ONDC_PUBLIC_KEY || this.generateKeyPair().publicKey;
    this.subscriberId = process.env.ONDC_SUBSCRIBER_ID || 'cartcircle-bap.ondc.org';
    this.uniqueKeyId = process.env.ONDC_UNIQUE_KEY_ID || 'cartcircle-key-1';
  }

  private generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    return { publicKey, privateKey };
  }

  createDigest(payload: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(payload);
    return `BLAKE-512=${hash.digest('base64')}`;
  }

  createSignature(payload: string, created: number, expires: number): string {
    const signingString = `(created): ${created}\n(expires): ${expires}\ndigest: BLAKE-512=${crypto.createHash('sha256').update(payload).digest('base64')}`;
    
    const sign = crypto.createSign('Ed25519');
    sign.update(signingString);
    return sign.sign(this.privateKey, 'base64');
  }

  createAuthHeaders(payload: string): AuthHeaders {
    const created = Math.floor(Date.now() / 1000);
    const expires = created + 300; // 5 minutes expiry
    const digest = this.createDigest(payload);
    const signature = this.createSignature(payload, created, expires);

    const authHeader = `Signature keyId="${this.subscriberId}|${this.uniqueKeyId}|ed25519",algorithm="ed25519",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${signature}"`;

    // Gateway authorization for production ONDC network
    const gatewayAuthHeader = this.createGatewayAuth();

    return {
      'Authorization': authHeader,
      'X-Gateway-Authorization': gatewayAuthHeader,
      'Digest': digest,
      'Content-Type': 'application/json'
    };
  }

  private createGatewayAuth(): string {
    // This would typically be provided by ONDC registry
    // For now, using a placeholder - replace with actual gateway auth token
    return `Bearer ${process.env.ONDC_GATEWAY_TOKEN || 'gateway-auth-token'}`;
  }

  verifyIncomingSignature(headers: any, payload: string): boolean {
    try {
      const authHeader = headers['authorization'] || headers['Authorization'];
      if (!authHeader) return false;

      // Parse the authorization header
      const authMatch = authHeader.match(/Signature keyId="([^"]+)",algorithm="([^"]+)",created="([^"]+)",expires="([^"]+)",headers="([^"]+)",signature="([^"]+)"/);
      if (!authMatch) return false;

      const [, keyId, algorithm, created, expires, headersField, signature] = authMatch;
      
      // Check expiry
      const now = Math.floor(Date.now() / 1000);
      if (parseInt(expires) < now) {
        console.log('Signature expired');
        return false;
      }

      // Reconstruct signing string
      const digest = headers['digest'] || headers['Digest'];
      const signingString = `(created): ${created}\n(expires): ${expires}\ndigest: ${digest}`;

      // Extract public key from keyId (format: subscriberId|uniqueKeyId|algorithm)
      const keyParts = keyId.split('|');
      if (keyParts.length < 2) return false;

      // In production, you would fetch the public key from ONDC registry
      // For now, we'll use the stored public key
      const verify = crypto.createVerify('Ed25519');
      verify.update(signingString);
      return verify.verify(this.publicKey, signature, 'base64');

    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  getSubscriberId(): string {
    return this.subscriberId;
  }

  getUniqueKeyId(): string {
    return this.uniqueKeyId;
  }
}

export const ondcAuth = new OndcAuth();


export interface PartnerSeller {
  id: string;
  name: string;
  category: string;
  discount: number;
  minOrder: number;
  location: string;
  rating: number;
  image: string;
}

export interface CreditOption {
  id: string;
  limit: number;
  interestRate: number;
  paymentDue: string;
  currentUsed: number;
  status: 'active' | 'pending' | 'blocked';
}

export interface EventDelivery {
  id: string;
  eventType: string;
  location: string;
  date: string;
  minOrder: number;
  isFree: boolean;
  specialInstructions?: string;
}

export interface RewardTier {
  id: string;
  name: string;
  pointsRequired: number;
  benefits: string[];
  discount: number;
}

class XtraMartService {
  // Mock Partner Sellers
  getPartnerSellers(): PartnerSeller[] {
    return [
      {
        id: 'ps1',
        name: 'Fresh Veggie Hub',
        category: 'Vegetables & Fruits',
        discount: 25,
        minOrder: 1500,
        location: 'T. Nagar, Chennai',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop'
      },
      {
        id: 'ps2',
        name: 'Spice Masters',
        category: 'Masala & Spices',
        discount: 20,
        minOrder: 1000,
        location: 'Pondy Bazaar, Chennai',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821950c0fc?w=200&h=200&fit=crop'
      },
      {
        id: 'ps3',
        name: 'Organic Grains Co.',
        category: 'Rice & Grains',
        discount: 15,
        minOrder: 2000,
        location: 'Mylapore, Chennai',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=200&h=200&fit=crop'
      }
    ];
  }

  // Mock Credit Options
  getCreditOptions(): CreditOption[] {
    return [
      {
        id: 'credit1',
        limit: 10000,
        interestRate: 0,
        paymentDue: '15th of every month',
        currentUsed: 2500,
        status: 'active'
      }
    ];
  }

  // Mock Event Deliveries
  getEventDeliveries(): EventDelivery[] {
    return [
      {
        id: 'ed1',
        eventType: 'Wedding Function',
        location: 'Marriage Hall, Vadapalani',
        date: '2024-02-15',
        minOrder: 5000,
        isFree: true,
        specialInstructions: 'Delivery between 6 AM - 8 AM'
      },
      {
        id: 'ed2',
        eventType: 'Festival Celebration',
        location: 'Community Center, Anna Nagar',
        date: '2024-02-18',
        minOrder: 3000,
        isFree: true,
        specialInstructions: 'Setup assistance included'
      },
      {
        id: 'ed3',
        eventType: 'Corporate Event',
        location: 'IT Park, OMR',
        date: '2024-02-20',
        minOrder: 10000,
        isFree: true,
        specialInstructions: 'Bulk packaging required'
      }
    ];
  }

  // Mock Reward Tiers
  getRewardTiers(): RewardTier[] {
    return [
      {
        id: 'bronze',
        name: 'Bronze Member',
        pointsRequired: 0,
        benefits: ['2% cashback', 'Priority support'],
        discount: 2
      },
      {
        id: 'silver',
        name: 'Silver Member',
        pointsRequired: 1000,
        benefits: ['5% cashback', 'Free delivery', 'Early access to sales'],
        discount: 5
      },
      {
        id: 'gold',
        name: 'Gold Member',
        pointsRequired: 5000,
        benefits: ['10% cashback', 'Free delivery', 'Exclusive deals', 'Premium support'],
        discount: 10
      },
      {
        id: 'platinum',
        name: 'Platinum Member',
        pointsRequired: 10000,
        benefits: ['15% cashback', 'Free delivery', 'VIP access', '24/7 support', 'Personal shopper'],
        discount: 15
      }
    ];
  }

  // Apply for credit
  async applyCreditLimit(amount: number): Promise<{ success: boolean; message: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (amount > 50000) {
      return { success: false, message: 'Credit limit exceeds maximum allowed amount' };
    }
    
    return { success: true, message: 'Credit application submitted successfully' };
  }

  // Book event delivery
  async bookEventDelivery(eventData: Partial<EventDelivery>): Promise<{ success: boolean; message: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, message: 'Event delivery booked successfully' };
  }

  // Join rewards program
  async joinRewards(tierId: string): Promise<{ success: boolean; message: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, message: `Successfully joined ${tierId} tier!` };
  }
}

export const xtraMartService = new XtraMartService();

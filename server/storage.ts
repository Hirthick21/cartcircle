import {
  users,
  orders,
  orderItems,
  products,
  userAddresses,
  reviews,
  supportTickets,
  supportMessages,
  ondcTransactions,
  orderStatusHistory,
  type User,
  type UpsertUser,
  type Order,
  type InsertOrder,
  type Product,
  type InsertProduct,
  type UserAddress,
  type InsertUserAddress,
  type Review,
  type InsertReview,
  type SupportTicket,
  type InsertSupportTicket,
  type SupportMessage,
  type InsertSupportMessage,
  type OndcTransaction,
  type InsertOndcTransaction,
  // Import ONDC Issue types
  ondcIssues,
  type OndcIssue,
  type InsertOndcIssue,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, or, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Address operations
  getUserAddresses(userId: string): Promise<UserAddress[]>;
  createUserAddress(address: InsertUserAddress): Promise<UserAddress>;
  updateUserAddress(id: string, address: Partial<InsertUserAddress>): Promise<UserAddress | undefined>;
  setDefaultAddress(userId: string, addressId: string): Promise<void>;

  // Product operations
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string, categoryId?: string, providerId?: string, limit?: number): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string, limit?: number): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string, status?: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: string, state: string): Promise<Order | undefined>;
  getOrderWithItems(orderId: string): Promise<(Order & { items: any[] }) | undefined>;

  // Order items operations
  createOrderItem(item: any): Promise<any>;
  getOrderItems(orderId: string): Promise<any[]>;

  // Order status history
  addOrderStatusHistory(history: any): Promise<void>;
  getOrderStatusHistory(orderId: string): Promise<any[]>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getOrderReviews(orderId: string): Promise<Review[]>;
  getProductReviews(productId: string, limit?: number): Promise<Review[]>;

  // Support operations
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getSupportTicket(id: string): Promise<SupportTicket | undefined>;
  getUserSupportTickets(userId: string): Promise<SupportTicket[]>;
  updateSupportTicketStatus(id: string, status: string): Promise<SupportTicket | undefined>;
  addSupportMessage(message: InsertSupportMessage): Promise<SupportMessage>;
  getSupportMessages(ticketId: string): Promise<SupportMessage[]>;

  // ONDC transaction operations
  createOndcTransaction(transaction: InsertOndcTransaction): Promise<OndcTransaction>;
  getOndcTransaction(transactionId: string): Promise<OndcTransaction | undefined>;
  updateOndcTransaction(transactionId: string, updates: Partial<InsertOndcTransaction>): Promise<OndcTransaction | undefined>;

  // IGM operations
  createOndcIssue(issueData: InsertOndcIssue): Promise<OndcIssue>;
  getOndcIssue(issueId: string): Promise<OndcIssue | undefined>;
  getUserIssues(userId: string): Promise<OndcIssue[]>;
  getOrderIssues(orderId: string): Promise<OndcIssue[]>;
  updateOndcIssue(issueId: string, data: Partial<OndcIssue>): Promise<OndcIssue | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Address operations
  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    return await db.select().from(userAddresses).where(eq(userAddresses.userId, userId));
  }

  async createUserAddress(address: InsertUserAddress): Promise<UserAddress> {
    // If this is set as default, unset other defaults first
    if (address.isDefault) {
      await db
        .update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, address.userId));
    }

    const [newAddress] = await db.insert(userAddresses).values(address).returning();
    return newAddress;
  }

  async updateUserAddress(id: string, address: Partial<InsertUserAddress>): Promise<UserAddress | undefined> {
    const [updatedAddress] = await db
      .update(userAddresses)
      .set(address)
      .where(eq(userAddresses.id, id))
      .returning();
    return updatedAddress;
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    await db.transaction(async (tx) => {
      // Unset all defaults for this user
      await tx
        .update(userAddresses)
        .set({ isDefault: false })
        .where(eq(userAddresses.userId, userId));

      // Set the specified address as default
      await tx
        .update(userAddresses)
        .set({ isDefault: true })
        .where(and(eq(userAddresses.id, addressId), eq(userAddresses.userId, userId)));
    });
  }

  // Product operations
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async searchProducts(query: string, categoryId?: string, providerId?: string, limit = 20): Promise<Product[]> {
    let whereClause = and(
      eq(products.isActive, true),
      or(
        ilike(products.name, `%${query}%`),
        ilike(products.description, `%${query}%`),
        ilike(products.ondcItemId, `%${query}%`)
      )
    );

    if (categoryId) {
      whereClause = and(whereClause, eq(products.categoryId, categoryId));
    }

    if (providerId) {
      whereClause = and(whereClause, eq(products.providerId, providerId));
    }

    return await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.ratings))
      .limit(limit);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    // First try to get by UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (uuidRegex.test(id)) {
      const [product] = await db.select().from(products).where(eq(products.id, id));
      return product;
    }

    // If not a UUID, try to find by ondcItemId
    const [product] = await db.select().from(products).where(eq(products.ondcItemId, id));
    return product;
  }

  async getProductsByCategory(categoryId: string, limit = 20): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)))
      .orderBy(desc(products.ratings))
      .limit(limit);
  }

  async getFeaturedProducts(limit = 10): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.ratings))
      .limit(limit);
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getUserOrders(userId: string, status?: string): Promise<Order[]> {
    let whereClause = eq(orders.userId, userId);

    if (status) {
      whereClause = and(whereClause, eq(orders.status, status))!;
    }

    return await db
      .select()
      .from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(orderId: string, status: string, state: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, state, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();
    return updatedOrder;
  }

  async getOrderWithItems(orderId: string): Promise<(Order & { items: any[] }) | undefined> {
    const order = await this.getOrder(orderId);
    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    return { ...order, items };
  }

  // Order items operations
  async createOrderItem(item: any): Promise<any> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }

  async getOrderItems(orderId: string): Promise<any[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // Order status history
  async addOrderStatusHistory(history: any): Promise<void> {
    await db.insert(orderStatusHistory).values(history);
  }

  async getOrderStatusHistory(orderId: string): Promise<any[]> {
    return await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, orderId))
      .orderBy(orderStatusHistory.timestamp);
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();

    // Update product rating
    if (review.productId && review.overallRating) {
      const avgRating = await db
        .select({
          avg: sql`AVG(${reviews.overallRating})`.as('avg'),
          count: sql`COUNT(*)`.as('count')
        })
        .from(reviews)
        .where(eq(reviews.productId, review.productId));

      if (avgRating[0]) {
        await db
          .update(products)
          .set({
            ratings: avgRating[0].avg as any,
            reviewCount: avgRating[0].count as number
          })
          .where(eq(products.id, review.productId));
      }
    }

    return newReview;
  }

  async getOrderReviews(orderId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.orderId, orderId));
  }

  async getProductReviews(productId: string, limit = 10): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
  }

  // Support operations
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [newTicket] = await db.insert(supportTickets).values(ticket).returning();
    return newTicket;
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id));
    return ticket;
  }

  async getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  }

  async updateSupportTicketStatus(id: string, status: string): Promise<SupportTicket | undefined> {
    const updates: any = { status, updatedAt: new Date() };
    if (status === 'resolved' || status === 'closed') {
      updates.resolvedAt = new Date();
    }

    const [updatedTicket] = await db
      .update(supportTickets)
      .set(updates)
      .where(eq(supportTickets.id, id))
      .returning();
    return updatedTicket;
  }

  async addSupportMessage(message: InsertSupportMessage): Promise<SupportMessage> {
    const [newMessage] = await db.insert(supportMessages).values(message).returning();
    return newMessage;
  }

  async getSupportMessages(ticketId: string): Promise<SupportMessage[]> {
    return await db
      .select()
      .from(supportMessages)
      .where(eq(supportMessages.ticketId, ticketId))
      .orderBy(supportMessages.createdAt);
  }

  // ONDC transaction operations
  async createOndcTransaction(transaction: InsertOndcTransaction): Promise<OndcTransaction> {
    const [newTransaction] = await db.insert(ondcTransactions).values(transaction).returning();
    return newTransaction;
  }

  async getOndcTransaction(transactionId: string): Promise<OndcTransaction | undefined> {
    const [transaction] = await db.select().from(ondcTransactions).where(eq(ondcTransactions.transactionId, transactionId));
    return transaction;
  }

  async updateOndcTransaction(transactionId: string, updates: Partial<InsertOndcTransaction>): Promise<OndcTransaction | undefined> {
    const [updatedTransaction] = await db
      .update(ondcTransactions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(ondcTransactions.transactionId, transactionId))
      .returning();
    return updatedTransaction;
  }

  // IGM Methods
  async createOndcIssue(issueData: InsertOndcIssue): Promise<OndcIssue> {
    const [issue] = await db.insert(ondcIssues).values(issueData).returning();
    return issue;
  }

  async getOndcIssue(issueId: string): Promise<OndcIssue | undefined> {
    const [issue] = await db.select().from(ondcIssues).where(eq(ondcIssues.ondcIssueId, issueId));
    return issue;
  }

  async getUserIssues(userId: string): Promise<OndcIssue[]> {
    return await db.select().from(ondcIssues).where(eq(ondcIssues.userId, userId)).orderBy(desc(ondcIssues.createdAt));
  }

  async getOrderIssues(orderId: string): Promise<OndcIssue[]> {
    return await db.select().from(ondcIssues).where(eq(ondcIssues.orderId, orderId));
  }

  async updateOndcIssue(issueId: string, data: Partial<OndcIssue>): Promise<OndcIssue | undefined> {
    const [updated] = await db.update(ondcIssues)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ondcIssues.ondcIssueId, issueId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
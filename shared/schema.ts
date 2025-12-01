import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ONDC Network Participants (Sellers/Providers)
export const networkParticipants = pgTable("network_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  subscriberId: varchar("subscriber_id").notNull().unique(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // BAP, BPP, etc.
  domain: varchar("domain").notNull(), // retail, logistics, etc.
  city: varchar("city").notNull(),
  signingPublicKey: text("signing_public_key").notNull(),
  encryptionPublicKey: text("encryption_public_key").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Delivery Addresses
export const userAddresses = pgTable("user_addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  addressLine1: varchar("address_line_1").notNull(),
  addressLine2: varchar("address_line_2"),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  postalCode: varchar("postal_code").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ONDC Products/Items
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  ondcItemId: varchar("ondc_item_id").notNull(),
  providerId: varchar("provider_id").notNull(),
  categoryId: varchar("category_id").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  images: jsonb("images").$type<string[]>().default([]),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  currency: varchar("currency").default("INR"),
  quantity: jsonb("quantity").$type<{
    available: number;
    maximum: number;
    unitOfMeasure: string;
  }>(),
  ratings: decimal("ratings", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  tags: jsonb("tags").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ONDC Orders
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  ondcOrderId: varchar("ondc_order_id").notNull().unique(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  transactionId: varchar("transaction_id").notNull(),
  bppId: varchar("bpp_id").notNull(),
  bppUri: varchar("bpp_uri").notNull(),
  providerId: varchar("provider_id").notNull(),
  providerName: varchar("provider_name").notNull(),
  status: varchar("status").notNull(), // created, confirmed, accepted, in-progress, completed, cancelled
  state: varchar("state").notNull(), // ONDC order state
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("INR"),
  paymentMethod: varchar("payment_method").notNull(),
  paymentStatus: varchar("payment_status").notNull(),
  deliveryAddress: jsonb("delivery_address").$type<{
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
  }>().notNull(),
  billingAddress: jsonb("billing_address").$type<{
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  }>().notNull(),
  fulfillment: jsonb("fulfillment").$type<{
    id: string;
    type: string;
    state: string;
    tracking: boolean;
    start?: {
      time?: {
        range?: {
          start: string;
          end: string;
        };
        timestamp?: string;
      };
      location?: {
        gps: string;
        address: string;
      };
    };
    end?: {
      time?: {
        range?: {
          start: string;
          end: string;
        };
        timestamp?: string;
      };
      location?: {
        gps: string;
        address: string;
      };
    };
    agent?: {
      name: string;
      phone: string;
    };
  }>(),
  quote: jsonb("quote").$type<{
    price: {
      currency: string;
      value: string;
    };
    breakup: Array<{
      title: string;
      price: {
        currency: string;
        value: string;
      };
      item?: {
        id: string;
        quantity: {
          count: number;
        };
      };
    }>;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  productId: uuid("product_id").references(() => products.id),
  ondcItemId: varchar("ondc_item_id").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  fulfillmentId: varchar("fulfillment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Order Status History
export const orderStatusHistory = pgTable("order_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  status: varchar("status").notNull(),
  state: varchar("state").notNull(),
  message: text("message"),
  timestamp: timestamp("timestamp").defaultNow(),
  ondcContext: jsonb("ondc_context"),
  ondcMessage: jsonb("ondc_message"),
});

// ONDC Transactions (for tracking API calls)
export const ondcTransactions = pgTable("ondc_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  transactionId: varchar("transaction_id").notNull().unique(),
  messageId: varchar("message_id").notNull(),
  action: varchar("action").notNull(), // search, select, init, confirm, etc.
  bapId: varchar("bap_id").notNull(),
  bapUri: varchar("bap_uri").notNull(),
  bppId: varchar("bpp_id"),
  bppUri: varchar("bpp_uri"),
  domain: varchar("domain").notNull(),
  coreVersion: varchar("core_version").default("1.2.0"),
  ttl: varchar("ttl").default("PT30S"),
  context: jsonb("context").notNull(),
  message: jsonb("message"),
  response: jsonb("response"),
  status: varchar("status").default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Reviews and Ratings
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  productId: uuid("product_id").references(() => products.id),
  providerId: varchar("provider_id").notNull(),
  overallRating: integer("overall_rating").notNull(), // 1-5
  productRating: integer("product_rating"), // 1-5
  deliveryRating: integer("delivery_rating"), // 1-5
  reviewText: text("review_text"),
  images: jsonb("images").$type<string[]>().default([]),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Support Tickets
export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  orderId: uuid("order_id").references(() => orders.id),
  type: varchar("type").notNull(), // order, payment, product, delivery, other
  priority: varchar("priority").default("medium"), // low, medium, high, urgent
  status: varchar("status").default("open"), // open, in_progress, resolved, closed
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  resolution: text("resolution"),
  assignedTo: varchar("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// ONDC IGM (Issue & Grievance Management) Issues
export const ondcIssues = pgTable("ondc_issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  ondcIssueId: varchar("ondc_issue_id").notNull().unique(),
  transactionId: varchar("transaction_id").notNull(),
  orderId: uuid("order_id").references(() => orders.id),
  userId: varchar("user_id").references(() => users.id).notNull(),
  bppId: varchar("bpp_id").notNull(),
  bppUri: varchar("bpp_uri").notNull(),
  issueCategory: varchar("issue_category").notNull(), // ITEM, FULFILLMENT, PAYMENT
  issueSubCategory: varchar("issue_sub_category").notNull(), // ITM01, ITM02, FLM01, etc.
  issueType: varchar("issue_type").notNull(), // ISSUE, GRIEVANCE
  status: varchar("status").default("OPEN"), // OPEN, CLOSED, ESCALATED
  description: text("description").notNull(),
  expectedResolutionTime: timestamp("expected_resolution_time"),
  expectedResponseTime: timestamp("expected_response_time"),
  complainantInfo: jsonb("complainant_info").$type<{
    person: {
      name: string;
      email: string;
      phone: string;
    };
  }>(),
  orderDetails: jsonb("order_details"),
  issueActions: jsonb("issue_actions").$type<{
    complainantActions: Array<{
      complainant_action: string;
      short_desc: string;
      updated_at: string;
      updated_by: {
        org: {
          name: string;
        };
        contact: {
          phone: string;
          email: string;
        };
        person: {
          name: string;
        };
      };
    }>;
    respondentActions?: Array<{
      respondent_action: string;
      short_desc: string;
      updated_at: string;
      updated_by: {
        org: {
          name: string;
        };
        contact: {
          phone: string;
          email: string;
        };
        person: {
          name: string;
        };
      };
      cascaded_level?: number;
    }>;
  }>(),
  resolution: jsonb("resolution").$type<{
    short_desc: string;
    long_desc?: string;
    action_triggered: string;
    refund_amount?: string;
  }>(),
  resolutionProvider: jsonb("resolution_provider").$type<{
    respondent_info: {
      type: string;
      organization: {
        org: {
          name: string;
        };
        contact: {
          phone: string;
          email: string;
        };
        person: {
          name: string;
        };
      };
      resolution_support: {
        chat_link?: string;
        contact: {
          phone: string;
          email: string;
        };
        gros?: Array<{
          person: {
            name: string;
          };
          contact: {
            phone: string;
            email: string;
          };
          gro_type: string;
        }>;
      };
    };
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

// Support Messages
export const supportMessages = pgTable("support_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketId: uuid("ticket_id").references(() => supportTickets.id).notNull(),
  senderId: varchar("sender_id").notNull(), // user_id or agent_id
  senderType: varchar("sender_type").notNull(), // user, agent
  message: text("message").notNull(),
  attachments: jsonb("attachments").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(userAddresses),
  orders: many(orders),
  reviews: many(reviews),
  supportTickets: many(supportTickets),
}));

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  reviews: many(reviews),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [supportTickets.orderId],
    references: [orders.id],
  }),
  messages: many(supportMessages),
}));

export const supportMessagesRelations = relations(supportMessages, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [supportMessages.ticketId],
    references: [supportTickets.id],
  }),
}));

export const ondcIssuesRelations = relations(ondcIssues, ({ one }) => ({
  user: one(users, {
    fields: [ondcIssues.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [ondcIssues.orderId],
    references: [orders.id],
  }),
}));

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;

export type InsertOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = typeof orderItems.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertUserAddress = typeof userAddresses.$inferInsert;
export type UserAddress = typeof userAddresses.$inferSelect;

export type InsertReview = typeof reviews.$inferInsert;
export type Review = typeof reviews.$inferSelect;

export type InsertSupportTicket = typeof supportTickets.$inferInsert;
export type SupportTicket = typeof supportTickets.$inferSelect;

export type InsertSupportMessage = typeof supportMessages.$inferInsert;
export type SupportMessage = typeof supportMessages.$inferSelect;

export type InsertOndcTransaction = typeof ondcTransactions.$inferInsert;
export type OndcTransaction = typeof ondcTransactions.$inferSelect;

export type InsertOndcIssue = typeof ondcIssues.$inferInsert;
export type OndcIssue = typeof ondcIssues.$inferSelect;

// Zod Schemas
export const insertProductSchema = createInsertSchema(products);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertUserAddressSchema = createInsertSchema(userAddresses);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertSupportTicketSchema = createInsertSchema(supportTickets);
export const insertSupportMessageSchema = createInsertSchema(supportMessages);

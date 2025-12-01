# Overview

CartCircle is a modern e-commerce marketplace application built on the Open Network for Digital Commerce (ONDC) protocol. The application enables users to shop from multiple sellers across the ONDC network through a unified mobile-first interface. It provides features for product search, cart management, order tracking, and customer support while seamlessly integrating with ONDC's distributed commerce ecosystem.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React 18 with TypeScript, following a mobile-first responsive design approach. The architecture uses a component-based structure with shadcn/ui components for consistent styling and behavior. Key architectural decisions include:

- **Routing**: Wouter for lightweight client-side routing with conditional rendering based on authentication state
- **State Management**: TanStack Query (React Query) for server state management and caching, eliminating the need for global state management
- **Styling**: Tailwind CSS with CSS variables for theming, providing a design system based on shadcn/ui
- **UI Components**: Radix UI primitives wrapped in custom components for accessibility and consistency

## Backend Architecture
The server follows an Express.js architecture with TypeScript, implementing a RESTful API design pattern. Core architectural components include:

- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations and schema management
- **Authentication**: Replit Auth integration using OpenID Connect with session-based authentication
- **ONDC Integration**: Custom protocol handlers for ONDC network communication, including signature verification and message formatting
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM for schema definition and migrations. Key design decisions include:

- **Schema Design**: Normalized tables for users, products, orders, and ONDC transactions with proper foreign key relationships
- **Session Management**: Database-backed sessions for secure authentication state persistence
- **ONDC Data**: Separate tables for tracking ONDC transactions, network participants, and protocol-specific data

## Authentication and Authorization
Authentication is handled through Replit's OpenID Connect integration, providing:

- **OAuth Flow**: Standard OpenID Connect flow with automatic user provisioning
- **Session Management**: Secure session cookies with configurable TTL
- **Route Protection**: Middleware-based route protection with automatic redirects
- **User Management**: Automatic user creation and profile management

## External Service Integrations

### ONDC Network Integration
The application integrates with the ONDC network through:

- **Protocol Compliance**: Implementation of ONDC API specifications for search, select, init, confirm, status, track, and cancel operations
- **Signature Authentication**: Ed25519 signature verification for secure communication
- **Gateway Communication**: Integration with ONDC gateway servers for network-wide operations
- **Transaction Tracking**: Comprehensive logging and state management for ONDC transactions

### Database Services
- **Neon Database**: Serverless PostgreSQL instance with connection pooling
- **Session Storage**: PostgreSQL-based session persistence

### Build and Development Tools
- **Vite**: Frontend build tool with HMR and development server
- **ESBuild**: Server-side bundling for production builds
- **TypeScript**: End-to-end type safety across client, server, and shared modules
- **Drizzle Kit**: Database schema management and migrations
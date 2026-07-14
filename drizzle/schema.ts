import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Update role enum to include security roles
// Note: Keep backward compatibility with existing 'user' and 'admin' roles
// Security roles are stored in usersExtended table

/**
 * Extended user roles for security operations.
 * Each role has specific dashboard and permission access.
 */
export const usersExtended = mysqlTable("users_extended", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  securityRole: mysqlEnum("securityRole", [
    "CEO",
    "ManagingDirector",
    "HROperations",
    "BoardMember",
    "Manager",
    "Guard",
    "OperationsCenter",
  ]).notNull(),
  department: varchar("department", { length: 128 }),
  badgeId: varchar("badgeId", { length: 64 }).unique(),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  emergencyContact: varchar("emergencyContact", { length: 20 }),
  isActive: boolean("isActive").default(true).notNull(),
  lastLocationUpdate: timestamp("lastLocationUpdate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UsersExtended = typeof usersExtended.$inferSelect;
export type InsertUsersExtended = typeof usersExtended.$inferInsert;

/**
 * Guard locations for real-time tracking on the perimeter map.
 */
export const guardLocations = mysqlTable("guard_locations", {
  id: int("id").autoincrement().primaryKey(),
  guardId: int("guardId").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  accuracy: decimal("accuracy", { precision: 8, scale: 2 }),
  patrolZone: varchar("patrolZone", { length: 128 }),
  isOnDuty: boolean("isOnDuty").default(true).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type GuardLocation = typeof guardLocations.$inferSelect;
export type InsertGuardLocation = typeof guardLocations.$inferInsert;

/**
 * Incident tracking for security events.
 */
export const incidents = mysqlTable("incidents", {
  id: int("id").autoincrement().primaryKey(),
  incidentCode: varchar("incidentCode", { length: 64 }).notNull().unique(),
  type: mysqlEnum("type", [
    "PerimeterBreach",
    "SOSSignal",
    "SecurityThreat",
    "OperationalIssue",
    "Other",
  ]).notNull(),
  severity: mysqlEnum("severity", ["Low", "Medium", "High", "Critical"]).notNull(),
  status: mysqlEnum("status", [
    "Open",
    "InProgress",
    "Resolved",
    "Closed",
  ]).default("Open").notNull(),
  reportedBy: int("reportedBy").notNull(),
  assignedTo: int("assignedTo"),
  location: varchar("location", { length: 256 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  description: text("description"),
  resolutionNotes: text("resolutionNotes"),
  responseTime: int("responseTime"), // in seconds
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;

/**
 * Perimeter breach events with sensor data.
 */
export const breachEvents = mysqlTable("breach_events", {
  id: int("id").autoincrement().primaryKey(),
  incidentId: int("incidentId").notNull(),
  sensorId: varchar("sensorId", { length: 64 }).notNull(),
  sensorType: varchar("sensorType", { length: 64 }),
  breachLocation: varchar("breachLocation", { length: 256 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  sensorData: json("sensorData"),
  alertLevel: mysqlEnum("alertLevel", ["Warning", "Alert", "Critical"]).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type BreachEvent = typeof breachEvents.$inferSelect;
export type InsertBreachEvent = typeof breachEvents.$inferInsert;

/**
 * Guard communication events (SOS signals, video calls, etc.).
 */
export const guardCommunications = mysqlTable("guard_communications", {
  id: int("id").autoincrement().primaryKey(),
  guardId: int("guardId").notNull(),
  communicationType: mysqlEnum("communicationType", [
    "SOSSignal",
    "VideoCallRequest",
    "VideoCallActive",
    "Message",
  ]).notNull(),
  status: mysqlEnum("status", [
    "Pending",
    "Active",
    "Acknowledged",
    "Resolved",
  ]).default("Pending").notNull(),
  respondedBy: int("respondedBy"),
  guardLatitude: decimal("guardLatitude", { precision: 10, scale: 8 }),
  guardLongitude: decimal("guardLongitude", { precision: 11, scale: 8 }),
  description: text("description"),
  responseTime: int("responseTime"), // in seconds
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type GuardCommunication = typeof guardCommunications.$inferSelect;
export type InsertGuardCommunication = typeof guardCommunications.$inferInsert;

/**
 * Real-time alerts for SOC display.
 */
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  alertCode: varchar("alertCode", { length: 64 }).notNull().unique(),
  type: mysqlEnum("type", [
    "SOSSignal",
    "PerimeterBreach",
    "CriticalIncident",
    "SystemAlert",
  ]).notNull(),
  severity: mysqlEnum("severity", ["Low", "Medium", "High", "Critical"]).notNull(),
  status: mysqlEnum("status", [
    "Active",
    "Acknowledged",
    "Resolved",
  ]).default("Active").notNull(),
  sourceId: int("sourceId"),
  sourceType: varchar("sourceType", { length: 64 }),
  message: text("message").notNull(),
  location: varchar("location", { length: 256 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  acknowledgedBy: int("acknowledgedBy"),
  acknowledgedAt: timestamp("acknowledgedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

/**
 * Video call sessions between guards and operations center.
 */
export const videoSessions = mysqlTable("video_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionCode: varchar("sessionCode", { length: 64 }).notNull().unique(),
  initiatedBy: int("initiatedBy").notNull(),
  respondedBy: int("respondedBy"),
  status: mysqlEnum("status", [
    "Pending",
    "Active",
    "Ended",
  ]).default("Pending").notNull(),
  duration: int("duration"), // in seconds
  recordingUrl: varchar("recordingUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  endedAt: timestamp("endedAt"),
});

export type VideoSession = typeof videoSessions.$inferSelect;
export type InsertVideoSession = typeof videoSessions.$inferInsert;

/**
 * Audit log for all sensitive operations.
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 128 }).notNull(),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: int("entityId"),
  changes: json("changes"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
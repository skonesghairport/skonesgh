import { eq, and, desc, asc, gte, lte, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, usersExtended, InsertUsersExtended, incidents, InsertIncident, guardLocations, InsertGuardLocation, guardCommunications, InsertGuardCommunication, alerts, InsertAlert, breachEvents, InsertBreachEvent, videoSessions, InsertVideoSession, auditLogs, InsertAuditLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ============ SECURITY OPERATIONS QUERIES ============

/**
 * User Extended Profile Management
 */
export async function createUserExtended(data: InsertUsersExtended) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(usersExtended).values(data);
  return result;
}

export async function getUserExtended(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(usersExtended).where(eq(usersExtended.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserExtended(userId: number, data: Partial<InsertUsersExtended>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(usersExtended).set(data).where(eq(usersExtended.userId, userId));
}

export async function getUsersByRole(role: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(usersExtended).where(eq(usersExtended.securityRole, role as any));
}

/**
 * Guard Location Tracking
 */
export async function createGuardLocation(data: InsertGuardLocation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(guardLocations).values(data);
}

export async function getLatestGuardLocation(guardId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(guardLocations).where(eq(guardLocations.guardId, guardId)).orderBy(desc(guardLocations.timestamp)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveGuardLocations() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(guardLocations).where(eq(guardLocations.isOnDuty, true)).orderBy(desc(guardLocations.timestamp));
}

/**
 * Incident Management
 */
export async function createIncident(data: InsertIncident) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(incidents).values(data);
}

export async function getIncident(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(incidents).where(eq(incidents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getIncidentByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(incidents).where(eq(incidents.incidentCode, code)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveIncidents() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(incidents).where(eq(incidents.status, "Open" as any)).orderBy(desc(incidents.createdAt));
}

export async function updateIncident(id: number, data: Partial<InsertIncident>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(incidents).set(data).where(eq(incidents.id, id));
}

/**
 * Guard Communications (SOS, Video Calls, etc.)
 */
export async function createGuardCommunication(data: InsertGuardCommunication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(guardCommunications).values(data);
}

export async function getGuardCommunication(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(guardCommunications).where(eq(guardCommunications.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveCommunications() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(guardCommunications).where(eq(guardCommunications.status, "Pending" as any)).orderBy(desc(guardCommunications.createdAt));
}

export async function updateGuardCommunication(id: number, data: Partial<InsertGuardCommunication>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(guardCommunications).set(data).where(eq(guardCommunications.id, id));
}

/**
 * Alerts
 */
export async function createAlert(data: InsertAlert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(alerts).values(data);
}

export async function getActiveAlerts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(alerts).where(eq(alerts.status, "Active" as any)).orderBy(desc(alerts.createdAt));
}

export async function updateAlert(id: number, data: Partial<InsertAlert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(alerts).set(data).where(eq(alerts.id, id));
}

/**
 * Breach Events
 */
export async function createBreachEvent(data: InsertBreachEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(breachEvents).values(data);
}

export async function getRecentBreachEvents(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(breachEvents).orderBy(desc(breachEvents.timestamp)).limit(limit);
}

/**
 * Video Sessions
 */
export async function createVideoSession(data: InsertVideoSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(videoSessions).values(data);
}

export async function getVideoSession(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(videoSessions).where(eq(videoSessions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getVideoSessionByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(videoSessions).where(eq(videoSessions.sessionCode, code)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateVideoSession(id: number, data: Partial<InsertVideoSession>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(videoSessions).set(data).where(eq(videoSessions.id, id));
}

/**
 * Audit Logging
 */
export async function createAuditLog(data: InsertAuditLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(auditLogs).values(data);
}

export async function getAuditLogs(userId?: number, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = userId ? [eq(auditLogs.userId, userId)] : [];
  return await db.select().from(auditLogs).where(conditions.length > 0 ? and(...conditions) : undefined).orderBy(desc(auditLogs.timestamp)).limit(limit);
}

/**
 * Analytics & Reporting
 */
export async function getIncidentStats(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return null;
  
  // Get incident counts by type and severity
  const stats = await db.select().from(incidents).where(
    and(
      gte(incidents.createdAt, startDate),
      lte(incidents.createdAt, endDate)
    )
  );
  
  return stats;
}

export async function getResponseTimeMetrics(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(incidents).where(
    and(
      gte(incidents.createdAt, startDate),
      lte(incidents.createdAt, endDate)
    )
  ).orderBy(desc(incidents.responseTime));
}

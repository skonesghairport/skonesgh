import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { nanoid } from "nanoid";

// ============ ROLE-BASED MIDDLEWARE ============

// Create role-specific procedures
const createRoleProcedure = (allowedRoles: string[]) => {
  return protectedProcedure.use(async (opts) => {
    const { ctx, next } = opts;
    
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    
    const userExt = await db.getUserExtended(ctx.user.id);
    if (!userExt || !allowedRoles.includes(userExt.securityRole)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions for this operation" });
    }
    
    return next({
      ctx: {
        ...ctx,
        userRole: userExt.securityRole,
      },
    });
  });
};

// Helper to convert coordinates to decimal format for database storage
const coordinateToDecimal = (value: number): string => {
  return value.toString();
};

// ============ VALIDATION SCHEMAS ============

const CreateIncidentSchema = z.object({
  type: z.enum(["PerimeterBreach", "SOSSignal", "SecurityThreat", "OperationalIssue", "Other"]),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().optional(),
});

const UpdateIncidentSchema = z.object({
  id: z.number(),
  status: z.enum(["Open", "InProgress", "Resolved", "Closed"]).optional(),
  assignedTo: z.number().optional(),
  resolutionNotes: z.string().optional(),
});

const GuardLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
  patrolZone: z.string().optional(),
});

const SOSSignalSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().optional(),
});

const VideoCallRequestSchema = z.object({
  respondentId: z.number(),
});

const CreateUserExtendedSchema = z.object({
  userId: z.number(),
  securityRole: z.enum(["CEO", "ManagingDirector", "HROperations", "BoardMember", "Manager", "Guard", "OperationsCenter"]),
  department: z.string().optional(),
  badgeId: z.string().optional(),
  phoneNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
});

const AssignRoleSchema = z.object({
  userId: z.number(),
  securityRole: z.enum(["CEO", "ManagingDirector", "HROperations", "BoardMember", "Manager", "Guard", "OperationsCenter"]),
  department: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ USER MANAGEMENT ============
  users: router({
    getExtended: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserExtended(ctx.user.id);
    }),

    updateExtended: protectedProcedure
      .input(CreateUserExtendedSchema.partial())
      .mutation(async ({ ctx, input }) => {
        return await db.updateUserExtended(ctx.user.id, input);
      }),

    // Admin procedures for user management
    listAll: createRoleProcedure(["CEO", "ManagingDirector", "OperationsCenter"])
      .query(async () => {
        // In a real app, you'd fetch all users with their extended profiles
        // For now, return empty - this would be implemented with a proper query
        return [];
      }),

    assignRole: createRoleProcedure(["CEO", "ManagingDirector"])
      .input(AssignRoleSchema)
      .mutation(async ({ ctx, input }) => {
        // Check if user exists
        const existingExt = await db.getUserExtended(input.userId);
        
        if (existingExt) {
          // Update existing role assignment
          await db.updateUserExtended(input.userId, {
            securityRole: input.securityRole as any,
            department: input.department,
          });
        } else {
          // Create new role assignment
          await db.createUserExtended({
            userId: input.userId,
            securityRole: input.securityRole as any,
            department: input.department,
          });
        }

        // Log the role assignment change
        await db.createAuditLog({
          userId: ctx.user.id,
          action: existingExt ? "UPDATE_ROLE" : "ASSIGN_ROLE",
          entityType: "User",
          entityId: input.userId,
          changes: {
            securityRole: input.securityRole,
            department: input.department,
          },
        });

        return { success: true };
      }),

    getByRole: createRoleProcedure(["CEO", "ManagingDirector", "OperationsCenter"])
      .input(z.object({ role: z.string() }))
      .query(async ({ input }) => {
        return await db.getUsersByRole(input.role);
      }),
  }),

  // ============ INCIDENT MANAGEMENT ============
  incidents: router({
    create: protectedProcedure
      .input(CreateIncidentSchema)
      .mutation(async ({ ctx, input }) => {
        const incidentCode = `INC-${nanoid(12)}`;
        
        const incidentData: any = {
          incidentCode,
          type: input.type as any,
          severity: input.severity as any,
          status: "Open" as any,
          reportedBy: ctx.user.id,
          location: input.location,
          description: input.description,
        };

        // Store coordinates as decimal strings
        if (input.latitude !== undefined) {
          incidentData.latitude = coordinateToDecimal(input.latitude) as any;
        }
        if (input.longitude !== undefined) {
          incidentData.longitude = coordinateToDecimal(input.longitude) as any;
        }

        const result = await db.createIncident(incidentData);

        // Log the incident creation
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "CREATE_INCIDENT",
          entityType: "Incident",
          changes: { incidentCode, type: input.type },
        });

        return { incidentCode, success: true };
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getIncident(input.id);
      }),

    getByCode: protectedProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        return await db.getIncidentByCode(input.code);
      }),

    getActive: createRoleProcedure(["OperationsCenter", "Manager", "CEO", "ManagingDirector"])
      .query(async ({ ctx }) => {
        const incidents = await db.getActiveIncidents();
        
        // Role-specific filtering
        const userExt = await db.getUserExtended(ctx.user.id);
        
        // Managers see only incidents assigned to them or their team
        if (userExt?.securityRole === "Manager") {
          return incidents.filter(i => i.assignedTo === ctx.user.id || i.reportedBy === ctx.user.id);
        }
        
        // Operations center and above see all
        return incidents;
      }),

    update: createRoleProcedure(["OperationsCenter", "Manager", "CEO"])
      .input(UpdateIncidentSchema)
      .mutation(async ({ ctx, input }) => {
        const incident = await db.getIncident(input.id);
        if (!incident) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Incident not found" });
        }

        const updateData: any = {};
        if (input.status) updateData.status = input.status;
        if (input.assignedTo) updateData.assignedTo = input.assignedTo;
        if (input.resolutionNotes) updateData.resolutionNotes = input.resolutionNotes;
        
        if (input.status === "Resolved" || input.status === "Closed") {
          updateData.resolvedAt = new Date();
        }
        
        await db.updateIncident(input.id, updateData);

        // Log the update
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "UPDATE_INCIDENT",
          entityType: "Incident",
          entityId: input.id,
          changes: updateData,
        });

        return { success: true };
      }),
  }),

  // ============ GUARD LOCATION TRACKING ============
  locations: router({
    update: protectedProcedure
      .input(GuardLocationSchema)
      .mutation(async ({ ctx, input }) => {
        const locationData: any = {
          guardId: ctx.user.id,
          latitude: coordinateToDecimal(input.latitude) as any,
          longitude: coordinateToDecimal(input.longitude) as any,
          isOnDuty: true,
          patrolZone: input.patrolZone,
        };

        if (input.accuracy !== undefined) {
          locationData.accuracy = coordinateToDecimal(input.accuracy) as any;
        }

        return await db.createGuardLocation(locationData);
      }),

    getLatest: protectedProcedure
      .input(z.object({ guardId: z.number() }))
      .query(async ({ input }) => {
        return await db.getLatestGuardLocation(input.guardId);
      }),

    getActive: createRoleProcedure(["OperationsCenter", "Manager", "CEO"])
      .query(async ({ ctx }) => {
        const locations = await db.getActiveGuardLocations();
        
        // Role-specific filtering
        const userExt = await db.getUserExtended(ctx.user.id);
        
        // Managers see only their team's locations
        if (userExt?.securityRole === "Manager") {
          // In a real app, you'd have a team assignment table
          // For now, return all (would be filtered by team)
          return locations;
        }
        
        // Operations center and above see all
        return locations;
      }),
  }),

  // ============ GUARD COMMUNICATIONS (SOS, VIDEO CALLS) ============
  communications: router({
    sendSOS: protectedProcedure
      .input(SOSSignalSchema)
      .mutation(async ({ ctx, input }) => {
        // Create SOS communication record
        const commData: any = {
          guardId: ctx.user.id,
          communicationType: "SOSSignal" as any,
          status: "Pending" as any,
          guardLatitude: coordinateToDecimal(input.latitude) as any,
          guardLongitude: coordinateToDecimal(input.longitude) as any,
          description: input.description || "SOS Signal from Guard",
        };

        const commResult = await db.createGuardCommunication(commData);

        // Create associated incident
        const incidentCode = `SOS-${nanoid(12)}`;
        const incidentData: any = {
          incidentCode,
          type: "SOSSignal" as any,
          severity: "Critical" as any,
          status: "Open" as any,
          reportedBy: ctx.user.id,
          latitude: coordinateToDecimal(input.latitude) as any,
          longitude: coordinateToDecimal(input.longitude) as any,
          description: `SOS Signal from Guard ${ctx.user.name}`,
        };

        await db.createIncident(incidentData);

        // Create alert for operations center
        const alertCode = `ALERT-${nanoid(12)}`;
        const alertData: any = {
          alertCode,
          type: "SOSSignal" as any,
          severity: "Critical" as any,
          status: "Active" as any,
          sourceId: ctx.user.id,
          sourceType: "Guard",
          message: `SOS Signal from Guard: ${ctx.user.name}`,
          latitude: coordinateToDecimal(input.latitude) as any,
          longitude: coordinateToDecimal(input.longitude) as any,
        };

        await db.createAlert(alertData);

        // Log the SOS signal
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "SEND_SOS",
          entityType: "Communication",
          changes: { incidentCode, alertCode },
        });

        return { success: true, incidentCode, alertCode };
      }),

    getActive: createRoleProcedure(["OperationsCenter", "Manager", "CEO"])
      .query(async () => {
        return await db.getActiveCommunications();
      }),

    acknowledge: createRoleProcedure(["OperationsCenter", "Manager"])
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.updateGuardCommunication(input.id, {
          status: "Acknowledged" as any,
          respondedBy: ctx.user.id,
        });

        // Log the acknowledgment
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "ACKNOWLEDGE_COMMUNICATION",
          entityType: "Communication",
          entityId: input.id,
        });

        return result;
      }),

    requestVideoCall: protectedProcedure
      .input(VideoCallRequestSchema)
      .mutation(async ({ ctx, input }) => {
        const sessionCode = `VID-${nanoid(12)}`;
        
        // Create video session
        await db.createVideoSession({
          sessionCode,
          initiatedBy: ctx.user.id,
          respondedBy: input.respondentId,
          status: "Pending" as any,
        });

        // Create communication record
        await db.createGuardCommunication({
          guardId: ctx.user.id,
          communicationType: "VideoCallRequest" as any,
          status: "Pending" as any,
          respondedBy: input.respondentId,
        });

        // Log the video call request
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "REQUEST_VIDEO_CALL",
          entityType: "VideoSession",
          changes: { sessionCode },
        });

        return { sessionCode, success: true };
      }),

    updateVideoCallStatus: protectedProcedure
      .input(z.object({ sessionCode: z.string(), status: z.enum(["Active", "Ended"]) }))
      .mutation(async ({ ctx, input }) => {
        const session = await db.getVideoSessionByCode(input.sessionCode);
        if (!session) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Video session not found" });
        }

        const updateData: any = { status: input.status };
        if (input.status === "Ended") {
          updateData.endedAt = new Date();
        }

        await db.updateVideoSession(session.id, updateData);

        // Log the status update
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "UPDATE_VIDEO_CALL_STATUS",
          entityType: "VideoSession",
          entityId: session.id,
          changes: { status: input.status },
        });

        return { success: true };
      }),
  }),

  // ============ ALERTS ============
  alerts: router({
    getActive: createRoleProcedure(["OperationsCenter", "Manager", "CEO", "ManagingDirector"])
      .query(async ({ ctx }) => {
        const alerts = await db.getActiveAlerts();
        
        // Role-specific filtering
        const userExt = await db.getUserExtended(ctx.user.id);
        
        // Managers see only alerts relevant to their scope
        if (userExt?.securityRole === "Manager") {
          return alerts.filter(a => a.severity === "High" || a.severity === "Critical");
        }
        
        // Operations center and above see all
        return alerts;
      }),

    acknowledge: createRoleProcedure(["OperationsCenter", "Manager"])
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.updateAlert(input.id, {
          status: "Acknowledged" as any,
          acknowledgedBy: ctx.user.id,
          acknowledgedAt: new Date(),
        });

        // Log the acknowledgment
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "ACKNOWLEDGE_ALERT",
          entityType: "Alert",
          entityId: input.id,
        });

        return result;
      }),
  }),

  // ============ BREACH EVENTS ============
  breaches: router({
    getRecent: createRoleProcedure(["OperationsCenter", "Manager", "CEO"])
      .query(async () => {
        return await db.getRecentBreachEvents(50);
      }),
  }),

  // ============ ANALYTICS & REPORTING ============
  analytics: router({
    getIncidentStats: createRoleProcedure(["CEO", "ManagingDirector", "OperationsCenter"])
      .input(z.object({ startDate: z.date(), endDate: z.date() }))
      .query(async ({ input }) => {
        return await db.getIncidentStats(input.startDate, input.endDate);
      }),

    getResponseMetrics: createRoleProcedure(["CEO", "ManagingDirector", "OperationsCenter"])
      .input(z.object({ startDate: z.date(), endDate: z.date() }))
      .query(async ({ input }) => {
        return await db.getResponseTimeMetrics(input.startDate, input.endDate);
      }),
  }),
});

export type AppRouter = typeof appRouter;

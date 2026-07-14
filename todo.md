# DavSec/AvsEc Ghana Airport Security Portal - Development TODO

## Phase 1: Database Schema & Backend Infrastructure
- [x] Extend database schema with security operations tables (users_extended, incidents, guardCommunications, breachEvents, alerts, guardLocations, videoSessions, auditLogs)
- [x] Create database migration SQL and apply via webdev_execute_sql
- [x] Implement database query helpers in server/db.ts for all security operations
- [x] Set up backend API endpoints for user management and role assignment

## Phase 2: Role-Based Access Control (RBAC)
- [x] Extend user roles enum to support 7 roles: CEO, MD, HR, Board, Manager, Guard, OperationsCenter
- [x] Implement role-based procedure middleware (protectedProcedure variants for each role)
- [x] Create role validation helpers and permission checks
- [x] Build backend procedures for role-specific data filtering
- [x] Implement admin procedures for user role management and assignment

## Phase 3: Authentication & User Management
- [x] Extend user profile system with role assignment UI
- [x] Build admin panel for managing users and assigning roles
- [x] Implement role-based login redirects to appropriate dashboards
- [x] Create user profile and settings pages for each role

## Phase 4: Professional SOC Dashboard
- [x] Design and implement Operations Center dashboard layout
- [x] Build real-time incident overview panel with status indicators
- [x] Implement active alerts display with severity filtering
- [x] Create dashboard status indicators (operational, warning, critical)
- [x] Build incident timeline and event log viewer
- [x] Implement dashboard refresh mechanisms and real-time updates

## Phase 5: Multi-Role Dashboards
- [x] Build CEO dashboard (high-level analytics, KPIs, strategic overview)
- [x] Build Managing Director dashboard (operations oversight, performance metrics)
- [x] Build HR Operations dashboard (staff management, scheduling, attendance)
- [x] Build Board Members dashboard (compliance view, audit trails, reports)
- [x] Build Managers dashboard (team oversight, incident tracking, performance)
- [x] Build Guards dashboard (personal SOS, location sharing, communication)
- [x] Build Operations Center dashboard (full SOC view, real-time monitoring)

## Phase 6: Google Maps Integration
- [ ] Set up Google Maps API integration with authentication
- [ ] Build live perimeter monitoring map component
- [ ] Implement guard position markers with real-time updates
- [ ] Implement patrol zone visualization on map
- [ ] Implement breach event markers on map
- [ ] Create map controls for filtering and zooming
- [ ] Add marker clustering for performance with many guards

## Phase 7: Guard Location Tracking
- [ ] Implement GPS location capture on guard devices
- [ ] Build location update API endpoint
- [ ] Create real-time location sync mechanism (WebSocket or polling)
- [ ] Implement location history storage and retrieval
- [ ] Build location-based breach detection logic

## Phase 8: SOS Emergency Alert System
- [ ] Build one-tap SOS button UI for guard dashboard
- [ ] Implement SOS signal API endpoint
- [ ] Create SOS alert notification system
- [ ] Implement GPS location capture with SOS signal
- [ ] Build SOS incident auto-creation and escalation
- [ ] Create SOS response workflow for operations center
- [ ] Implement SOS alert acknowledgment and resolution tracking

## Phase 9: Perimeter Breach Detection
- [ ] Design breach event data model and storage
- [ ] Implement breach detection sensor integration API
- [ ] Build breach event logging and classification system
- [ ] Create severity assessment logic for breaches
- [ ] Implement breach location mapping to map display
- [ ] Build breach incident auto-escalation workflow
- [ ] Create breach event audit trail

## Phase 10: Incident Management System
- [ ] Build incident creation and tracking system
- [ ] Implement incident classification (breach, SOS, security, operational, etc.)
- [ ] Create incident severity levels and escalation rules
- [ ] Build incident assignment workflow to managers/operations center
- [ ] Implement incident status tracking (open, in-progress, resolved, closed)
- [ ] Create incident resolution workflow with notes and evidence
- [ ] Build incident audit trail with all changes and actions
- [ ] Implement incident search and filtering

## Phase 11: WebRTC Video Call System
- [ ] Set up WebRTC signaling server
- [ ] Build video call request UI for guards
- [ ] Implement video call request API endpoints
- [ ] Build video call answer/reject workflow for operations center
- [ ] Implement peer connection establishment and management
- [ ] Build video call UI with screen sharing capability
- [ ] Create call recording functionality
- [ ] Implement call history and logging

## Phase 12: Real-Time Notifications
- [ ] Implement WebSocket connection for real-time updates
- [ ] Build notification service for SOS alerts
- [ ] Build notification service for perimeter breaches
- [ ] Build notification service for critical incidents
- [ ] Create notification filtering by role
- [ ] Implement notification acknowledgment tracking
- [ ] Build notification history and archive

## Phase 13: In-App Alert System
- [ ] Build in-app notification display component
- [ ] Implement notification toast/banner system
- [ ] Create notification sound alerts for critical events
- [ ] Build notification center with history
- [ ] Implement notification preferences per user
- [ ] Create notification priority levels and routing

## Phase 14: Reporting & Analytics
- [ ] Build incident trend analytics
- [ ] Implement guard activity log reporting
- [ ] Create response time metrics and KPIs
- [ ] Build incident classification reports
- [ ] Implement breach event reports
- [ ] Create SOS response time analytics
- [ ] Build exportable report generation (PDF, CSV)
- [ ] Implement date range filtering for reports

## Phase 15: Professional UI/UX & Branding
- [ ] Design professional color scheme for airport security operations
- [ ] Implement DavSec/AvsEc branding throughout portal
- [ ] Create consistent navigation structure across all dashboards
- [ ] Build professional header/footer with branding
- [ ] Implement responsive design for desktop and tablet
- [ ] Create professional typography and spacing
- [ ] Build loading states and animations
- [ ] Implement dark mode for SOC operations center (optional)

## Phase 16: Testing & Security Hardening
- [ ] Write vitest tests for all backend procedures
- [ ] Write vitest tests for RBAC middleware
- [ ] Write vitest tests for incident management logic
- [ ] Write vitest tests for location tracking
- [ ] Implement input validation and sanitization
- [ ] Add rate limiting for critical endpoints
- [ ] Implement audit logging for all sensitive operations
- [ ] Security review and hardening

## Phase 17: Final Integration & Delivery
- [ ] End-to-end testing of all features
- [ ] Performance testing and optimization
- [ ] User acceptance testing with stakeholders
- [ ] Documentation and deployment guide
- [ ] Final checkpoint and delivery

## Completed Features (from previous session)
- [x] Project initialized with web-db-user scaffold
- [x] Database schema extended with security operations tables
- [x] Basic backend infrastructure set up

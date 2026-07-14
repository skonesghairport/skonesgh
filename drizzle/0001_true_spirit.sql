CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alertCode` varchar(64) NOT NULL,
	`type` enum('SOSSignal','PerimeterBreach','CriticalIncident','SystemAlert') NOT NULL,
	`severity` enum('Low','Medium','High','Critical') NOT NULL,
	`status` enum('Active','Acknowledged','Resolved') NOT NULL DEFAULT 'Active',
	`sourceId` int,
	`sourceType` varchar(64),
	`message` text NOT NULL,
	`location` varchar(256),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`acknowledgedBy` int,
	`acknowledgedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`),
	CONSTRAINT `alerts_alertCode_unique` UNIQUE(`alertCode`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(128) NOT NULL,
	`entityType` varchar(64) NOT NULL,
	`entityId` int,
	`changes` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `breach_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`incidentId` int NOT NULL,
	`sensorId` varchar(64) NOT NULL,
	`sensorType` varchar(64),
	`breachLocation` varchar(256) NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`sensorData` json,
	`alertLevel` enum('Warning','Alert','Critical') NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `breach_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guard_communications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guardId` int NOT NULL,
	`communicationType` enum('SOSSignal','VideoCallRequest','VideoCallActive','Message') NOT NULL,
	`status` enum('Pending','Active','Acknowledged','Resolved') NOT NULL DEFAULT 'Pending',
	`respondedBy` int,
	`guardLatitude` decimal(10,8),
	`guardLongitude` decimal(11,8),
	`description` text,
	`responseTime` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resolvedAt` timestamp,
	CONSTRAINT `guard_communications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guard_locations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guardId` int NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`accuracy` decimal(8,2),
	`patrolZone` varchar(128),
	`isOnDuty` boolean NOT NULL DEFAULT true,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guard_locations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `incidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`incidentCode` varchar(64) NOT NULL,
	`type` enum('PerimeterBreach','SOSSignal','SecurityThreat','OperationalIssue','Other') NOT NULL,
	`severity` enum('Low','Medium','High','Critical') NOT NULL,
	`status` enum('Open','InProgress','Resolved','Closed') NOT NULL DEFAULT 'Open',
	`reportedBy` int NOT NULL,
	`assignedTo` int,
	`location` varchar(256),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`description` text,
	`resolutionNotes` text,
	`responseTime` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resolvedAt` timestamp,
	CONSTRAINT `incidents_id` PRIMARY KEY(`id`),
	CONSTRAINT `incidents_incidentCode_unique` UNIQUE(`incidentCode`)
);
--> statement-breakpoint
CREATE TABLE `users_extended` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`securityRole` enum('CEO','ManagingDirector','HROperations','BoardMember','Manager','Guard','OperationsCenter') NOT NULL,
	`department` varchar(128),
	`badgeId` varchar(64),
	`phoneNumber` varchar(20),
	`emergencyContact` varchar(20),
	`isActive` boolean NOT NULL DEFAULT true,
	`lastLocationUpdate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_extended_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_extended_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `users_extended_badgeId_unique` UNIQUE(`badgeId`)
);
--> statement-breakpoint
CREATE TABLE `video_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionCode` varchar(64) NOT NULL,
	`initiatedBy` int NOT NULL,
	`respondedBy` int,
	`status` enum('Pending','Active','Ended') NOT NULL DEFAULT 'Pending',
	`duration` int,
	`recordingUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`endedAt` timestamp,
	CONSTRAINT `video_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `video_sessions_sessionCode_unique` UNIQUE(`sessionCode`)
);

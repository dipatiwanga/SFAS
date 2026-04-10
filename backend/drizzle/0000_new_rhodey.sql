CREATE TABLE `offices` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`location` text,
	CONSTRAINT `offices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100),
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pensioners` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`address` text,
	`partner_id` int,
	`office_id` int,
	`pic_sales_id` int,
	`status` varchar(100),
	`last_activity_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `pensioners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales_activities` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`pensioner_id` int NOT NULL,
	`sales_id` int NOT NULL,
	`description` text,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`photo_url` varchar(500),
	`visited_at` timestamp DEFAULT (now()),
	CONSTRAINT `sales_activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`role` varchar(50) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `pensioners` ADD CONSTRAINT `pensioners_partner_id_partners_id_fk` FOREIGN KEY (`partner_id`) REFERENCES `partners`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pensioners` ADD CONSTRAINT `pensioners_office_id_offices_id_fk` FOREIGN KEY (`office_id`) REFERENCES `offices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pensioners` ADD CONSTRAINT `pensioners_pic_sales_id_users_id_fk` FOREIGN KEY (`pic_sales_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_activities` ADD CONSTRAINT `sales_activities_pensioner_id_pensioners_id_fk` FOREIGN KEY (`pensioner_id`) REFERENCES `pensioners`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sales_activities` ADD CONSTRAINT `sales_activities_sales_id_users_id_fk` FOREIGN KEY (`sales_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
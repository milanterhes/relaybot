CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`ownerId` text NOT NULL,
	`hasBotJoined` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);

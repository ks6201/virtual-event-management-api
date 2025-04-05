import type { UUID } from '../libs/types';
import * as pgCore from 'drizzle-orm/pg-core';
import { acceptedRoles } from '../v-schemas/user';

export const users = pgCore.pgTable('users', {
  userId: pgCore.uuid('user_id').primaryKey().unique().defaultRandom(),
  name: pgCore.text('name').notNull(),
  email: pgCore.varchar('email', { length: 255 }).notNull().unique(),
  password: pgCore.text('password').notNull(),
  createdAt: pgCore.timestamp('created_at').defaultNow().notNull(),
});

export type TUser = Omit<typeof users.$inferSelect, "userId"> & {
    userId: UUID
};

export const roleEnum = pgCore.pgEnum('role', acceptedRoles);

export const userRoles = pgCore.pgTable('user_roles', {
  userId: pgCore.uuid('user_id')
    .references(() => users.userId)
    .notNull(),
  role: roleEnum('role').notNull(),
  createdAt: pgCore.timestamp('created_at').defaultNow()
});

export type TUserRoles = Omit<typeof userRoles.$inferSelect, "userId"> & {
    userId: UUID
};

export const events = pgCore.pgTable('events', {
  eventId: pgCore.uuid('event_id').primaryKey().unique().defaultRandom(),
  name: pgCore.text('name').notNull(), 
  date: pgCore.date('date').notNull(),
  time: pgCore.time('time').notNull(),
  description: pgCore.text("description").notNull(),
  organizerId: pgCore.uuid('organizer_id').references(() => users.userId).notNull(),
  createdAt: pgCore.timestamp('created_at').defaultNow()
});

export type Events = Omit<typeof events.$inferSelect, "eventId"> & {
  eventId: UUID
};

export type CreateEvent = Omit<
typeof events.$inferSelect, 
"eventId" | 
"createdAt" |
"organizerId"
>;

export type UpdateEvents = Omit<Events, "createdAt" | "eventId">;

export const attendeesEventMap = pgCore.pgTable('attendees_event_map', {
  id: pgCore.uuid('id').primaryKey().unique().defaultRandom(),
  eventId: pgCore.uuid('event_id').references(() => events.eventId, {onDelete: 'cascade'}).notNull(),
  attendeeId: pgCore.uuid('attendee_id').references(() => users.userId, {onDelete: 'cascade'}).notNull(),
  createdAt: pgCore.timestamp('created_at').defaultNow(),
});

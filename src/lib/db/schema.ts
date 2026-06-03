import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  integer,
  pgSequence,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import type { InferSelectModel } from "drizzle-orm";

const generateDefaultId = () => uuid().primaryKey().defaultRandom();

const generateDefaultDate = () =>
  timestamp({ precision: 6, mode: "string", withTimezone: true }).notNull().defaultNow();

export const taskVersionSeq = pgSequence("task_version_seq");

const nextVersion = () => sql`nextval('task_version_seq')`;

export const tasks = pgTable(
  "tasks",
  {
    id: generateDefaultId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text().notNull(),
    description: text().notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    version: bigint("version", { mode: "number" }).notNull().default(nextVersion()),
    createdAt: generateDefaultDate(),
    updatedAt: timestamp({ precision: 6, mode: "string", withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (table) => [
    uniqueIndex().on(table.id),
    index("tasks_user_version_idx").on(table.userId, table.version),
  ],
);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  stripeCustomerId: text("stripe_customer_id"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: generateDefaultDate(),
  updatedAt: generateDefaultDate(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const passkey = pgTable(
  "passkey",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    publicKey: text("public_key").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    credentialID: text("credential_id").notNull().unique(),
    counter: text("counter").notNull(),
    deviceType: text("device_type").notNull(),
    backedUp: boolean("backed_up").notNull(),
    transports: text("transports"),
    createdAt: generateDefaultDate(),
    aaguid: text("aaguid"),
  },
  (table) => [index("passkey_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),
  plan: text("plan").notNull(),
  referenceId: text("reference_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull(),
  periodStart: timestamp("period_start", { precision: 6, withTimezone: true }),
  periodEnd: timestamp("period_end", { precision: 6, withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  cancelAt: timestamp("cancel_at", { precision: 6, withTimezone: true }),
  canceledAt: timestamp("canceled_at", { precision: 6, withTimezone: true }),
  endedAt: timestamp("ended_at", { precision: 6, withTimezone: true }),
  seats: integer("seats"),
  trialStart: timestamp("trial_start", { precision: 6, withTimezone: true }),
  trialEnd: timestamp("trial_end", { precision: 6, withTimezone: true }),
  billingInterval: text("billing_interval"),
  stripeScheduleId: text("stripe_schedule_id"),
});

export const walletAddress = pgTable(
  "wallet_address",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    address: text("address").notNull(),
    chainId: integer("chain_id").notNull(),
    createdAt: generateDefaultDate(),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (table) => [
    index("wallet_address_userId_idx").on(table.userId),
    uniqueIndex("wallet_address_address_idx").on(table.address),
  ],
);

export const userSettings = pgTable(
  "user_settings",
  {
    id: generateDefaultId(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    sidebarPosition: text("sidebar_position").notNull().default("left"),
    sidebarVariant: text("sidebar_variant").notNull().default("inset"),
    sidebarCollapsible: text("sidebar_collapsible").notNull().default("none"),
    usePointerCursor: boolean("use_pointer_cursor").notNull().default(false),
    createdAt: generateDefaultDate(),
    updatedAt: generateDefaultDate(),
  },
  (table) => [index("user_settings_userId_idx").on(table.userId)],
);

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  settings: one(userSettings),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const passkeyRelations = relations(passkey, ({ one }) => ({
  user: one(user, {
    fields: [passkey.userId],
    references: [user.id],
  }),
}));

export const walletAddressRelations = relations(walletAddress, ({ one }) => ({
  user: one(user, {
    fields: [walletAddress.userId],
    references: [user.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(user, {
    fields: [userSettings.userId],
    references: [user.id],
  }),
}));

export type Task = InferSelectModel<typeof tasks>;
export type Wallet = InferSelectModel<typeof walletAddress>;
export type UserSettings = InferSelectModel<typeof userSettings>;

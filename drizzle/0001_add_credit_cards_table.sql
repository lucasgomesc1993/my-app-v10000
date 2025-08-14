-- Migration to add credit_cards table
CREATE TABLE `credit_cards` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `user_id` integer NOT NULL,
  `name` text NOT NULL,
  `brand` text NOT NULL,
  `type` text NOT NULL,
  `last_four_digits` text NOT NULL,
  `credit_limit` real DEFAULT 0,
  `current_balance` real DEFAULT 0,
  `available_limit` real DEFAULT 0,
  `closing_day` integer NOT NULL,
  `due_day` integer NOT NULL,
  `color` text DEFAULT '#3b82f6',
  `is_favorite` integer DEFAULT false,
  `is_active` integer DEFAULT true,
  `notes` text,
  `created_at` integer DEFAULT (unixepoch()),
  `updated_at` integer DEFAULT (unixepoch()),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Add indexes
CREATE INDEX `credit_cards_user_id_idx` ON `credit_cards` (`user_id`);
CREATE INDEX `credit_cards_brand_idx` ON `credit_cards` (`brand`);
CREATE INDEX `credit_cards_type_idx` ON `credit_cards` (`type`);

-- Add check constraints
-- Note: SQLite doesn't support adding check constraints after table creation,
-- so they're included in the CREATE TABLE statement above

-- Migration to add invoices table (since it depends on credit_cards)
CREATE TABLE `invoices` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `user_id` integer NOT NULL,
  `credit_card_id` integer NOT NULL,
  `card_name` text NOT NULL,
  `amount` real NOT NULL,
  `minimum_amount` real DEFAULT 0,
  `previous_balance` real DEFAULT 0,
  `new_balance` real DEFAULT 0,
  `credit_limit` real DEFAULT 0,
  `available_credit` real DEFAULT 0,
  `due_date` integer NOT NULL,
  `closing_date` integer NOT NULL,
  `period_start` integer,
  `period_end` integer,
  `status` text DEFAULT 'aberta',
  `is_paid` integer DEFAULT false,
  `paid_at` integer,
  `paid_amount` real DEFAULT 0,
  `paid_account_id` integer,
  `statement_id` text,
  `fit_id` text,
  `notes` text,
  `import_source` text,
  `import_date` integer,
  `created_at` integer DEFAULT (unixepoch()),
  `updated_at` integer DEFAULT (unixepoch()),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`credit_card_id`) REFERENCES `credit_cards`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`paid_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);

-- Add indexes for invoices
CREATE INDEX `invoices_user_id_idx` ON `invoices` (`user_id`);
CREATE INDEX `invoices_credit_card_id_idx` ON `invoices` (`credit_card_id`);
CREATE INDEX `invoices_status_idx` ON `invoices` (`status`);
CREATE INDEX `invoices_due_date_idx` ON `invoices` (`due_date`);
CREATE INDEX `invoices_closing_date_idx` ON `invoices` (`closing_date`);

-- Add enum types as comments for documentation
-- credit_cards.brand: 'visa', 'mastercard', 'elo', 'hipercard', 'american_express', 'outro'
-- credit_cards.type: 'credito', 'debito', 'credito_debito'
-- invoices.status: 'aberta', 'paga', 'vencida', 'cancelada'

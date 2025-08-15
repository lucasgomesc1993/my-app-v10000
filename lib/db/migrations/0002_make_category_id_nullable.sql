-- Make category_id nullable and add onDelete: 'set null' to the foreign key
PRAGMA foreign_keys=off;

-- Create a new table with the updated schema
CREATE TABLE transactions_new (
    id integer PRIMARY KEY AUTOINCREMENT,
    user_id integer NOT NULL,
    type text NOT NULL CHECK (type IN ('receita', 'despesa', 'transferencia', 'bill_payment')),
    description text NOT NULL,
    amount real NOT NULL,
    original_amount real,
    date integer NOT NULL,
    effective_date integer,
    due_date integer,
    category_id integer,
    account_id integer NOT NULL,
    destination_account_id integer,
    status text DEFAULT 'confirmada' CHECK (status IN ('pendente', 'confirmada', 'cancelada', 'estornada')),
    is_paid integer NOT NULL DEFAULT 0,
    is_recurring integer DEFAULT 0,
    recurring_id integer,
    fit_id text,
    check_number text,
    reference_number text,
    sic text,
    payee_list_id text,
    server_transaction_id text,
    correct_fit_id text,
    correct_action text,
    investment_transaction_type text,
    security_id text,
    units real,
    unit_price real,
    commission real,
    taxes real,
    fees real,
    load real,
    withholding real,
    tax_exempt integer DEFAULT 0,
    memo text,
    notes text,
    attachment_url text,
    attachment_mime_type text,
    attachment_size integer,
    created_at integer DEFAULT (unixepoch()),
    updated_at integer DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
    FOREIGN KEY (account_id) REFERENCES accounts (id),
    FOREIGN KEY (destination_account_id) REFERENCES accounts (id),
    FOREIGN KEY (recurring_id) REFERENCES transactions (id)
);

-- Copy data from old table to new table
INSERT INTO transactions_new
SELECT * FROM transactions;

-- Drop the old table
DROP TABLE transactions;

-- Rename the new table to the original name
ALTER TABLE transactions_new RENAME TO transactions;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions (user_id);
CREATE INDEX IF NOT EXISTS transactions_category_id_idx ON transactions (category_id);
CREATE INDEX IF NOT EXISTS transactions_account_id_idx ON transactions (account_id);
CREATE INDEX IF NOT EXISTS transactions_date_idx ON transactions (date);
CREATE INDEX IF NOT EXISTS transactions_type_idx ON transactions (type);

-- Enable foreign keys
PRAGMA foreign_keys=on;

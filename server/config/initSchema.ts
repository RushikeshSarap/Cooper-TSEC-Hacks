import pool from "./db.config";

export const initSchema = async () => {
  try {
    await pool.query(`

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_by BIGINT NOT NULL,
    start_date DATE,
    end_date DATE,
    total_budget DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(30) CHECK (STATUS IN ('active', 'settled')) DEFAULT 'active',
    created_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_events_creator
        FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS event_participants (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(30) CHECK (ROLE IN ('organizer', 'member')) DEFAULT 'member',

    CONSTRAINT fk_ep_event
        FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ep_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE (event_id, user_id)
);

CREATE TABLE IF NOT EXISTS event_wallets (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id BIGINT NOT NULL UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0.00,

    CONSTRAINT fk_wallet_event
        FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deposits (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_txn_id VARCHAR(100),
    status VARCHAR(30) CHECK (STATUS IN ('pending', 'completed', 'failed')) DEFAULT 'completed',
    created_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_deposit_event
        FOREIGN KEY (event_id) REFERENCES events(id),

    CONSTRAINT fk_deposit_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS expense_categories (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_category_event
        FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category_participants (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    CONSTRAINT fk_cp_category
        FOREIGN KEY (category_id) REFERENCES expense_categories(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_cp_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE (category_id, user_id)
);

CREATE TABLE IF NOT EXISTS bills (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_id BIGINT NOT NULL,
    image_url TEXT NOT NULL,
    extracted_amount DECIMAL(10,2),
    merchant VARCHAR(150),
    uploaded_by BIGINT NOT NULL,
    created_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bill_category
        FOREIGN KEY (category_id) REFERENCES expense_categories(id),

    CONSTRAINT fk_bill_user
        FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS payment_rules (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id BIGINT NOT NULL,
    max_amount DECIMAL(10,2),
    allowed_roles VARCHAR(50), -- SQLINES DEMO *** ember'
    approval_required BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_rule_event
        FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id BIGINT NOT NULL,
    category_id BIGINT,
    paid_by BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    gateway_txn_id VARCHAR(100),
    created_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_event
        FOREIGN KEY (event_id) REFERENCES events(id),

    CONSTRAINT fk_payment_category
        FOREIGN KEY (category_id) REFERENCES expense_categories(id),

    CONSTRAINT fk_payment_user
        FOREIGN KEY (paid_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS settlements (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    final_share DECIMAL(10,2) NOT NULL,
    deposited DECIMAL(10,2) NOT NULL,
    refund_amount DECIMAL(10,2),
    created_at TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_settlement_event
        FOREIGN KEY (event_id) REFERENCES events(id),

    CONSTRAINT fk_settlement_user
        FOREIGN KEY (user_id) REFERENCES users(id),

    UNIQUE (event_id, user_id)
);


    `);

    console.log("✅ Schema created");
  } catch (err) {
    console.error("❌ Schema error:", err);
  }
};

-- Run explicitly against the SAME PostgreSQL database as XiaoAn account_server.py.
-- Prerequisites: app_users, account_conversations, account_turns already exist.
-- No chat content is copied into these tables. Do not run from request handlers.
BEGIN;
CREATE TABLE IF NOT EXISTS xiaoan_answer_feedback (
  response_id varchar(36) PRIMARY KEY REFERENCES account_turns(response_id) ON DELETE CASCADE,
  clerk_user_id varchar(255) NOT NULL,
  score smallint NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment text NOT NULL DEFAULT '' CHECK (char_length(comment) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS xiaoan_answer_feedback_user ON xiaoan_answer_feedback(clerk_user_id);
CREATE TABLE IF NOT EXISTS xiaoan_admin_access (
  id bigserial PRIMARY KEY,
  clerk_user_id varchar(255) NOT NULL,
  action varchar(32) NOT NULL CHECK (action IN ('list_conversations', 'read_conversation')),
  conversation_id varchar(36),
  accessed_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;

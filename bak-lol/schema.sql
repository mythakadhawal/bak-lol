-- ============================================================
-- Bak-Lol — PostgreSQL Reference Schema
-- ============================================================
-- Run: psql -U postgres -d baklol -f schema.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Students (core user table)
-- ============================================================
CREATE TABLE students (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    email           TEXT UNIQUE,                        -- college email
    ug_number       TEXT UNIQUE,                        -- UG/enrollment number
    year            INT NOT NULL CHECK (year BETWEEN 1 AND 4),
    department      TEXT NOT NULL,
    hostel          TEXT NOT NULL,
    password_hash   TEXT NOT NULL,
    avatar_seed     TEXT,                               -- initials or seed string
    bio             TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),

    -- At least one login identifier must be present
    CONSTRAINT require_login CHECK (email IS NOT NULL OR ug_number IS NOT NULL)
);

CREATE INDEX idx_students_hostel     ON students(hostel);
CREATE INDEX idx_students_year       ON students(year);
CREATE INDEX idx_students_department ON students(department);

-- ============================================================
-- Activities
-- ============================================================
CREATE TABLE activities (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id       UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title            TEXT NOT NULL,
    description      TEXT,
    scheduled_at     TIMESTAMPTZ NOT NULL,
    hostel           TEXT,                              -- NULL = open to all hostels
    max_participants INT,
    status           TEXT NOT NULL DEFAULT 'upcoming'
                         CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_hostel ON activities(hostel);

-- Who is joining
CREATE TABLE activity_participants (
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    student_id  UUID NOT NULL REFERENCES students(id)  ON DELETE CASCADE,
    joined_at   TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (activity_id, student_id)
);

-- Activity-scoped chat
CREATE TABLE activity_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    sender_id   UUID NOT NULL REFERENCES students(id)  ON DELETE CASCADE,
    content     TEXT NOT NULL,
    sent_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_messages_activity ON activity_messages(activity_id, sent_at);

-- ============================================================
-- Help / Request system
-- ============================================================
CREATE TABLE help_requests (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poster_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    category    TEXT NOT NULL CHECK (category IN ('item', 'help', 'other')),
    title       TEXT NOT NULL,
    description TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_help_requests_resolved ON help_requests(is_resolved);

CREATE TABLE help_responses (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id   UUID NOT NULL REFERENCES help_requests(id) ON DELETE CASCADE,
    responder_id UUID NOT NULL REFERENCES students(id)      ON DELETE CASCADE,
    content      TEXT NOT NULL,
    is_accepted  BOOLEAN DEFAULT FALSE,                -- poster marks this as the solution
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Public Posts
-- ============================================================
CREATE TABLE posts (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title      TEXT NOT NULL,
    body       TEXT,
    tag        TEXT CHECK (tag IN ('study-group', 'project', 'collaboration', 'announcement', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_tag ON posts(tag);

-- ============================================================
-- Direct Messages
-- ============================================================
CREATE TABLE direct_messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    sent_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dm_sender_receiver ON direct_messages(sender_id, receiver_id);
CREATE INDEX idx_dm_receiver        ON direct_messages(receiver_id, is_read);

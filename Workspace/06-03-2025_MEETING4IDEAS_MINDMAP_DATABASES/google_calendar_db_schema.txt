Google Calendar-like Website - Database Schema

==============================
1️⃣ USERS TABLE
==============================
Stores user authentication & profile data.
- id (UUID, PRIMARY KEY)
- email (VARCHAR(255), UNIQUE, NOT NULL)
- password (TEXT, NOT NULL) - NULL if using OAuth
- full_name (VARCHAR(255), NOT NULL)
- avatar (TEXT, NULL)
- oauth_provider (VARCHAR(50), NULL) - Google, Microsoft
- oauth_id (VARCHAR(255), UNIQUE, NULL)
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW() ON UPDATE NOW())

==============================
2️⃣ EVENTS TABLE
==============================
Stores event details.
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY → users.id)
- title (VARCHAR(255), NOT NULL)
- description (TEXT, NULL)
- start_time (TIMESTAMP, NOT NULL)
- end_time (TIMESTAMP, NOT NULL)
- timezone (VARCHAR(50), DEFAULT 'UTC')
- is_all_day (BOOLEAN, DEFAULT FALSE)
- location (TEXT, NULL)
- color (VARCHAR(20), NULL)
- recurring_id (UUID, FOREIGN KEY → recurring_events.id)
- created_at (TIMESTAMP, DEFAULT NOW())
- updated_at (TIMESTAMP, DEFAULT NOW() ON UPDATE NOW())

==============================
3️⃣ EVENT PARTICIPANTS TABLE
==============================
Tracks event attendees.
- id (UUID, PRIMARY KEY)
- event_id (UUID, FOREIGN KEY → events.id)
- user_id (UUID, FOREIGN KEY → users.id)
- status (ENUM: 'invited', 'accepted', 'declined')
- created_at (TIMESTAMP, DEFAULT NOW())

==============================
4️⃣ RECURRING EVENTS TABLE
==============================
Handles recurring event rules.
- id (UUID, PRIMARY KEY)
- repeat_type (ENUM: 'daily', 'weekly', 'monthly', 'yearly')
- interval (INT, DEFAULT 1)
- end_date (TIMESTAMP, NULL)
- created_at (TIMESTAMP, DEFAULT NOW())

==============================
5️⃣ FILES TABLE
==============================
Stores uploaded CSV/Text/Voice files.
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY → users.id)
- event_id (UUID, FOREIGN KEY → events.id, NULL)
- file_type (ENUM: 'csv', 'text', 'voice')
- file_url (TEXT, NOT NULL)
- created_at (TIMESTAMP, DEFAULT NOW())

==============================
6️⃣ NOTIFICATIONS TABLE
==============================
Manages reminders and alerts.
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY → users.id)
- event_id (UUID, FOREIGN KEY → events.id)
- method (ENUM: 'email', 'push', 'sms')
- send_time (TIMESTAMP, NOT NULL)
- status (ENUM: 'pending', 'sent', 'failed')

==============================
7️⃣ INTEGRATIONS TABLE
==============================
Stores third-party sync data (Google, Microsoft).
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY → users.id)
- provider (ENUM: 'google', 'microsoft')
- access_token (TEXT, NOT NULL)
- refresh_token (TEXT, NOT NULL)
- expires_at (TIMESTAMP, NOT NULL)

==============================
8️⃣ AUDIT LOGS TABLE
==============================
Tracks user actions for security & monitoring.
- id (UUID, PRIMARY KEY)
- user_id (UUID, FOREIGN KEY → users.id)
- action (TEXT, NOT NULL)
- created_at (TIMESTAMP, DEFAULT NOW())

==============================
✅ FUTURE ENHANCEMENTS
==============================
- AI-based event categorization
- Webhooks for real-time sync
- Multi-time zone adjustments

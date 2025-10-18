PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS chefs (
  id          TEXT PRIMARY KEY,                       -- uuid
  name        TEXT NOT NULL,
  city        TEXT NOT NULL,                          -- slug: austin/dallas/...
  specialties TEXT,                                   -- JSON or comma-separated
  bio         TEXT,
  photo_url   TEXT,
  website     TEXT,
  email       TEXT,
  phone       TEXT,

  -- social / platforms
  linkedin    TEXT,
  instagram   TEXT,
  tiktok      TEXT,
  youtube     TEXT,
  facebook    TEXT,
  yelp        TEXT,
  opentable   TEXT,

  status      TEXT NOT NULL DEFAULT 'pending',        -- pending|approved|rejected
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME
);

CREATE INDEX IF NOT EXISTS idx_chefs_city_status ON chefs(city, status);
CREATE INDEX IF NOT EXISTS idx_chefs_created_at   ON chefs(created_at);

CREATE TRIGGER IF NOT EXISTS chefs_set_updated_at
AFTER UPDATE ON chefs
BEGIN
  UPDATE chefs SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

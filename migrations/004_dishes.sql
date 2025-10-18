-- Dishes belong to a Chef. One Chef can have many Dishes.
CREATE TABLE IF NOT EXISTS dishes (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  chef_id       INTEGER NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  price_cents   INTEGER,                    -- store money as cents
  currency      TEXT DEFAULT 'USD',
  categories    TEXT,                       -- CSV or JSON (e.g., ["entree","vegan"])
  tags          TEXT,                       -- CSV or JSON
  active        INTEGER NOT NULL DEFAULT 1, -- 1=true, 0=false
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME
);

CREATE INDEX IF NOT EXISTS idx_dishes_chef_active ON dishes(chef_id, active);
CREATE INDEX IF NOT EXISTS idx_dishes_created_at  ON dishes(created_at);

CREATE TRIGGER IF NOT EXISTS dishes_set_updated_at
AFTER UPDATE ON dishes
BEGIN
  UPDATE dishes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Images for dishes. You can approve/moderate.
CREATE TABLE IF NOT EXISTS dish_images (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  dish_id       INTEGER NOT NULL,
  image_url     TEXT,                        -- or store Cloudflare Images public_id
  public_id     TEXT,                        -- preferred: Cloudflare Images public ID
  is_primary    INTEGER NOT NULL DEFAULT 0,  -- 1=true, only one per dish ideally
  status        TEXT NOT NULL DEFAULT 'approved',  -- pending|approved|rejected
  width         INTEGER,
  height        INTEGER,
  variants_json TEXT,                        -- JSON of named variants if you want
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dish_images_dish_primary ON dish_images(dish_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_dish_images_status       ON dish_images(status);

-- Optional: extra gallery images for chefs (distinct from the main profile)
CREATE TABLE IF NOT EXISTS chef_images (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  chef_id       INTEGER NOT NULL,
  public_id     TEXT,                        -- Cloudflare Images public ID
  caption       TEXT,
  status        TEXT NOT NULL DEFAULT 'approved',
  sort_order    INTEGER DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chef_images_chef ON chef_images(chef_id);
CREATE INDEX IF NOT EXISTS idx_chef_images_stat ON chef_images(status);

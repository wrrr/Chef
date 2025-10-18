-- Toronto
INSERT INTO chefs (id, name, city, specialties, bio, status)
VALUES
  (lower(hex(randomblob(16))), 'Chef Aiko',   'toronto',    '["Sushi","Seasonal"]',     'Modern omakase with Ontario fish when possible.', 'approved'),
  (lower(hex(randomblob(16))), 'Chef Luca',   'toronto',    '["Italian","Pasta"]',      'Hand-rolled pasta and slow sauces.',               'approved');

-- New York
INSERT INTO chefs (id, name, city, specialties, bio, status)
VALUES
  (lower(hex(randomblob(16))), 'Chef Maya',   'new-york',   '["Tasting Menu","Vegan"]', 'Plants-first tasting menus with NYC flair.',       'approved'),
  (lower(hex(randomblob(16))), 'Chef Devon',  'new-york',   '["Steak","Seafood"]',      'Prime cuts, raw bar, and wood fire.',              'approved');

-- Boston
INSERT INTO chefs (id, name, city, specialties, bio, status)
VALUES
  (lower(hex(randomblob(16))), 'Chef Colin',  'boston',     '["Seafood","New England"]','Day-boat catch, chowders, buttery rolls.',         'approved'),
  (lower(hex(randomblob(16))), 'Chef Priya',  'boston',     '["Indian","Street Food"]', 'Regional Indian street snacks, seasonal thalis.',  'approved');

-- Chicago
INSERT INTO chefs (id, name, city, specialties, bio, status)
VALUES
  (lower(hex(randomblob(16))), 'Chef Elena',  'chicago',    '["Pastry","Desserts"]',    'Butter-forward viennoiserie and plated sweets.',   'approved'),
  (lower(hex(randomblob(16))), 'Chef Marco',  'chicago',    '["Grill","Italian"]',      'Live-fire meats and rustic Italian mains.',        'approved');

-- New Orleans
INSERT INTO chefs (id, name, city, specialties, bio, status)
VALUES
  (lower(hex(randomblob(16))), 'Chef Tasha',  'new-orleans','["Creole","Soul"]',        'Creole classics with soulful sides.',              'approved'),
  (lower(hex(randomblob(16))), 'Chef Étienne','new-orleans','["French","Bistro"]',      'French bistro hits with Gulf ingredients.',        'approved');

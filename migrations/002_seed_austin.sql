INSERT INTO chefs (id, name, city, specialties, bio, photo_url, website, email, phone, linkedin, instagram, tiktok, youtube, facebook, yelp, opentable, status)
VALUES
  (lower(hex(randomblob(16))), 'Chef Maria',  'austin',  '["Farm-to-table","Seasonal"]', 'Local, seasonal menus with Texas produce.',        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
  (lower(hex(randomblob(16))), 'Chef Marcus', 'austin',  '["Savory","Steakhouse"]',      'Signature savory mains and fire-kissed steaks.',  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved'),
  (lower(hex(randomblob(16))), 'Chef Ana',    'austin',  '["Pastry","Desserts"]',        'Modern desserts and creative pastry pop-ups.',    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved');

CREATE TABLE users (
  user_uuid varchar(32) PRIMARY KEY,
  username varchar(16),
  email varchar(32),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tierlist (
  tierlist_id integer PRIMARY KEY AUTOINCREMENT,
  owner varchar(32),
  tierlist_name varchar(64),
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_tierlist_sharing (
  tierlist_id integer,
  user_uuid integer,
  can_edit bool,
  FOREIGN KEY(tierlist_id) REFERENCES tierlist(tierlist_id) ON DELETE CASCADE
);

CREATE TABLE item_tierlist_model (
  tierlist_id integer,
  item_id integer,
  rating integer,
  FOREIGN KEY(tierlist_id) REFERENCES tierlist(tierlist_id) ON DELETE CASCADE,
  FOREIGN KEY(item_id) REFERENCES item(item_id) ON DELETE CASCADE
);

CREATE TABLE item (
  item_id integer PRIMARY KEY AUTOINCREMENT,
  item_name string,
  item_img string
);

CREATE TABLE tierlist_tiers (
  tierlist_id integer,
  tier_value integer,
  tier_row_name string,
  FOREIGN KEY(tierlist_id) REFERENCES tierlist(tierlist_id) ON DELETE CASCADE
);

CREATE TABLE tierlist_settings (
  tierlist_id integer,
  visibility integer,
  FOREIGN KEY(tierlist_id) REFERENCES tierlist(tierlist_id) ON DELETE CASCADE,
  FOREIGN KEY(visibility) REFERENCES visibilities(visibility) ON DELETE CASCADE
);

CREATE TABLE visibilities (
  visibility integer PRIMARY KEY AUTOINCREMENT,
  name varchar(8)
);
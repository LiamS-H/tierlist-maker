CREATE TABLE users (
  user_uuid varchar(32) PRIMARY KEY,
  username varchar(16),
  email varchar(32),
  created_at timestamp
);

CREATE TABLE tierlist (
  tierlist_id integer PRIMARY KEY,
  owner varchar(32),
  tierlist_name varchar(64),
  created_at timestamp
);

CREATE TABLE user_tierlist_sharing (
  tierlist_id integer,
  user_uuid integer,
  can_edit bool
);

CREATE TABLE item_tierlist_model (
  tierlist_id integer,
  item_id integer,
  rating integer
);

CREATE TABLE item (
  item_id integer PRIMARY KEY,
  item_name string,
  item_img string
);

CREATE TABLE tierlist_tiers (
  tierlist_id integer,
  tier_value integer,
  tier_row_name string
);

CREATE TABLE tierlist_settings (
  tierlist_id integer,
  visibility integer
);

CREATE TABLE visibilities (
  visibility integer,
  name varchar(8)
);
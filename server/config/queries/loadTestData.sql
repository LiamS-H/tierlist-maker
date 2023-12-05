INSERT INTO users VALUES 
    ("0000", "liamsh", "liamsh@gmail.com", CURRENT_TIMESTAMP, 'admin'),
    ("0001", "elguinp", "elguinp@gmail.com", CURRENT_TIMESTAMP, 'admin')
;

INSERT INTO tierlist VALUES 
    (0, "0000", "Best Games [Public]", CURRENT_TIMESTAMP),
    (1, "0000", "Best Games [Private]", CURRENT_TIMESTAMP),
    (2, "0001", "Best Names [Shared]", CURRENT_TIMESTAMP)
;

INSERT INTO item VALUES 
    (0, "Minecraft", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Minecraft_cube.svg/220px-Minecraft_cube.svg.png"),
    (1, "Roblox", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Roblox_icon_-_2017.svg/2048px-Roblox_icon_-_2017.svg.png"),
    (2, "Fortnite", "https://upload.wikimedia.org/wikipedia/commons/7/7c/Fortnite_F_lettermark_logo.png"),
    (3, "Henry", ""),
    (4, "Bob", ""),
    (5, "Robert", "")
;

INSERT INTO user_tierlist_sharing VALUES 
    (2, "0000", 1)
;

INSERT INTO item_tierlist_model VALUES
    (0, 0, 0),
    (0, 1, 1),
    (0, 2, 2),
    (1, 0, 0),
    (1, 1, 1),
    (1, 2, 2),
    (2, 3, 0),
    (2, 4, 1),
    (2, 5, 2)
;

INSERT INTO tierlist_tiers VALUES
    (0, 0, "S"),
    (0, 1, "C"),
    (0, 2, "F"),
    (1, 0, "Excellent"),
    (1, 1, "Good"),
    (1, 2, "Bad"),
    (2, 0, "Would Name my Baby"),
    (2, 1, "Would not Name my Baby"),
    (2, 2, "Would Bully")
;

INSERT INTO tierlist_settings VALUES
    (0, 0),
    (1, 1),
    (2, 1)
;

INSERT INTO visibilities VALUES
    (0, "Public"),
    (1, "Private")
;
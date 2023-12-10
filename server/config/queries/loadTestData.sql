INSERT INTO users VALUES 
    ("0000", "TierMaker", "tier", CURRENT_TIMESTAMP, 'admin'),
    ("0001", "liamsh", "liamsh@gmail.com", CURRENT_TIMESTAMP, 'admin'),
    ("0002", "elguinp", "elguinp@gmail.com", CURRENT_TIMESTAMP, 'admin')
;

INSERT INTO tierlist VALUES 
    (0, "0000", "Games", CURRENT_TIMESTAMP),
    (1, "0000", "Names", CURRENT_TIMESTAMP),
    (2, "0001", "Best Games", CURRENT_TIMESTAMP),
    (3, "0000", "Best Names [Shared]", CURRENT_TIMESTAMP),
    (4, "0000", "Cereal", CURRENT_TIMESTAMP)
;

INSERT INTO item VALUES 
    (0, "Minecraft", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Minecraft_cube.svg/220px-Minecraft_cube.svg.png"),
    (1, "Roblox", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Roblox_icon_-_2017.svg/2048px-Roblox_icon_-_2017.svg.png"),
    (2, "Fortnite", "https://upload.wikimedia.org/wikipedia/commons/7/7c/Fortnite_F_lettermark_logo.png"),
    (3, "Bob", "https://s.namemc.com/3d/skin/body.png?id=5f54271fa2b63231&model=classic&width=308&height=308"),
    (4, "Noor", "https://s.namemc.com/3d/skin/body.png?id=f5e7b3b473ca8846&model=classic&width=256&height=256"),
    (5, "Alex", "https://s.namemc.com/3d/skin/body.png?id=2c9c829d188b5dc2&model=slim&width=308&height=308"),
    (6, "Reece's Puffs", "https://thecustompackagingboxes.com/wp-content/uploads/2016/07/small-cereal-box.jpg"),
    (7, "Cheerios", "https://target.scene7.com/is/image/Target/GUEST_5090476b-675b-45f6-ade7-9db8c92ecfcf?wid=488&hei=488&fmt=pjpeg"),
    (8, "Rice Krispies", "https://hips.hearstapps.com/hmg-prod/images/rice-krispies-1636598284.jpg"),
    (9,"Grape Nuts","https://pics.walgreens.com/prodimg/526158/900.jpg"),
    (10, "Lucky Charms", "https://i.ebayimg.com/images/g/HeAAAOSw7ptjhZLs/s-l1600.jpg")
;

INSERT INTO user_tierlist_sharing VALUES 
    (3, "0001", 1)
;

INSERT INTO item_tierlist_model VALUES
    (0, 0, 0),
    (0, 1, 1),
    (0, 2, 2),
    (1, 3, 0),
    (1, 4, 1),
    (1, 5, 2),
    (2, 3, 2),
    (2, 4, 1),
    (2, 5, 0),
    (3, 3, 2),
    (3, 4, 1),
    (3, 5, 0),
    (4, 6, 1),
    (4, 7, 1),
    (4, 8, 1),
    (4, 9, 0),
    (4, 10, 1)
;

INSERT INTO tierlist_tiers VALUES
    (0, 0, "S"),
    (0, 1, "C"),
    (0, 2, "F"),
    (1, 0, "Would Name my Baby"),
    (1, 1, "Would not Name my Baby"),
    (1, 2, "Would Bully"),
    (2, 0, "Excellent"),
    (2, 1, "Good"),
    (2, 2, "Bad"),
    (3, 0, "Excellent"),
    (3, 1, "Good"),
    (3, 2, "Bad"),
    (4, 0, "Peak"),
    (4, 1, "Mid"),
    (4, 2, "Hurts to eat")
;

INSERT INTO tierlist_settings VALUES
    (0, 0),
    (1, 0),
    (2, 1),
    (3, 1),
    (4, 0)
;

INSERT INTO visibilities VALUES
    (0, "Public"),
    (1, "Private")
;
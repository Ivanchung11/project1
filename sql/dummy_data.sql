\c bicycle_db
-- ======== users ========
INSERT INTO
    users (name, password, email, created_at)
VALUES
    ('admin', '123', 'admin@gmail.com', now()),
    ('admin1', '123', 'admin1@gmail.com', now());
INSERT INTO
    users (name, password, email, created_at)
VALUES
    ('admin5', '555', 'admin5@gmail.com', now());

-- ======== district ========

INSERT INTO district (name) VALUES ('Central and Western');
INSERT INTO district (name) VALUES ('Wan Chai');
INSERT INTO district (name) VALUES ('Eastern');
INSERT INTO district (name) VALUES ('Southern');
INSERT INTO district (name) VALUES ('Yau Tsim Mong');
INSERT INTO district (name) VALUES ('Sham Shui Po');
INSERT INTO district (name) VALUES ('Kowloon City');
INSERT INTO district (name) VALUES ('Wong Tai Sin');
INSERT INTO district (name) VALUES ('Kwun Tong');
INSERT INTO district (name) VALUES ('Kwai Tsing');
INSERT INTO district (name) VALUES ('Tsuen Wan');
INSERT INTO district (name) VALUES ('Tuen Mun');
INSERT INTO district (name) VALUES ('Yuen Long');
INSERT INTO district (name) VALUES ('North');
INSERT INTO district (name) VALUES ('Tai Po');
INSERT INTO district (name) VALUES ('Sha Tin');
INSERT INTO district (name) VALUES ('Sai Kung');
INSERT INTO district (name) VALUES ('Islands');

-- ======== route ========

-- INSERT INTO
--     route (users_id, route_name, star_district_id, road_bicyle_track, 
--     distance, duration, view_count, public_private, created_at)
-- VALUES
--     (1, '元朗-上水', 1, true, 5, 600, 10, true, '2024-04-30');

-- ======== path_info ========

-- INSERT INTO
--     path_info (route_id,location, ele, time,cumul)
-- VALUES
--     (1,'POINT(-118.4079 33.9434)',4.5,'00:10:50',3.5);
    

-- ======== photo ========

INSERT INTO photo (route_id) VALUES (1);


-- ======== follow ========
INSERT INTO
    follow (follower_id, followee_id)
VALUES
    (1,2);

-- ======== bookmark ========

INSERT INTO bookmark (users_id, route_id) VALUES (1,1);


-- ======== comment ========

INSERT INTO comment (users_id, route_id,content) VALUES (1,1,'this is a nice place');

-- ======== slope ========

-- INSERT INTO slope (path_coordinates) VALUES ('linestring(0 0,1 1)');

-- ======== parking ========

-- INSERT INTO parking (point_coordinates) VALUES ('point(0 0)');


-- ======== water_dispenser ========

-- INSERT INTO water_dispenser (point_coordinates) VALUES ('point(0 0)');


-- ======== blacksite========

-- INSERT INTO blacksite (point_coordinates) VALUES ('point(0 0)');

-- ======== bicycle_track ========

-- INSERT INTO bicycle_track (path_coordinates) VALUES ('linestring(0 0,1 1)');

-- ======== news ========

INSERT INTO news (title, content) VALUES ('welcome ' , 'hello everyone');


-- ======== news_photo ========

INSERT INTO news_photo (news_id) VALUES (1);

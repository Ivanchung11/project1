\c bicycle_db
-- ======== users ========
INSERT INTO
    users (name, password, email, created_at)
VALUES
    ('admin', '123', 'admin@gmail.com', now()),
    ('admin1', '123', 'admin1@gmail.com', now());


-- ======== district ========

INSERT INTO district (name) VALUES ('屯門區');
INSERT INTO district (name) VALUES ('元朗區');
INSERT INTO district (name) VALUES ('荃灣區');
INSERT INTO district (name) VALUES ('葵青區');
INSERT INTO district (name) VALUES ('北區');
INSERT INTO district (name) VALUES ('大埔區');
INSERT INTO district (name) VALUES ('沙田區');
INSERT INTO district (name) VALUES ('離島區');
INSERT INTO district (name) VALUES ('西貢區');
INSERT INTO district (name) VALUES ('深水埗區');
INSERT INTO district (name) VALUES ('黃大仙區');
INSERT INTO district (name) VALUES ('灣仔區');
INSERT INTO district (name) VALUES ('中西區');
INSERT INTO district (name) VALUES ('東區');
INSERT INTO district (name) VALUES ('南區');
INSERT INTO district (name) VALUES ('觀塘區');
INSERT INTO district (name) VALUES ('九龍城區');
INSERT INTO district (name) VALUES ('油尖旺區');


-- ======== route ========

INSERT INTO
    route (users_id, route_name, star_district_id, road_bicyle_track, 
    distance, duration, view_count, public_private, created_at)
VALUES
    (1, '元朗-上水', 1, true, 5, 600, 10, true, '2024-04-30');

-- ======== path_info ========

INSERT INTO
    path_info (route_id,location, ele, time,cumul)
VALUES
    (1,'POINT(-118.4079 33.9434)',4.5,'00:10:50',3.5);
    

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

INSERT INTO slope (path_coordinates) VALUES ('linestring(0 0,1 1)');

-- ======== parking ========

INSERT INTO parking (point_coordinates) VALUES ('point(0 0)');


-- ======== water_dispenser ========

INSERT INTO water_dispenser (point_coordinates) VALUES ('point(0 0)');


-- ======== blacksite========

INSERT INTO blacksite (point_coordinates) VALUES ('point(0 0)');

-- ======== bicycle_track ========

INSERT INTO bicycle_track (path_coordinates) VALUES ('linestring(0 0,1 1)');

-- ======== news ========

INSERT INTO news (title, content) VALUES ('welcome ' , 'hello everyone');


-- ======== news_photo ========

INSERT INTO news_photo (news_id) VALUES (1);

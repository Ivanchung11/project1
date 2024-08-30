\c bicycle_db
-- ======== users ========
INSERT INTO
    users (name, password, email, created_at)
VALUES
    ('admin', '123', 'admin@gmail.com', now());


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
    distance, duration, view_count, public_private, path_info_id, created_at)
VALUES
    (1, '元朗-上水', 1, true, 5, 600, 10, true, 1, '2024-04-30');

-- ======== photo ========

-- INSERT INTO photo (route_id) VALUES (1);


-- ======== follow ========
INSERT INTO
    follow (follower_id, followee_id)
VALUES
    (1,2);

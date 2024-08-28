\c bicycle_db
-- ======== users ========
INSERT INTO
    users (name, password, email)
VALUES
    ('admin', '123', 'alex@gmail.com'),
    ('admin1', '123', 'admin1@gmail.com');
INSERT INTO
    users (name, password, email, created_at)
VALUES
    ('admin5', '555', 'admin5@gmail.com', now());


-- ======== district ========

INSERT INTO district (name) VALUES ('元朗區');


-- ======== route ========

-- INSERT INTO
--     route (users_id, route_name, star_district_id, road_bicyle_track, 
--     distance, duration, view_count, public_private, path_info_id, created_at)
-- VALUES
--     (1, '元朗-上水', 1, true, 5, 600, 10, true, 1, '2024-04-30');

-- ======== photo ========

-- INSERT INTO photo (route_id) VALUES (1);


-- ======== follow ========
INSERT INTO
    follow (follower_id, followee_id)
VALUES
    (1,2);

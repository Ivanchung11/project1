CREATE TABLE users(
    id SERIAL primary key,
    name varchar not null,
    password varchar(255) not null,
    email varchar(255) not null,
    upload_route_count integer null,
    created_at TIMESTAMP with time zone default now()
);
INSERT INTO
    users (name, password, email)
VALUES
    ('admin', '123', 'alex@gmail.com'),
    ('admin1', '123', 'admin1@gmail.com');
INSERT INTO
    users (name, password, email, created_at)
VALUES
    ('admin5', '555', 'admin5@gmail.com', now());



CREATE TABLE follow(
    id SERIAL primary key,
    follower_id integer not null,
    followee_id integer not null,

    foreign key (follower_id) references users (id),
    foreign key (followee_id) references users (id)
);
INSERT INTO
    follow (follower_id, followee_id)
VALUES
    (1,2);



CREATE TABLE district(
    id SERIAL primary key,
    name varchar(255)
);
INSERT INTO district (name) VALUES ('元朗區');



CREATE TABLE route(
    id SERIAL primary key,
    users_id integer not null,
    route_name varchar(255) not null,
    description text null,
    star_district_id integer not null,
    end_district_id integer null,
    road_bicyle_track boolean not null,
    distance integer not null,
    duration integer not null,
    view_count integer null,
    public_private boolean not null,
    path_info_id integer not null,
    created_at TIMESTAMP not null default now(),

    foreign key (users_id) references users (id),
    foreign key (star_district_id) references district (id),
    foreign key (end_district_id) references district (id),
    foreign key (path_info_id) references path_info (id)
);
INSERT INTO
    route (users_id, route_name, star_district_id, road_bicyle_track, 
    distance, duration, view_count, public_private, path_info_id, created_at)
VALUES
    (1, '元朗-上水', 1, true, 5, 600, 10, true, 1, '2024-04-30');
    



CREATE TABLE photo(
    id SERIAL primary key,
    route_id integer not null,
    point_coordinates point null,
    image_path varchar(255) null,

    foreign key (route_id) references route(id)
);
INSERT INTO photo (route_id) VALUES (1);



CREATE TABLE bookmark(
    id SERIAL primary key,
    users_id integer not null,
    route_id integer not null,

    foreign key (users_id) references users(id),
    foreign key (route_id) references route(id)
);
INSERT INTO bookmark (users_id, route_id) VALUES (1,1);



CREATE TABLE comment(
    id SERIAL primary key,
    users_id integer not null,
    route_id integer not null,
    content text null,

    foreign key (users_id) references users(id),
    foreign key (route_id) references route(id)
);
INSERT INTO comment (users_id, route_id,content) VALUES (1,1,'this is a nice place');



CREATE TABLE news(
    id SERIAL primary key,
    title varchar(255) not null,
    content text not null
);
INSERT INTO news (title, content) VALUES ('welcome ' , 'hello everyone');




CREATE TABLE news_photo(
    id SERIAL primary key,
    news_id integer not null,
    image_path varchar(255) null,

    foreign key (news_id) references news(id)
);
INSERT INTO news_photo (news_id) VALUES (1);



CREATE TABLE path_info(
    id SERIAL primary key,
    location GEOGRAPHY(Point, 4326),  
    ele double precision not null,
    time time null,
    cumul double precision not null
);
INSERT INTO
    path_info (location, ele, time,cumul)
VALUES
    ('POINT(-118.4079 33.9434)',4.5,'00:10:50',3.5);
    


CREATE TABLE slope(
    id SERIAL primary key,
    path_coordinates GEOGRAPHY(linestring,4326) not null
);
INSERT INTO slope (path_coordinates) VALUES ('linestring(0 0,1 1)');



CREATE TABLE bicycle_track(
    id SERIAL primary key,
    path_coordinates GEOGRAPHY(linestring,4326) not null
);
INSERT INTO bicycle_track (path_coordinates) VALUES ('linestring(0 0,1 1)');



CREATE TABLE parking(
    id SERIAL primary key,
    point_coordinates GEOGRAPHY(point,4326) not null
);
INSERT INTO parking (point_coordinates) VALUES ('point(0 0)');



CREATE TABLE water_dispenser(
    id SERIAL primary key,
    point_coordinates GEOGRAPHY(point,4326) not null
);
INSERT INTO water_dispenser (point_coordinates) VALUES ('point(0 0)');



CREATE TABLE blacksite(
    id SERIAL primary key,
    point_coordinates GEOGRAPHY(point,4326) not null
);
INSERT INTO blacksite (point_coordinates) VALUES ('point(0 0)');
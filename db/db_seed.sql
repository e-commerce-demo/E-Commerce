create table users (
    user_id serial primary key,
    first_name varchar(20),
    last_name varchar(20),
    email varchar(50),
    password text
);
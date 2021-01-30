create table if not exists users (
	id serial primary key,
	name varchar(100),
	email text unique not null,
	entries bigint default 0,
	joined timestamp not null
);

create table if not exists login (
	id serial primary key,
	hash varchar(100) not null,
	email text unique not null
)

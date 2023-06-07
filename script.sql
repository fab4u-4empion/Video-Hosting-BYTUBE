create table users
(
    u_id          varchar(100)  not null
        primary key,
    u_name        varchar(30)   null,
    u_password    varchar(100)  null,
    u_description varchar(1000) null,
    u_reg_date    date          null
)
    charset = utf8mb4;

create table sessions
(
    s_id      varchar(100) not null
        primary key,
    s_user_id varchar(100) not null,
    s_key     varchar(255) not null,
    constraint pk_s_key
        unique (s_key),
    constraint u_id
        foreign key (s_user_id) references users (u_id)
)
    charset = utf8mb4;

create table subscriptions
(
    s_user_from varchar(100) not null,
    s_user_to   varchar(100) not null,
    constraint subscriptions_pk
        unique (s_user_from, s_user_to),
    constraint subscriptions_users_u_id_fk
        foreign key (s_user_from) references users (u_id),
    constraint subscriptions_users_u_id_fk2
        foreign key (s_user_to) references users (u_id)
)
    charset = utf8mb4;

create fulltext index users_u_name_index
    on users (u_name);

create table videos
(
    v_id           varchar(100)                          not null
        primary key,
    v_user_id      varchar(100)                          not null,
    v_name         varchar(100)                          null,
    v_description  varchar(1000)                         null,
    v_publish_date timestamp   default CURRENT_TIMESTAMP null,
    v_views        int         default 0                 null,
    v_duration     int         default 0                 null,
    v_access       varchar(10) default 'close'           not null,
    constraint videos_users_u_id_fk
        foreign key (v_user_id) references users (u_id)
)
    charset = utf8mb4;

create table comments
(
    c_id       varchar(36)                        not null
        primary key,
    c_user_id  varchar(100)                       not null,
    c_video_id varchar(100)                       not null,
    c_date     datetime default CURRENT_TIMESTAMP not null,
    c_text     varchar(1000)                      null,
    constraint comments_users_u_id_fk
        foreign key (c_user_id) references users (u_id),
    constraint comments_videos_v_id_fk
        foreign key (c_video_id) references videos (v_id)
)
    charset = utf8mb4;

create table likes
(
    l_user_id  varchar(100)                       not null,
    l_video_id varchar(100)                       not null,
    l_date     datetime default CURRENT_TIMESTAMP not null,
    constraint likes_users_u_id_fk
        foreign key (l_user_id) references users (u_id),
    constraint likes_videos_v_id_fk
        foreign key (l_video_id) references videos (v_id)
)
    charset = utf8mb4;

create fulltext index videos_v_name_index
    on videos (v_name);

create table views
(
    view_user_id  varchar(100) not null,
    view_video_id varchar(100) not null,
    view_date     date         not null,
    view_time     time         not null,
    primary key (view_video_id, view_user_id, view_date),
    constraint views_users_u_id_fk
        foreign key (view_user_id) references users (u_id),
    constraint views_videos_v_id_fk
        foreign key (view_video_id) references videos (v_id)
)
    charset = utf8mb4;

create
    definer = root@localhost function check_access(user_id varchar(36), video_id varchar(36)) returns tinyint(1)
    deterministic
BEGIN
	declare access_count INT;
    select count(*) into access_count from videos where 
		(v_id=video_id AND v_access="open") 
        OR (v_id=video_id AND v_user_id=user_id);
	if access_count > 0 then
		return true;
	else
		RETURN false;
	end if;
END;



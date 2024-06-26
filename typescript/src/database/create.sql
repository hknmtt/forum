CREATE TABLE IF NOT EXISTS User (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT CHECK( LENGTH(username) <= 16 ) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT CHECK ( role IN ('ADMIN', 'MODERATOR', 'USER') ) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    disabled BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS Post (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title TEXT CHECK( LENGTH(title) <= 64 ) NOT NULL,
    body TEXT CHECK ( LENGTH(body) <= 1000 ) NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    edited BOOLEAN NOT NULL DEFAULT FALSE,
    edit_author_id INTEGER REFERENCES User,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_bumped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER REFERENCES User
);

CREATE TABLE IF NOT EXISTS Comment (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL REFERENCES Post,
    body TEXT CHECK ( LENGTH(body) <= 1000 ) NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    edited BOOLEAN NOT NULL DEFAULT FALSE,
    edit_author_id INTEGER REFERENCES User,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER REFERENCES User
);

CREATE TABLE IF NOT EXISTS PostLike (
    id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES User ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES Post ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CommentLike (
    id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES User ON DELETE CASCADE,
    comment_id INTEGER NOT NULL REFERENCES Comment ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ADMINCONFIG (
    id INTEGER PRIMARY KEY,
    maintenance_message TEXT CHECK( LENGTH(maintenance_message) <= 1000 ),
    maintenance BOOLEAN NOT NULL DEFAULT FALSE,
    registration BOOLEAN NOT NULL DEFAULT TRUE,
    post_creation BOOLEAN NOT NULL DEFAULT TRUE,
    comment_creation BOOLEAN NOT NULL DEFAULT TRUE,
    post_editing BOOLEAN NOT NULL DEFAULT TRUE,
    comment_editing BOOLEAN NOT NULL DEFAULT TRUE
);

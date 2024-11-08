﻿CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE User (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Primary Key
    UserName VARCHAR(255) NOT NULL UNIQUE,     -- Unique Username
    UserPassword VARCHAR(255) NOT NULL,        -- Password
    FullName TEXT,                             -- Full name
    DOB DATETIME,                              -- Date of Birth
    Email VARCHAR(255) UNIQUE,                 -- Unique Email
    BIO TEXT                                   -- Bio
);

CREATE TABLE MovieListEntry (
    EntryId INTEGER PRIMARY KEY AUTOINCREMENT,  -- Primary Key
    UserId INTEGER,                             -- Foreign Key to User(UserID)
    MovieTitle VARCHAR(255),                    -- Title of the movie
    MovieGenre VARCHAR(255),                    -- Genre of the movie
    MoviePosterPath TEXT,                       -- Path or URL to movie poster
    Status VARCHAR(50),                         -- Watch status (e.g., watched, planning)
    IsFavorite BOOLEAN,                         -- Favorite movie flag
    Notes TEXT,                                 -- User's notes about the movie
    UserRating REAL,                            -- User's rating for the movie
    DateAdded DATETIME,                         -- Date and time entry was added
    FOREIGN KEY (UserId) REFERENCES User(UserId) -- Foreign Key relationship
);
CREATE TABLE Social (
    PostID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Primary Key
    UserID INTEGER,                           -- Foreign Key to User(UserID)
    MovieID INTEGER,                          -- Foreign Key reference to an API Movie ID
    Description VARCHAR(255),                 -- Description of the post
    Title VARCHAR(255),                       -- Title of the post
    MoviePosterPath TEXT,                       -- Path or URL to movie poster
    DateTime DATETIME,                        -- Date and time of the post
    Comments INTEGER,                            -- Number of Comments on Post
    NumberOfLikes INTEGER,                    
    FOREIGN KEY (UserID) REFERENCES User(UserID) -- Foreign Key relationship
);

CREATE TABLE Comments (
    CommentID INTEGER PRIMARY KEY AUTOINCREMENT, -- Primary Key
    UserID INTEGER,                              -- Foreign Key 
    PostID INTEGER,                             -- Foreign Key reference to the PostID
    CommentText VARCHAR(255),                   -- Description of the comment
    DateTime DATETIME,                              -- Date and Time of the Comment
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE, -- Foreign Key Relationship
    FOREIGN KEY (PostID) REFERENCES Social(PostID) ON DELETE CASCADE -- Foreign Key Relationship
);


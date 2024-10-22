CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE User (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Primary Key
    UserName VARCHAR(255) NOT NULL,            -- Username
    UserPassword VARCHAR(255) NOT NULL,        -- Password
    FullName TEXT,                             -- Full name
    DOB DATETIME,                                  -- Date of Birth
    Email VARCHAR(255) UNIQUE,                 -- Unique Email
    BIO TEXT                                   -- Bio
);

CREATE TABLE MyMovieList (
    MyListID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Primary Key
    UserID INTEGER,                              -- Foreign Key to User(UserID)
    MovieID INTEGER,                            -- Foreign Key reference to an API Movie ID
    WatchStatus BOOLEAN,                         -- Boolean for Watch Status
    IsFavourite BOOLEAN,                         -- Favorite movie
    Comments TEXT,                              -- Most common genre
    MovieRating REAL,                            -- Floating point rating
    FOREIGN KEY (UserID) REFERENCES User(UserID) -- Foreign Key relationship
);
CREATE TABLE Social (
    PostID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Primary Key
    UserID INTEGER,                           -- Foreign Key to User(UserID)
    MovieID INTEGER,                          -- Foreign Key reference to an API Movie ID
    Description VARCHAR(255),                 -- Description of the post
    Title VARCHAR(255),                       -- Title of the post
    DateTime DATE,                        -- Date and time of the post
    Comments TEXT,                            -- Comments on the post
    NumberOfLikes INTEGER,                    
    FOREIGN KEY (UserID) REFERENCES User(UserID) -- Foreign Key relationship
);

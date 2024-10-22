
-- Enable Foreign Key constraints in SQLite
PRAGMA foreign_keys = ON;

-- Create the User table
CREATE TABLE User (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Primary Key
    UserName VARCHAR(255) NOT NULL,            -- Username
    UserPassword VARCHAR(255) NOT NULL,        -- Password
    FullName TEXT,                             -- Full name
    DOB DATE,                                  -- Date of Birth
    Email VARCHAR(255) UNIQUE,                 -- Unique Email
    ProfileIMG TEXT,                           -- Profile image (as text or URL)
    BIO TEXT                                   -- Bio
);

-- Create the MyMovieList table
CREATE TABLE MyMovieList (
    MyListID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Primary Key
    UserID INTEGER,                              -- Foreign Key to User(UserID)
    MovieIDs INTEGER,                            -- Foreign Key reference to an API Movie ID
    WatchStatus BOOLEAN,                         -- Boolean for Watch Status
    FavouriteMovie VARCHAR(255),                 -- Favorite movie
    MostGenre TEXT,                              -- Most common genre
    MostMood TEXT,                               -- Most common mood
    MovieRating REAL,                            -- Floating point rating
    FOREIGN KEY (UserID) REFERENCES User(UserID) -- Foreign Key relationship
);

-- Create the Social table
CREATE TABLE Social (
    PostID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Primary Key
    UserID INTEGER,                           -- Foreign Key to User(UserID)
    MovieID INTEGER,                          -- Foreign Key reference to an API Movie ID
    Description VARCHAR(255),                 -- Description of the post
    Title VARCHAR(255),                       -- Title of the post
    DateTime DATETIME,                        -- Date and time of the post
    Comments TEXT,                            -- Comments on the post
    FOREIGN KEY (UserID) REFERENCES User(UserID) -- Foreign Key relationship
);
CREATE TABLE sqlite_sequence(name,seq);
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
    DateTime DATE,                        -- Date and time of the post
    Comments TEXT,                            -- Comments on the post
    NumberOfLikes INTEGER,                    
    FOREIGN KEY (UserID) REFERENCES User(UserID) -- Foreign Key relationship
);

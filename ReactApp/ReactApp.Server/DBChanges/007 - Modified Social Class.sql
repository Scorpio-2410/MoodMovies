CREATE TABLE sqlite_sequence(name, seq);
 
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

    FOREIGN KEY (UserId) REFERENCES User(UserID) -- Foreign Key relationship to User table

);
 
CREATE TABLE Post (

    PostID INTEGER PRIMARY KEY AUTOINCREMENT,          -- Primary Key

    UserID INTEGER,                                    -- Foreign Key to User(UserID)

    MovieID INTEGER,                                   -- Foreign Key to MovieListEntry(EntryId)

    PostDateTime DATETIME DEFAULT CURRENT_TIMESTAMP,   -- Date and time of the post

    NumberOfLikes INT DEFAULT 0,                       -- Number of likes

    NumberOfDislikes INT DEFAULT 0,                    -- Number of dislikes

    FOREIGN KEY (UserID) REFERENCES User(UserID)       -- Foreign Key relationship to User table

    ON DELETE CASCADE ON UPDATE CASCADE,               -- Cascade on delete/update for User

    FOREIGN KEY (MovieID) REFERENCES MovieListEntry(EntryId) -- Foreign Key to MovieListEntry's EntryId

    ON DELETE SET NULL ON UPDATE CASCADE               -- Set MovieID to NULL if movie entry is deleted, cascade on update

);

 
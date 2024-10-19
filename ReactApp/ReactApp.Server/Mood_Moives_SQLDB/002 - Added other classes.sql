CREATE TABLE User (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserName TEXT NOT NULL,
    UserPassword TEXT NOT NULL,
    FullName TEXT,
    DOB TEXT,  -- Using TEXT for dates as SQLite doesn't have a native DATE type
    Email TEXT UNIQUE,
    ProfileIMG TEXT,  -- Store image paths or URLs as TEXT
    BIO TEXT
);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE Social (
    PostID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER,
    MovieID INTEGER,  -- Not a foreign key, just a reference to API movie data
    Description TEXT,
    Title TEXT,
    DateTime TEXT,
    Comments TEXT,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);
CREATE TABLE MyMovieList (
    MyListID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER,
    MovieIDs TEXT,
    FavouriteMovie TEXT,
    MostGenre TEXT,
    MostMood TEXT,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ReactApp.Server.Models;

public partial class MoodMoviesContext : DbContext
{
    public MoodMoviesContext()
    {
    }

    public MoodMoviesContext(DbContextOptions<MoodMoviesContext> options)
        : base(options)
    {
    }

    public virtual DbSet<MyMovieList> MyMovieLists { get; set; }

    public virtual DbSet<Social> Socials { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlite("Data Source=mood_movies.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MyMovieList>(entity =>
        {
            entity.HasKey(e => e.MyListId);

            entity.ToTable("MyMovieList");

            entity.Property(e => e.MyListId).HasColumnName("MyListID");
            entity.Property(e => e.IsFavourite).HasColumnType("BOOLEAN");
            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.WatchStatus).HasColumnType("BOOLEAN");

            entity.HasOne(d => d.User).WithMany(p => p.MyMovieLists).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<Social>(entity =>
        {
            entity.HasKey(e => e.PostId);

            entity.ToTable("Social");

            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.DateTime).HasColumnType("DATETIME");
            entity.Property(e => e.Description).HasColumnType("VARCHAR(255)");
            entity.Property(e => e.MovieId).HasColumnName("MovieID");
            entity.Property(e => e.Title).HasColumnType("VARCHAR(255)");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Socials).HasForeignKey(d => d.UserId);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("User");

            entity.HasIndex(e => e.Email, "IX_User_Email").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Bio).HasColumnName("BIO");
            entity.Property(e => e.Dob)
                .HasColumnType("DATE")
                .HasColumnName("DOB");
            entity.Property(e => e.Email).HasColumnType("VARCHAR(255)");
            entity.Property(e => e.ProfileImg).HasColumnName("ProfileIMG");
            entity.Property(e => e.UserName).HasColumnType("VARCHAR(255)");
            entity.Property(e => e.UserPassword).HasColumnType("VARCHAR(255)");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

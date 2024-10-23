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

    public virtual DbSet<MovieListEntry> MovieListEntries { get; set; }

    public virtual DbSet<Social> Socials { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlite("Data Source=mood_movies.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MovieListEntry>(entity =>
        {
            entity.HasKey(e => e.EntryId);

            entity.ToTable("MovieListEntry");

            entity.Property(e => e.DateAdded).HasColumnType("DATETIME");
            entity.Property(e => e.IsFavorite).HasColumnType("BOOLEAN");
            entity.Property(e => e.MovieGenre).HasColumnType("VARCHAR(255)");
            entity.Property(e => e.MovieTitle).HasColumnType("VARCHAR(255)");
            entity.Property(e => e.Status).HasColumnType("VARCHAR(50)");

            entity.HasOne(d => d.User).WithMany(p => p.MovieListEntries).HasForeignKey(d => d.UserId);
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

            entity.HasIndex(e => e.UserName, "IX_User_UserName").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Bio).HasColumnName("BIO");
            entity.Property(e => e.Dob)
                .HasColumnType("DATETIME")
                .HasColumnName("DOB");
            entity.Property(e => e.Email).HasColumnType("VARCHAR(255)");
            entity.Property(e => e.UserName).HasColumnType("VARCHAR(255)");
            entity.Property(e => e.UserPassword).HasColumnType("VARCHAR(255)");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

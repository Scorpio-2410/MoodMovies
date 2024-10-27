using System;
using System.Collections.Generic;

namespace ReactApp.Server.Models;

public partial class MovieListEntry
{
    public int EntryId { get; set; }

    public int? UserId { get; set; }

    public string? MovieTitle { get; set; }

    public string? MovieGenre { get; set; }

    public string? MoviePosterPath { get; set; }

    public string? Status { get; set; }

    public bool? IsFavorite { get; set; }

    public string? Notes { get; set; }

    public double? UserRating { get; set; }

    public DateTime? DateAdded { get; set; }

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

    public virtual User? User { get; set; }
}

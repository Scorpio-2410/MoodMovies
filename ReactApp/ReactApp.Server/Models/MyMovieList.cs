using System;
using System.Collections.Generic;

namespace ReactApp.Server.Models;

public partial class MyMovieList
{
    public int MyListId { get; set; }

    public int? UserId { get; set; }

    public int? MovieIds { get; set; }

    public bool? WatchStatus { get; set; }

    public string? FavouriteMovie { get; set; }

    public string? MostGenre { get; set; }

    public string? MostMood { get; set; }

    public double? MovieRating { get; set; }

    public virtual User? User { get; set; }
}

using System;
using System.Collections.Generic;

namespace ReactApp.Server.Models;

public partial class MyMovieList
{
    public int MyListId { get; set; }

    public int? UserId { get; set; }

    public int? MovieId { get; set; }

    public bool? WatchStatus { get; set; }

    public bool? IsFavourite { get; set; }

    public string? Comments { get; set; }

    public double? MovieRating { get; set; }

    public virtual User? User { get; set; }
}

using System;
using System.Collections.Generic;

namespace ReactApp.Server.Models;

public partial class Post
{
    public int PostId { get; set; }

    public int UserId { get; set; }

    public int MovieId { get; set; }

    public DateTime? PostDateTime { get; set; }

    public int? NumberOfLikes { get; set; }

    public int? NumberOfDislikes { get; set; }

    public string? MovieThoughts { get; set; }

    public virtual User? User { get; set; } = null!;
}

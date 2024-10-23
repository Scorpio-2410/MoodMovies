using System;
using System.Collections.Generic;

namespace ReactApp.Server.Models;

public partial class Social
{
    public int PostId { get; set; }

    public int? UserId { get; set; }

    public int? MovieId { get; set; }

    public string? Description { get; set; }

    public string? Title { get; set; }

    public DateTime? DateTime { get; set; }

    public string? Comments { get; set; }

    public int? NumberOfLikes { get; set; }

    public virtual User? User { get; set; }
}

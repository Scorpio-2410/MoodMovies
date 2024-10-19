using System;
using System.Collections.Generic;

namespace ReactApp.Server.Models;

public partial class User
{
    public int UserId { get; set; }

    public string UserName { get; set; } = null!;

    public string UserPassword { get; set; } = null!;

    public string? FullName { get; set; }

    public DateTime? Dob { get; set; }

    public string? Email { get; set; }

    public string? ProfileImg { get; set; }

    public string? Bio { get; set; }

    public virtual ICollection<MyMovieList> MyMovieLists { get; set; } = new List<MyMovieList>();

    public virtual ICollection<Social> Socials { get; set; } = new List<Social>();
}

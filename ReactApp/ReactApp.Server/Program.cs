using Microsoft.EntityFrameworkCore;
using ReactApp.Server.Models;
using MediatR;
using FluentValidation;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using ReactApp.Server.Features.Users;
using ReactApp.Server.Features.MovieListEntries;
using ReactApp.Server.Features.Posts;

namespace ReactApp.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers().AddNewtonsoftJson();

            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressInferBindingSourcesForParameters = true;
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<MoodMoviesContext>(options =>
                options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddMediatR(typeof(Program).Assembly);

            builder.Services.AddValidatorsFromAssemblyContaining<Program>();

            // Register the generic repository
            builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],  
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            builder.Services.AddAuthorization();

            builder.Services.AddScoped<IMovieListEntryService, MovieListEntryService>();
            builder.Services.AddScoped<IPostService, PostService>();




            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication(); 

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}

using Microsoft.EntityFrameworkCore;
using ReactApp.Server.Models;
using MediatR;
using FluentValidation;
using ReactApp.Server.Infrastructure.Middlewares;  
using ReactApp.Server.Infrastructure.Validations; 
using Microsoft.AspNetCore.Mvc;

namespace ReactApp.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers().AddNewtonsoftJson();  // Enable Newtonsoft.Json
            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressInferBindingSourcesForParameters = true; 
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Configure database context with SQLite
            builder.Services.AddDbContext<MoodMoviesContext>(options =>
                options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Register MediatR for handling commands and queries
            builder.Services.AddMediatR(typeof(Program).Assembly);

            // Register FluentValidation and the validation pipeline
            builder.Services.AddValidatorsFromAssemblyContaining<Program>();
            builder.Services.Decorate(typeof(IRequestHandler<,>), typeof(FluentValidationPipeline<,>));

            // You can add any other application-specific services here if needed

            // Build the application
            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Authorization middleware
            app.UseAuthorization();

            // Register middleware (add any custom middleware like error handling)
            app.UseMiddleware<ErrorHandlingMiddleware>();  // Assuming you have an error handling middleware

            // Map controllers
            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}


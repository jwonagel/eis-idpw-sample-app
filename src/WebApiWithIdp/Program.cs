using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

#region logging

builder.Logging.ClearProviders();
var logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()
    .CreateLogger();
builder.Logging.AddSerilog(logger);
builder.Host.UseSerilog(logger);

#endregion

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    o.Authority = "https://devidp-eis.egeli-apps.dev";
    o.Audience = "https://devidp-eis.egeli-apps.dev/resources";

    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = "https://devidp-eis.egeli-apps.dev",
        ValidAudience = "https://devidp-eis.egeli-apps.dev/resources",

        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});

const string adminOnly = "AdminOnly";

builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy(adminOnly, pol =>
    {
        pol.RequireClaim("admin", "true");
    });
});

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

var app = builder.Build();

app.UseSerilogRequestLogging();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () =>
    Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = new[]
            {
                "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
            }[Random.Shared.Next(summaries.Length)]
        })
        .ToArray())
    .RequireAuthorization(adminOnly);

app.Run();


public class WeatherForecast
{
    public DateTime Date { get; set; }
    public int TemperatureC { get; set; }
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
    public string? Summary { get; set; }
}

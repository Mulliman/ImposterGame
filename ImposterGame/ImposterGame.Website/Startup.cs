using ImposterGame.CosmosDb;
using ImposterGame.CosmosDb.Config;
using ImposterGame.Game;
using ImposterGame.Game.OptionGrids;
using ImposterGame.Game.Players;
using ImposterGame.Website.Controllers.Exceptions;
using ImposterGame.Website.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.IO;

namespace ImposterGame.Website
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;

        public Startup(IConfiguration configuration, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddJsonFile($"cosmos.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();

            //Configuration = configuration;
            _env = env;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("defaultcors", builder =>
            {
                builder.AllowAnyMethod()
                       .AllowAnyHeader()
                       .WithOrigins(Configuration.GetValue<string>("AllowedClientUrls").Split("|"))
                       .AllowCredentials();
            }));

            services.AddOptions();

            services.AddControllers(options => options.CacheProfiles.Add("DefaultNoCache",
                new CacheProfile()
                {
                    Duration = 0,
                    Location = ResponseCacheLocation.None,
                    NoStore = true
                })
            );
            services.AddMemoryCache();

            services.Configure<CosmosConfig>(Configuration.GetSection("CosmosConfig"));

            services.AddTransient<IGameNotifier, GameNotifier>();
            var path = Path.Combine(_env.ContentRootPath, "App_Data/OptionGrids");
            services.AddSingleton<IOptionGridService>(new OptionGridService(new[] { new ImposterGame.OptionGrids.FileBased.FileBasedGridProvider(path) }));
            services.AddTransient<IPlayerService, CosmosDbAndInMemoryPlayerService>();
            services.AddTransient<IGameRepository, CosmosDbGameRepository>();
            services.AddTransient<IGameService, GameService>();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Imposter API", Version = "v1" });
            });

            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                string swaggerJsonBasePath = string.IsNullOrWhiteSpace(c.RoutePrefix) ? "." : "..";
                c.SwaggerEndpoint($"{swaggerJsonBasePath}/swagger/v1/swagger.json", "Imposter API");
            });

            app.UseCors("defaultcors");

            app.UseMiddleware<ApiExceptionMiddleware>();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

                endpoints.MapHub<GameHub>("/hubs/gamehub");
            });



            //app.UseEndpoints(endpoints =>
            //{
            //    endpoints.MapControllers();
            //});
        }
    }
}
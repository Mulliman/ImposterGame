using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ImposterGame.Game;
using ImposterGame.Game.OptionGrids;
using ImposterGame.Game.Players;
using ImposterGame.OptionGrids;
using ImposterGame.Website.Controllers.Exceptions;
using ImposterGame.Website.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace ImposterGame.Website
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("defaultcors", builder =>
            {
                builder.AllowAnyMethod()
                       .AllowAnyHeader()
                       .WithOrigins(Configuration.GetValue<string>("AllowedClientUrls"))
                       .AllowCredentials();
            }));

            services.AddControllers();
            services.AddMemoryCache();
            
            services.AddSingleton(new OptionGridService(new[] { new HardcodedGridProvider() }));
            services.AddTransient<IPlayerService, InMemoryPlayerService>();
            services.AddTransient<IGameService, InMemoryGameService>();

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
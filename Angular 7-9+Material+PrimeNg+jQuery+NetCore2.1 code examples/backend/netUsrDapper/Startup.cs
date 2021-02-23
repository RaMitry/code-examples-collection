using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using netUsrDapper.Data;
using System.Text;

namespace netUsrDapper
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = "http://localhost:64713",
                        ValidAudience = "http://localhost:4200",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"))
                    };
                });

            services
                .AddCors(options =>
                {
                    options.AddPolicy(MyAllowSpecificOrigins,
                    builder =>
                    {
                        builder.WithOrigins("http://localhost")
                                            .AllowAnyHeader()
                                            .AllowAnyMethod();
                    });
                })                
                .AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            var configBuilder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json");
            var config = configBuilder.Build();


            services.AddTransient<IUserPlansProvider>(f => new UserPlansProvider(config["ConnectionString:netUsrDapper"]));
            services.AddTransient<IUserPlansProcessor>(f => new UserPlansProcessor(config["ConnectionString:netUsrDapper"]));

            services.AddTransient<ICounterCountProvider>(f => new CounterCountProvider(config["ConnectionString:netUsrDapper"]));
            services.AddTransient<ICounterCountProcessor>(f => new CounterCountProcessor(config["ConnectionString:netUsrDapper"]));

            services.AddTransient<IAppUserProvider>(f => new AppUserProvider(config["ConnectionString:netUsrDapper"]));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.Use(async (c, n) => {
                    c.Response.Headers.Add("SameSite", "None-requires-Secure");
                    await n.Invoke();
                });
        }
            else
            {
                app.UseHsts();
            }

            app.UseAuthentication();

            app.UseCors(MyAllowSpecificOrigins);

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}

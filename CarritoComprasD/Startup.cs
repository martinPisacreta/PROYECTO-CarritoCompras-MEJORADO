using AutoMapper;
using CarritoComprasD.Entities;
using CarritoComprasD.Helpers.AppSettings;
using CarritoComprasD.Middleware;
using CarritoComprasD.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace CarritoComprasD
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

            //string name = "CarritoComprasDataBaseTest";
            string name = "CarritoComprasDataBase";
            services.AddDbContext<CarritoComprasWebContext>(options => options.UseSqlServer(Configuration.GetConnectionString(name)));
          
            services.AddCors();
            services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.IgnoreNullValues = true);
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddSwaggerGen();

            services.AddControllers().AddNewtonsoftJson(x =>x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            // configure strongly typed settings object
            services.Configure<_DomainName>(Configuration.GetSection("DomainName"));
            services.Configure<_Email>(Configuration.GetSection("Email"));
            services.Configure<_Email_Destino_Pedido>(Configuration.GetSection("Email_Destino_Pedido"));
            services.Configure<_Jwt>(Configuration.GetSection("Jwt"));
            services.Configure<_Upload_Image>(Configuration.GetSection("Upload_Image"));
            services.Configure<_WebApiQueCorreEnPcMaxi>(Configuration.GetSection("WebApiQueCorreEnPcMaxi"));

            // configure DI for application services
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IUsuarioPedidoService, UsuarioPedidoService>();
            services.AddScoped<IArticulosUploadImageService, ArticulosUploadImageService>();
            services.AddScoped<IEmpresaService, EmpresaService>();
            services.AddScoped<IMarcaService, MarcaService>();
            services.AddScoped<IFamiliaService, FamiliaService>();
            services.AddScoped<IArticuloService,ArticuloService>();
            

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, CarritoComprasWebContext context)
        {

            // migrate database changes on startup (includes initial db creation)
            context.Database.Migrate();

            // generated swagger json and swagger ui middleware
            app.UseSwagger();
            app.UseSwaggerUI(x => x.SwaggerEndpoint("/swagger/v1/swagger.json", "Carrito Compras Core Encendido_Alsina.csproj"));

            

            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();


            // global cors policy
            app.UseCors(x => x
                .SetIsOriginAllowed(origin => true)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());

            // global error handler
            app.UseMiddleware<ErrorHandlerMiddleware>();

            // custom jwt auth middleware
            app.UseMiddleware<JwtMiddleware>();

            app.UseEndpoints(x => x.MapControllers());
 
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {

                    //spa.UseReactDevelopmentServer(npmScript: "start");
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
                }
            });
        }
    }
}



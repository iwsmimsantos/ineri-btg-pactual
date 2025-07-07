using Microsoft.EntityFrameworkCore;
using INERI.Backend.Data;
using INERI.Backend.Repositories;
using INERI.Backend;
using INERI.Backend.Services;
using INERI.Backend.Services.Interfaces;
using DotNetEnv;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

try
{
    // Carrega as variáveis de ambiente do arquivo .env
    Env.Load();
    
    var builder = WebApplication.CreateBuilder(args);

    // Configura logging detalhado
    builder.Logging.ClearProviders();
    builder.Logging.AddConsole();
    builder.Logging.SetMinimumLevel(LogLevel.Debug);

    // Configure JWT Authentication
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = builder.Configuration["Clerk:Issuer"];
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ClockSkew = TimeSpan.Zero
            };
            options.RequireHttpsMetadata = false; // Para desenvolvimento local
            options.BackchannelHttpHandler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
            };
        });

    // Adiciona serviços ao contêiner.
    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        });

    // Saiba mais sobre como configurar o Swagger/OpenAPI em https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // Constrói a string de conexão a partir das variáveis de ambiente
    var connectionString = $"Host={Environment.GetEnvironmentVariable("DB_HOST")};" +
                             $"Database={Environment.GetEnvironmentVariable("DB_NAME")};" +
                             $"Username={Environment.GetEnvironmentVariable("DB_USER")};" +
                             $"Password={Environment.GetEnvironmentVariable("DB_PASSWORD")};" +
                             $"Port={Environment.GetEnvironmentVariable("DB_PORT")};" +
                             "SSL Mode=Require;Trust Server Certificate=true";

    // Log da string de conexão (com senha mascarada)
    var maskedConnectionString = connectionString.Contains("Password=") 
        ? System.Text.RegularExpressions.Regex.Replace(connectionString, @"Password=.*?;", "Password=***;") 
        : connectionString;
    Console.WriteLine($"Usando a string de conexão: {maskedConnectionString}");

    // Adiciona o DbContext com logging detalhado
    builder.Services.AddDbContext<InvestmentDbContext>(options =>
    {
        options.UseNpgsql(connectionString);
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
        options.LogTo(Console.WriteLine, LogLevel.Information);
    });

    // Adiciona os serviços de Repositório
    builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
    builder.Services.AddScoped<IClientRepository, ClientRepository>();
    builder.Services.AddScoped<IAssetRepository, AssetRepository>();
    builder.Services.AddScoped<IAdvisorRepository, AdvisorRepository>();

    // Adiciona a camada de Serviço
    builder.Services.AddScoped<IAssetService, AssetService>();
    builder.Services.AddScoped<IRiskProfileService, RiskProfileService>();
    builder.Services.AddScoped<ClientService>();
    builder.Services.AddScoped<AdvisorService>();
    builder.Services.AddScoped<IClientClassificationService, ClientClassificationService>();
    builder.Services.AddScoped<IRecommendationService, RecommendationService>();

    // Adiciona o AutoMapper
    builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

    // Adiciona o CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAll",
            policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            });
    });

    var app = builder.Build();

    // Configura o middleware de tratamento de erros
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            var exceptionHandlerFeature = context.Features.Get<IExceptionHandlerFeature>();
            if (exceptionHandlerFeature != null)
            {
                var exception = exceptionHandlerFeature.Error;
                // Log do erro
                var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogError(exception, "Ocorreu um erro não tratado.");
                
                await context.Response.WriteAsJsonAsync(new
                {
                    Message = "Ocorreu um erro inesperado.",
                    ExceptionMessage = exception.Message,
                    // Incluir StackTrace apenas em desenvolvimento para segurança
                    StackTrace = app.Environment.IsDevelopment() ? exception.StackTrace : null 
                });
            }
        });
    });

    // Configura o pipeline de requisições HTTP.
    app.UseSwagger();
    app.UseSwaggerUI();
    
    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseCors("AllowAll");

    app.UseAuthentication();
    app.UseAuthorization();

    // Adiciona rota raiz
    app.MapGet("/", () => new {
        message = "INERI Investment API is running!",
        swagger = "/swagger",
        endpoints = new {
            clientes = "/api/clientes",
            health = "/health"
        },
        version = "1.0.0"
    });

    // Adiciona endpoint de health check
    app.MapGet("/health", () => new { status = "healthy", timestamp = DateTime.UtcNow });

    app.MapControllers();

    // NOTA: O banco de dados será criado/atualizado via migrações do EF
    // Rode: dotnet ef database update

    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine("A inicialização da aplicação falhou!");
    Console.WriteLine($"Erro: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
    throw;
}
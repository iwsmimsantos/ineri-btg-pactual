using Microsoft.EntityFrameworkCore;
using INERI.Backend.Models;

namespace INERI.Backend.Data;

public class InvestmentDbContext : DbContext
{
    public InvestmentDbContext(DbContextOptions<InvestmentDbContext> options) : base(options) { }

    public DbSet<Advisor> Advisors { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<Asset> Assets { get; set; }
    public DbSet<Investment> Investments { get; set; }
    public DbSet<DeclaredRiskHistory> DeclaredRiskHistories { get; set; }
    public DbSet<CalculatedRiskHistory> CalculatedRiskHistories { get; set; }
    public DbSet<Recommendation> Recommendations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Advisor
        modelBuilder.Entity<Advisor>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CategoriaAssessor)
                .HasConversion<string>();

            entity.HasIndex(e => e.Email)
                .IsUnique();
        });

        // Configure Client
        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasIndex(e => e.Cpf)
                .IsUnique();

            entity.HasIndex(e => e.Email)
                .IsUnique();

            entity.HasOne(e => e.Assessor)
                .WithMany(a => a.Clientes)
                .HasForeignKey(e => e.AssessorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Asset
        modelBuilder.Entity<Asset>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasIndex(e => e.Codigo)
                .IsUnique();
        });

        // Configure Investment
        modelBuilder.Entity<Investment>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.Cliente)
                .WithMany(c => c.Investimentos)
                .HasForeignKey(e => e.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Ativo)
                .WithMany(a => a.Investimentos)
                .HasForeignKey(e => e.AtivoId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure DeclaredRiskHistory
        modelBuilder.Entity<DeclaredRiskHistory>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.RespostasQuestionarioJson)
                .HasColumnType("jsonb");

            entity.HasOne(e => e.Cliente)
                .WithMany(c => c.HistoricosRiscoDeclarado)
                .HasForeignKey(e => e.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure CalculatedRiskHistory
        modelBuilder.Entity<CalculatedRiskHistory>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.DadosCalculoJson)
                .HasColumnType("jsonb");

            entity.HasOne(e => e.Cliente)
                .WithMany(c => c.HistoricosRiscoCalculado)
                .HasForeignKey(e => e.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Recommendation
        modelBuilder.Entity<Recommendation>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.StatusRecomendacao)
                .HasConversion<string>();

            entity.HasOne(e => e.Cliente)
                .WithMany(c => c.Recomendacoes)
                .HasForeignKey(e => e.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Ativo)
                .WithMany(a => a.Recomendacoes)
                .HasForeignKey(e => e.AtivoId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}

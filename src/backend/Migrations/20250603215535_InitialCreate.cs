using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace INERI.Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "assessores",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    categoria_assessor = table.Column<string>(type: "text", nullable: false),
                    data_criacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ativo = table.Column<bool>(type: "boolean", nullable: false),
                    preferencia_volume_investido = table.Column<int>(type: "integer", nullable: false, defaultValue: 60),
                    preferencia_nivel_desenquadramento = table.Column<int>(type: "integer", nullable: false, defaultValue: 60),
                    preferencia_tempo_sem_contato = table.Column<int>(type: "integer", nullable: false, defaultValue: 60)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_assessores", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ativos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    codigo = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    nome = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    tipo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    preco_atual = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    risco = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
                    rentabilidade = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
                    data_criacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ativos", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "clientes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    cpf = table.Column<string>(type: "character varying(14)", maxLength: 14, nullable: false),
                    data_nascimento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    assessor_id = table.Column<int>(type: "integer", nullable: false),
                    data_criacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clientes", x => x.id);
                    table.ForeignKey(
                        name: "FK_clientes_assessores_assessor_id",
                        column: x => x.assessor_id,
                        principalTable: "assessores",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "historico_risco_calculado",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cliente_id = table.Column<int>(type: "integer", nullable: false),
                    risco_calculado = table.Column<int>(type: "integer", nullable: false),
                    dados_calculo = table.Column<string>(type: "jsonb", nullable: false),
                    data_calculo = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_historico_risco_calculado", x => x.id);
                    table.ForeignKey(
                        name: "FK_historico_risco_calculado_clientes_cliente_id",
                        column: x => x.cliente_id,
                        principalTable: "clientes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "historico_risco_declarado",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cliente_id = table.Column<int>(type: "integer", nullable: false),
                    risco_declarado = table.Column<int>(type: "integer", nullable: false),
                    respostas_questionario = table.Column<string>(type: "jsonb", nullable: false),
                    data_declaracao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_historico_risco_declarado", x => x.id);
                    table.ForeignKey(
                        name: "FK_historico_risco_declarado_clientes_cliente_id",
                        column: x => x.cliente_id,
                        principalTable: "clientes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "investimento",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cliente_id = table.Column<int>(type: "integer", nullable: false),
                    ativo_id = table.Column<int>(type: "integer", nullable: false),
                    quantidade = table.Column<decimal>(type: "numeric(18,6)", nullable: false),
                    preco_compra = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    data_compra = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    data_criacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_investimento", x => x.id);
                    table.ForeignKey(
                        name: "FK_investimento_ativos_ativo_id",
                        column: x => x.ativo_id,
                        principalTable: "ativos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_investimento_clientes_cliente_id",
                        column: x => x.cliente_id,
                        principalTable: "clientes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "recomendacoes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cliente_id = table.Column<int>(type: "integer", nullable: false),
                    ativo_id = table.Column<int>(type: "integer", nullable: false),
                    descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    quantidade_sugerida = table.Column<decimal>(type: "numeric(18,6)", nullable: false),
                    status_recomendacao = table.Column<string>(type: "text", nullable: false),
                    data_criacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    data_atualizacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_recomendacoes", x => x.id);
                    table.ForeignKey(
                        name: "FK_recomendacoes_ativos_ativo_id",
                        column: x => x.ativo_id,
                        principalTable: "ativos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_recomendacoes_clientes_cliente_id",
                        column: x => x.cliente_id,
                        principalTable: "clientes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_assessores_email",
                table: "assessores",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ativos_codigo",
                table: "ativos",
                column: "codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_clientes_assessor_id",
                table: "clientes",
                column: "assessor_id");

            migrationBuilder.CreateIndex(
                name: "IX_clientes_cpf",
                table: "clientes",
                column: "cpf",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_clientes_email",
                table: "clientes",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_historico_risco_calculado_cliente_id",
                table: "historico_risco_calculado",
                column: "cliente_id");

            migrationBuilder.CreateIndex(
                name: "IX_historico_risco_declarado_cliente_id",
                table: "historico_risco_declarado",
                column: "cliente_id");

            migrationBuilder.CreateIndex(
                name: "IX_investimento_ativo_id",
                table: "investimento",
                column: "ativo_id");

            migrationBuilder.CreateIndex(
                name: "IX_investimento_cliente_id",
                table: "investimento",
                column: "cliente_id");

            migrationBuilder.CreateIndex(
                name: "IX_recomendacoes_ativo_id",
                table: "recomendacoes",
                column: "ativo_id");

            migrationBuilder.CreateIndex(
                name: "IX_recomendacoes_cliente_id",
                table: "recomendacoes",
                column: "cliente_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "historico_risco_calculado");

            migrationBuilder.DropTable(
                name: "historico_risco_declarado");

            migrationBuilder.DropTable(
                name: "investimento");

            migrationBuilder.DropTable(
                name: "recomendacoes");

            migrationBuilder.DropTable(
                name: "ativos");

            migrationBuilder.DropTable(
                name: "clientes");

            migrationBuilder.DropTable(
                name: "assessores");
        }
    }
}

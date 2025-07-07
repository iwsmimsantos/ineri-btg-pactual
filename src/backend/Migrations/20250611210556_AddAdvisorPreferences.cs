using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace INERI.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvisorPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "preferencia_nivel_desenquadramento",
                table: "assessores",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "preferencia_tempo_sem_contato",
                table: "assessores",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "preferencia_volume_investido",
                table: "assessores",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "preferencia_nivel_desenquadramento",
                table: "assessores");

            migrationBuilder.DropColumn(
                name: "preferencia_tempo_sem_contato",
                table: "assessores");

            migrationBuilder.DropColumn(
                name: "preferencia_volume_investido",
                table: "assessores");
        }
    }
}

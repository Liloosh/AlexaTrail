using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class secondmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ref_Refs_RefsId",
                table: "Ref");

            migrationBuilder.DropTable(
                name: "Refs");

            migrationBuilder.RenameColumn(
                name: "RefsId",
                table: "Ref",
                newName: "RefsGroupId");

            migrationBuilder.RenameIndex(
                name: "IX_Ref_RefsId",
                table: "Ref",
                newName: "IX_Ref_RefsGroupId");

            migrationBuilder.AddColumn<string>(
                name: "URL",
                table: "Ref",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RefsGroup",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefsGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefsGroup_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_RefsGroup_UserId",
                table: "RefsGroup",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ref_RefsGroup_RefsGroupId",
                table: "Ref",
                column: "RefsGroupId",
                principalTable: "RefsGroup",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ref_RefsGroup_RefsGroupId",
                table: "Ref");

            migrationBuilder.DropTable(
                name: "RefsGroup");

            migrationBuilder.DropColumn(
                name: "URL",
                table: "Ref");

            migrationBuilder.RenameColumn(
                name: "RefsGroupId",
                table: "Ref",
                newName: "RefsId");

            migrationBuilder.RenameIndex(
                name: "IX_Ref_RefsGroupId",
                table: "Ref",
                newName: "IX_Ref_RefsId");

            migrationBuilder.CreateTable(
                name: "Refs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Refs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Refs_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Refs_UserId",
                table: "Refs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ref_Refs_RefsId",
                table: "Ref",
                column: "RefsId",
                principalTable: "Refs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

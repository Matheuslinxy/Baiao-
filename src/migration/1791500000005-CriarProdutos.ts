import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CriarProdutos1791500000005 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "products",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "name", type: "varchar" },
                { name: "situationId", type: "int", isNullable: false },
                { name: "categoryId", type: "int", isNullable: false },
                { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }
            ]
        }));

        await queryRunner.createForeignKey("products", new TableForeignKey({
            columnNames: ["situationId"],
            referencedTableName: "product_situations",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("products", new TableForeignKey({
            columnNames: ["categoryId"],
            referencedTableName: "product_categories",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tabela = await queryRunner.getTable("products");

        const chaveSituacao = tabela?.foreignKeys.find((fk) => fk.columnNames.includes("situationId"));
        if (chaveSituacao) {
            await queryRunner.dropForeignKey("products", chaveSituacao);
        }

        const chaveCategoria = tabela?.foreignKeys.find((fk) => fk.columnNames.includes("categoryId"));
        if (chaveCategoria) {
            await queryRunner.dropForeignKey("products", chaveCategoria);
        }

        await queryRunner.dropTable("products");
    }

}
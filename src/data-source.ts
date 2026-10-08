import "reflect-metadata"
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Situacao } from "./entity/Situacao"
import { Usuario } from "./entity/Usuario"
import { Produto } from "./entity/Produto";
import { CategoriaProduto } from "./entity/CategoriaProduto";
import { SituacaoProduto } from "./entity/SituacaoProduto";

dotenv.config();

const dialeto = process.env.DB_DIALECT ?? "mysql"

export const AppDataSource = new DataSource({
    type: dialeto as "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Situacao, Usuario, Produto, CategoriaProduto, SituacaoProduto],
    subscribers: [],
    migrations: [__dirname + "/migration/*.{ts,js}"],
})
//Importa a biblioteca express
import express from "express";
//Importa a metadata
import "reflect-metadata";
//Importa variáveis de ambiente
import dotenv from "dotenv";
dotenv.config();

//Importa a conexão com o banco
import { AppDataSource } from "./data-source";

//Cria a aplicação express
const app = express();

//Cria um middleware para receber os dados no corpo da requisição
app.use(express.json());

//Incluir os controllers
import LoginController from "./controllers/LoginController";
import SituacoesController from "./controllers/SituacoesController";
import UsuariosController from "./controllers/UsuariosController";
import SituacoesProdutoController from "./controllers/SituacoesProdutoController";
import CategoriasController from "./controllers/CategoriasController";
import ProdutosController from "./controllers/ProdutosController";

//Criar as rotas, quando chama barra, ela vai ser direcionada para a tela de login
app.use('/', LoginController);
app.use('/', SituacoesController);
app.use('/', UsuariosController);
app.use('/', SituacoesProdutoController);
app.use('/', CategoriasController);
app.use('/', ProdutosController);

//Conecta ao banco e só depois inicia o servidor
AppDataSource.initialize().then(() => {
    console.log("Conexão com o BD realizada com sucesso!");

    app.listen(process.env.PORT, () => {
        console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
    });
}).catch((erro) => {
    console.log("Erro na conexão com o BD.", erro);
});
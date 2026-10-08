import { AppDataSource } from "./data-source";
import CriaCategoriasSeeds from "./seeds/CriaCategoriasSeeds";
import CriaSituacoesProdutoSeeds from "./seeds/CriaSituacoesProdutoSeeds";
import CriaProdutosSeeds from "./seeds/CriaProdutosSeeds";
import CriaSituacoesSeeds from "./seeds/CriaSituacoesSeeds";
import CriaUsuariosSeeds from "./seeds/CriaUsuariosSeeds";

const executarSeeds = async() =>{
    console.log("Conectando ao banco de dados...")

    await AppDataSource.initialize();

    console.log("Banco de dados conectado!")

    try{
        const seedSituacoes = new CriaSituacoesSeeds();
        const seedSituacoesProduto = new CriaSituacoesProdutoSeeds();
        const seedCategorias = new CriaCategoriasSeeds();
        const seedUsuarios = new CriaUsuariosSeeds();
        const seedProdutos = new CriaProdutosSeeds();

        await seedSituacoes.run(AppDataSource)
        await seedSituacoesProduto.run(AppDataSource)
        await seedCategorias.run(AppDataSource)
        await seedUsuarios.run(AppDataSource)
        await seedProdutos.run(AppDataSource)

    }catch(erro){

        console.log("Erro ao executar o seed: ", erro);

    }finally{

        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.")

    }
}

executarSeeds();
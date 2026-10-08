import { FindOptionsOrder, FindOptionsRelations, ObjectLiteral, Repository } from "typeorm";

interface ResultadoPaginacao<T> {
    erro: boolean;
    dados: T[];
    paginaAtual: number;
    ultimaPagina: number;
    totalRegistros: number;
}

export class Paginador{
    static async paginar<T extends ObjectLiteral>(
        repositorio:Repository<T>,
        pagina: number = 1,
        limite: number = 10,
        ordem: FindOptionsOrder<T> = {},
        relacoes: FindOptionsRelations<T> = {}
    ): Promise<ResultadoPaginacao<T>>{

        const totalRegistros = await repositorio.count();

        const ultimaPagina = Math.ceil(totalRegistros / limite);

        if(pagina > ultimaPagina && ultimaPagina > 0){
            throw new Error(`Página inválida. Total de páginas: ${ultimaPagina}`)
        }

        const pular = (pagina - 1) * limite;
        
        const dados = await repositorio.find({
            take: limite,
            skip: pular,
            order: ordem,
            relations: relacoes,
        });

        return{
            erro: false,
            dados,
            paginaAtual: pagina,
            ultimaPagina,
            totalRegistros
        }
    }   

}
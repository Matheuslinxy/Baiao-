"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paginador = void 0;
class Paginador {
    static async paginar(repositorio, pagina = 1, limite = 10, ordem = {}, relacoes = {}) {
        const totalRegistros = await repositorio.count();
        const ultimaPagina = Math.ceil(totalRegistros / limite);
        if (pagina > ultimaPagina && ultimaPagina > 0) {
            throw new Error(`Página inválida. Total de páginas: ${ultimaPagina}`);
        }
        const pular = (pagina - 1) * limite;
        const dados = await repositorio.find({
            take: limite,
            skip: pular,
            order: ordem,
            relations: relacoes,
        });
        return {
            erro: false,
            dados,
            paginaAtual: pagina,
            ultimaPagina,
            totalRegistros
        };
    }
}
exports.Paginador = Paginador;

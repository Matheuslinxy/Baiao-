import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SituacaoProduto } from "../entity/SituacaoProduto";
import { Paginador } from "../services/Paginador";

const router = express.Router();

router.get("/situacoes-produto", async (req: Request, res: Response) => {
    try {
        const situacaoRepo = AppDataSource.getRepository(SituacaoProduto);
        const pagina = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;

        const resultado = await Paginador.paginar(situacaoRepo, pagina, limite, { id: "DESC" });
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar situações de produto!" });
    }
});

router.get("/situacoes-produto/:id", async (req: Request, res: Response) => {
    try {
        const situacaoId = Number(req.params.id);
        if (!Number.isFinite(situacaoId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const situacaoRepo = AppDataSource.getRepository(SituacaoProduto);
        const situacao = await situacaoRepo.findOneBy({ id: situacaoId });

        if (!situacao) {
            res.status(404).json({ message: "A situação que você buscou não existe!" });
            return;
        }
        res.status(200).json(situacao);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar situação de produto!" });
    }
});

router.post("/situacoes-produto", async (req: Request, res: Response) => {
    try {
        const situacaoRepo = AppDataSource.getRepository(SituacaoProduto);

        const novaSituacao = situacaoRepo.create(req.body);
        await situacaoRepo.save(novaSituacao);

        res.status(201).json({
            message: "Situação de produto criada com sucesso!",
            situacao: novaSituacao,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar situação de produto!" });
    }
});

router.put("/situacoes-produto/:id", async (req: Request, res: Response) => {
    try {
        const situacaoId = Number(req.params.id);
        if (!Number.isFinite(situacaoId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const situacaoRepo = AppDataSource.getRepository(SituacaoProduto);
        const situacao = await situacaoRepo.findOneBy({ id: situacaoId });

        if (!situacao) {
            res.status(404).json({ message: "A situação que você buscou não existe!" });
            return;
        }

        // Aceita "name" (nome real do campo) ou "nameSituation" (usado no código do professor)
        const novoNome = req.body.name ?? req.body.nameSituation;
        if (novoNome !== undefined) situacao.name = novoNome;

        const situacaoAtualizada = await situacaoRepo.save(situacao);
        res.status(200).json({
            message: "Situação de produto atualizada com sucesso!",
            situacao: situacaoAtualizada,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar situação de produto!" });
    }
});

router.delete("/situacoes-produto/:id", async (req: Request, res: Response) => {
    try {
        const situacaoId = Number(req.params.id);
        if (!Number.isFinite(situacaoId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const situacaoRepo = AppDataSource.getRepository(SituacaoProduto);
        const situacao = await situacaoRepo.findOneBy({ id: situacaoId });

        if (!situacao) {
            res.status(404).json({ message: "A situação que você buscou não existe!" });
            return;
        }

        await situacaoRepo.remove(situacao);
        res.status(200).json({ message: "Situação de produto removida com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover situação de produto!" });
    }
});

export default router;
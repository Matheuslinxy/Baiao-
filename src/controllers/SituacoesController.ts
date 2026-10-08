import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situacao } from "../entity/Situacao";
import { Paginador } from "../services/Paginador";

const router = express.Router();

router.get("/situacoes", async (req: Request, res: Response) => {
    try {
        const situacaoRepo = AppDataSource.getRepository(Situacao);
        const pagina = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;

        const resultado = await Paginador.paginar(situacaoRepo, pagina, limite, { id: "DESC" });
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar situações!" });
    }
});

router.get("/situacoes/:id", async (req: Request, res: Response) => {
    try {
        const situacaoId = Number(req.params.id);
        if (!Number.isFinite(situacaoId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const situacaoRepo = AppDataSource.getRepository(Situacao);
        const situacao = await situacaoRepo.findOneBy({ id: situacaoId });

        if (!situacao) {
            res.status(404).json({ message: "A situação que você buscou não existe!" });
            return;
        }
        res.status(200).json(situacao);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar situação!" });
    }
});

router.post("/situacoes", async (req: Request, res: Response) => {
    try {
        const situacaoRepo = AppDataSource.getRepository(Situacao);

        const novaSituacao = situacaoRepo.create(req.body);
        await situacaoRepo.save(novaSituacao);

        res.status(201).json({
            message: "Situação criada com sucesso!",
            situacao: novaSituacao,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar situação!" });
    }
});

router.put("/situacoes/:id", async (req: Request, res: Response) => {
    try {
        const situacaoId = Number(req.params.id);
        if (!Number.isFinite(situacaoId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const situacaoRepo = AppDataSource.getRepository(Situacao);
        const situacao = await situacaoRepo.findOneBy({ id: situacaoId });

        if (!situacao) {
            res.status(404).json({ message: "A situação que você buscou não existe!" });
            return;
        }

        const { nameSituation } = req.body;
        if (nameSituation !== undefined) situacao.nameSituation = nameSituation;

        const situacaoAtualizada = await situacaoRepo.save(situacao);
        res.status(200).json({
            message: "Situação atualizada com sucesso!",
            situacao: situacaoAtualizada,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar situação!" });
    }
});

router.delete("/situacoes/:id", async (req: Request, res: Response) => {
    try {
        const situacaoId = Number(req.params.id);
        if (!Number.isFinite(situacaoId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const situacaoRepo = AppDataSource.getRepository(Situacao);
        const situacao = await situacaoRepo.findOneBy({ id: situacaoId });

        if (!situacao) {
            res.status(404).json({ message: "A situação que você buscou não existe!" });
            return;
        }

        await situacaoRepo.remove(situacao);
        res.status(200).json({ message: "Situação removida com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover situação!" });
    }
});

export default router;
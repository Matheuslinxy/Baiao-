import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SituacaoProduto } from "../entity/SituacaoProduto";
import { CategoriaProduto } from "../entity/CategoriaProduto";
import { Produto } from "../entity/Produto";
import { Paginador } from "../services/Paginador";

const router = express.Router();

router.get("/produtos", async (req: Request, res: Response) => {
    try {
        const produtoRepo = AppDataSource.getRepository(Produto);
        const pagina = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;

        const resultado = await Paginador.paginar(
            produtoRepo, pagina, limite, { id: "DESC" },
            { productSituation: true, productCategory: true }
        );
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar produtos!" });
    }
});

router.get("/produtos/:id", async (req: Request, res: Response) => {
    try {
        const produtoId = Number(req.params.id);
        if (!Number.isFinite(produtoId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const produtoRepo = AppDataSource.getRepository(Produto);
        const produto = await produtoRepo.findOne({
            where: { id: produtoId },
            relations: { productSituation: true, productCategory: true },
        });

        if (!produto) {
            res.status(404).json({ message: "O produto que você buscou não existe!" });
            return;
        }
        res.status(200).json(produto);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar o produto!" });
    }
});

router.post("/produtos", async (req: Request, res: Response) => {
    try {
        const { name, categoryId, situationId } = req.body;

        if (!name || !categoryId || !situationId) {
            res.status(400).json({ message: "Nome, categoria e situação são obrigatórios!" });
            return;
        }

        const produtoRepo = AppDataSource.getRepository(Produto);
        const situacaoRepo = AppDataSource.getRepository(SituacaoProduto);
        const categoriaRepo = AppDataSource.getRepository(CategoriaProduto);

        const situacao = await situacaoRepo.findOneBy({ id: Number(situationId) });
        if (!situacao) {
            res.status(404).json({ message: "A situação informada não existe!" });
            return;
        }

        const categoria = await categoriaRepo.findOneBy({ id: Number(categoryId) });
        if (!categoria) {
            res.status(404).json({ message: "A categoria informada não existe!" });
            return;
        }

        const novoProduto = produtoRepo.create({
            name,
            productCategory: categoria,
            productSituation: situacao,
        });
        await produtoRepo.save(novoProduto);

        res.status(201).json({
            message: "Produto cadastrado com sucesso!",
            produto: novoProduto,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar produto!" });
    }
});

router.put("/produtos/:id", async (req: Request, res: Response) => {
    try {
        const produtoId = Number(req.params.id);
        if (!Number.isFinite(produtoId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const produtoRepo = AppDataSource.getRepository(Produto);
        const situacaoRepo = AppDataSource.getRepository(SituacaoProduto);
        const categoriaRepo = AppDataSource.getRepository(CategoriaProduto);

        const produto = await produtoRepo.findOne({
            where: { id: produtoId },
            relations: { productSituation: true, productCategory: true },
        });

        if (!produto) {
            res.status(404).json({ message: "O produto que você buscou não existe!" });
            return;
        }

        const { name, categoryId, situationId } = req.body;

        if (name !== undefined) produto.name = name;

        if (situationId !== undefined) {
            const situacao = await situacaoRepo.findOneBy({ id: Number(situationId) });
            if (!situacao) {
                res.status(404).json({ message: "A situação informada não existe!" });
                return;
            }
            produto.productSituation = situacao;
        }

        if (categoryId !== undefined) {
            const categoria = await categoriaRepo.findOneBy({ id: Number(categoryId) });
            if (!categoria) {
                res.status(404).json({ message: "A categoria informada não existe!" });
                return;
            }
            produto.productCategory = categoria;
        }

        const produtoAtualizado = await produtoRepo.save(produto);
        res.status(200).json({
            message: "Produto atualizado com sucesso!",
            produto: produtoAtualizado,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar produto!" });
    }
});

router.delete("/produtos/:id", async (req: Request, res: Response) => {
    try {
        const produtoId = Number(req.params.id);
        if (!Number.isFinite(produtoId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const produtoRepo = AppDataSource.getRepository(Produto);
        const produto = await produtoRepo.findOneBy({ id: produtoId });

        if (!produto) {
            res.status(404).json({ message: "O produto que você buscou não existe!" });
            return;
        }

        await produtoRepo.remove(produto);
        res.status(200).json({ message: "Produto removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover produto!" });
    }
});

export default router;
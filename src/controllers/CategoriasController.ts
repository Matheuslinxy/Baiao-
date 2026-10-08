import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CategoriaProduto } from "../entity/CategoriaProduto";
import { Paginador } from "../services/Paginador";

const router = express.Router();

// Listar categorias (com paginação)
router.get("/categorias", async (req: Request, res: Response) => {
    try {
        const categoriaRepo = AppDataSource.getRepository(CategoriaProduto);
        const pagina = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;

        const resultado = await Paginador.paginar(categoriaRepo, pagina, limite, { id: "DESC" });
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar categorias!" });
    }
});

// Visualizar uma categoria
router.get("/categorias/:id", async (req: Request, res: Response) => {
    try {
        const categoriaId = Number(req.params.id);
        if (!Number.isFinite(categoriaId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const categoriaRepo = AppDataSource.getRepository(CategoriaProduto);
        const categoria = await categoriaRepo.findOneBy({ id: categoriaId });

        if (!categoria) {
            res.status(404).json({ message: "A categoria que você buscou não existe!" });
            return;
        }
        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar categoria!" });
    }
});

// Cadastrar categoria
router.post("/categorias", async (req: Request, res: Response) => {
    try {
        const dados = req.body;
        const categoriaRepo = AppDataSource.getRepository(CategoriaProduto);

        const novaCategoria = categoriaRepo.create(dados);
        await categoriaRepo.save(novaCategoria);

        res.status(201).json({
            message: "Categoria criada com sucesso!",
            categoria: novaCategoria,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar categoria!" });
    }
});

// Atualizar categoria
router.put("/categorias/:id", async (req: Request, res: Response) => {
    try {
        const categoriaId = Number(req.params.id);
        if (!Number.isFinite(categoriaId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const categoriaRepo = AppDataSource.getRepository(CategoriaProduto);
        const categoria = await categoriaRepo.findOneBy({ id: categoriaId });

        if (!categoria) {
            res.status(404).json({ message: "A categoria que você buscou não existe!" });
            return;
        }

        const { name } = req.body;
        if (name !== undefined) categoria.name = name;

        const categoriaAtualizada = await categoriaRepo.save(categoria);
        res.status(200).json({
            message: "Categoria atualizada com sucesso!",
            categoria: categoriaAtualizada,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar categoria!" });
    }
});

// Remover categoria
router.delete("/categorias/:id", async (req: Request, res: Response) => {
    try {
        const categoriaId = Number(req.params.id);
        if (!Number.isFinite(categoriaId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const categoriaRepo = AppDataSource.getRepository(CategoriaProduto);
        const categoria = await categoriaRepo.findOneBy({ id: categoriaId });

        if (!categoria) {
            res.status(404).json({ message: "A categoria que você buscou não existe!" });
            return;
        }

        await categoriaRepo.remove(categoria);
        res.status(200).json({ message: "Categoria removida com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover categoria!" });
    }
});

export default router;
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situacao } from "../entity/Situacao";
import { Usuario } from "../entity/Usuario";
import { Paginador } from "../services/Paginador";

const router = express.Router();

router.get("/usuarios", async (req: Request, res: Response) => {
    try {
        const usuarioRepo = AppDataSource.getRepository(Usuario);
        const pagina = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;

        const resultado = await Paginador.paginar(
            usuarioRepo, pagina, limite, { id: "DESC" }, { situation: true }
        );
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar usuários!" });
    }
});

router.get("/usuarios/:id", async (req: Request, res: Response) => {
    try {
        const usuarioId = Number(req.params.id);
        if (!Number.isFinite(usuarioId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const usuarioRepo = AppDataSource.getRepository(Usuario);
        const usuario = await usuarioRepo.findOne({
            where: { id: usuarioId },
            relations: { situation: true },
        });

        if (!usuario) {
            res.status(404).json({ message: "O usuário que você buscou não existe!" });
            return;
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar o usuário!" });
    }
});

router.post("/usuarios", async (req: Request, res: Response) => {
    try {
        const { name, email, situationId } = req.body;

        if (!name || !email || !situationId) {
            res.status(400).json({ message: "Nome, e-mail e situação são obrigatórios!" });
            return;
        }

        const usuarioRepo = AppDataSource.getRepository(Usuario);
        const situacaoRepo = AppDataSource.getRepository(Situacao);

        const situacao = await situacaoRepo.findOneBy({ id: Number(situationId) });
        if (!situacao) {
            res.status(404).json({ message: "A situação informada não existe!" });
            return;
        }

        const novoUsuario = usuarioRepo.create({ name, email, situation: situacao });
        await usuarioRepo.save(novoUsuario);

        res.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            usuario: novoUsuario,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao cadastrar usuário!" });
    }
});

router.put("/usuarios/:id", async (req: Request, res: Response) => {
    try {
        const usuarioId = Number(req.params.id);
        if (!Number.isFinite(usuarioId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const usuarioRepo = AppDataSource.getRepository(Usuario);
        const situacaoRepo = AppDataSource.getRepository(Situacao);

        const usuario = await usuarioRepo.findOne({
            where: { id: usuarioId },
            relations: { situation: true },
        });

        if (!usuario) {
            res.status(404).json({ message: "O usuário que você buscou não existe!" });
            return;
        }

        const { name, email, situationId } = req.body;

        if (name !== undefined) usuario.name = name;
        if (email !== undefined) usuario.email = email;

        if (situationId !== undefined) {
            const situacao = await situacaoRepo.findOneBy({ id: Number(situationId) });
            if (!situacao) {
                res.status(404).json({ message: "A situação informada não existe!" });
                return;
            }
            usuario.situation = situacao;
        }

        const usuarioAtualizado = await usuarioRepo.save(usuario);
        res.status(200).json({
            message: "Usuário atualizado com sucesso!",
            usuario: usuarioAtualizado,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar usuário!" });
    }
});

router.delete("/usuarios/:id", async (req: Request, res: Response) => {
    try {
        const usuarioId = Number(req.params.id);
        if (!Number.isFinite(usuarioId)) {
            res.status(400).json({ message: "ID inválido!" });
            return;
        }

        const usuarioRepo = AppDataSource.getRepository(Usuario);
        const usuario = await usuarioRepo.findOneBy({ id: usuarioId });

        if (!usuario) {
            res.status(404).json({ message: "O usuário que você buscou não existe!" });
            return;
        }

        await usuarioRepo.remove(usuario);
        res.status(200).json({ message: "Usuário removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao remover usuário!" });
    }
});

export default router;
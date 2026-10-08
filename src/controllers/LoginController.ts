import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Bem-vindo à API de Produtos! Login aqui!");
});

export default router;
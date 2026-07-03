import { Request, Response } from 'express';

export function getAllUsuarios(req: Request, res: Response) {
    res.json({ message: 'Endpoint usuarios works', endpoint: 'GET /api/usuarios' });
}

export function getUsuarioById(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `GET /api/usuarios/${req.params.id}` });
}

export function createUsuario(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: 'POST /api/usuarios' });
}

export function updateUsuario(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `PUT /api/usuarios/${req.params.id}` });
}

export function deleteUsuario(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `DELETE /api/usuarios/${req.params.id}` });
}

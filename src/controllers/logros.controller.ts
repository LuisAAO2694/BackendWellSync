import { Request, Response } from 'express';

export function getAllLogros(req: Request, res: Response) {
    res.json({ message: 'Endpoint logros works', endpoint: 'GET /api/logros' });
}

export function getLogroById(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `GET /api/logros/${req.params.id}` });
}

export function createLogro(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: 'POST /api/logros' });
}

export function updateLogro(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `PUT /api/logros/${req.params.id}` });
}

export function deleteLogro(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `DELETE /api/logros/${req.params.id}` });
}

import { Request, Response } from 'express';

export function getAllHabitos(req: Request, res: Response) {
    res.json({ message: 'Endpoint habitos works', endpoint: 'GET /api/habitos' });
}

export function getHabitoById(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `GET /api/habitos/${req.params.id}` });
}

export function createHabito(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: 'POST /api/habitos' });
}

export function updateHabito(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `PUT /api/habitos/${req.params.id}` });
}

export function deleteHabito(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `DELETE /api/habitos/${req.params.id}` });
}

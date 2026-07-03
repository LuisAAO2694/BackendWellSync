import { Request, Response } from 'express';

export function getAllRegistrosDiarios(req: Request, res: Response) {
    res.json({ message: 'Endpoint registrosDiarios works', endpoint: 'GET /api/registros-diarios' });
}

export function getRegistroDiarioById(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `GET /api/registros-diarios/${req.params.id}` });
}

export function createRegistroDiario(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: 'POST /api/registros-diarios' });
}

export function updateRegistroDiario(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `PUT /api/registros-diarios/${req.params.id}` });
}

export function deleteRegistroDiario(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `DELETE /api/registros-diarios/${req.params.id}` });
}

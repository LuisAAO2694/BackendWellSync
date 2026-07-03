import { Request, Response } from 'express';

export function getAllEntrenamientos(req: Request, res: Response) {
    res.json({ message: 'Endpoint entrenamientos works', endpoint: 'GET /api/entrenamientos' });
}

export function getEntrenamientoById(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `GET /api/entrenamientos/${req.params.id}` });
}

export function createEntrenamiento(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: 'POST /api/entrenamientos' });
}

export function updateEntrenamiento(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `PUT /api/entrenamientos/${req.params.id}` });
}

export function deleteEntrenamiento(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `DELETE /api/entrenamientos/${req.params.id}` });
}

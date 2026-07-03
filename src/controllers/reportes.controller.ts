import { Request, Response } from 'express';

export function getAllReportes(req: Request, res: Response) {
    res.json({ message: 'Endpoint reportes works', endpoint: 'GET /api/reportes' });
}

export function getReporteById(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `GET /api/reportes/${req.params.id}` });
}

export function createReporte(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: 'POST /api/reportes' });
}

export function updateReporte(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `PUT /api/reportes/${req.params.id}` });
}

export function deleteReporte(req: Request, res: Response) {
    res.json({ message: 'Endpoint works', endpoint: `DELETE /api/reportes/${req.params.id}` });
}

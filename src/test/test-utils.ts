import { Request, Response } from 'express';

export function mockReq(body: Record<string, unknown> = {}): Request {
    return { body } as unknown as Request;
}

export function mockRes(): Response {
    const res: Record<string, jest.Mock> = {
        status: jest.fn(),
        json: jest.fn(),
    };
    res.status.mockReturnValue(res);
    res.json.mockReturnValue(res);
    return res as unknown as Response;
}

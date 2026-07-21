import { HttpStatus } from '../http-status';

describe('HttpStatus', () => {
    it('debe tener los códigos de estado correctos', () => {
        expect(HttpStatus.SUCCESS).toBe(200);
        expect(HttpStatus.BAD_REQUEST).toBe(400);
        expect(HttpStatus.UNAUTHORIZED).toBe(401);
        expect(HttpStatus.FORBIDDEN).toBe(403);
        expect(HttpStatus.NOT_FOUND).toBe(404);
        expect(HttpStatus.SERVER_ERROR).toBe(500);
    });
});

import { jwtConfig } from '../jwt';

const originalEnv = process.env;

describe('jwtConfig', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('debe tomar secret y expiresIn de process.env', () => {
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_EXPIRES_IN = '1h';

        const { jwtConfig: config } = require('../jwt');
        expect(config.secret).toBe('test-secret');
        expect(config.expiresIn).toBe('1h');
    });
});

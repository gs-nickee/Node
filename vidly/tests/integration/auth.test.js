// describe('auth middleware', () => {
//     it('should return 401 if no token is provided', async () => {
//     });
// });

const request = require('supertest');
const {User } = require('../../models/user');

describe('auth middleware', () => {
    beforeEach(() => { 
        server = require('../../index');
        token = new User().generateAuthToken();
    })
    afterEach(async () => { server.close(); });

    let token;

    const exec = () => {
        return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre1' });
    }

    it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
});
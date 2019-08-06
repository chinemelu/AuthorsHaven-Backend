import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../server/app';

chai.use(chaiHttp);

const { expect } = chai;

describe('User signup', () => {
  describe('Empty input fields', () => {
    it('should throw an error if the firstname input field is empty',
      async () => {
        const user = {
          firstname: '',
          lastname: 'user',
          email: 'testuser@gmail.com',
          username: 'testuser',
          password: 'testpassword',
        };
        try {
          const response = await chai.request(app)
            .post('/api/v1/auth/signup')
            .send(user);
          expect(response.status).to.equal(400);
          expect(response.body.error.firstname.message)
            .to.equal('First name is required');
        } catch (error) {
          throw error;
        }
      });
  });
});

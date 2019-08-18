import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../server/app';

chai.use(chaiHttp);

const { expect } = chai;

describe('User signup', () => {
  describe('Empty input fields', () => {
    it('should throw an error if the firstname input field is empty',
      async () => {
        const mutation = `mutation {
          signupUser (userSignupInput: {
            firstname: "",
            lastname: "user",
            email: "testuser@gmail.com",
            username: "testuser",
            password: "testpassword",
          }) {
            email
            username
          }
        }`;
        try {
          const response = await chai.request(app)
            .post('/graphql')
            .send({ query: mutation });
          expect(response.body.errors[0].message)
            .to.equal('First name is required');
          expect(response.status).equal(200);
        } catch (error) {
          throw error;
        }
      });
  });
});

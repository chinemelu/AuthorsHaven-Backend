import chaiHttp from 'chai-http';
import chai from 'chai';
import userMockData from './_mocks_/user';
import app from '../server/app';

chai.use(chaiHttp);

const { expect } = chai;

describe('User signup', () => {
  describe('Empty input fields', () => {
    it('should throw an error if the firstname input field is empty',
      async () => {
        const mutation = userMockData.missingFirstNameMutation;
        try {
          const response = await chai.request(app)
            .post('/graphql')
            .send({ query: mutation });
          expect(response.body.errors[0].message)
            .to.equal('First name is required');
          expect(response.status).equal(500);
        } catch (error) {
          throw error;
        }
      });

    it('should throw an error if the last name input field is empty',
      async () => {
        const mutation = userMockData.missingLastNameMutation;
        try {
          const response = await chai.request(app)
            .post('/graphql')
            .send({ query: mutation });
          expect(response.body.errors[0].message)
            .to.equal('Last name is required');
          expect(response.status).equal(500);
        } catch (error) {
          throw error;
        }
      });
    it('should throw an error if the username input field is empty',
      async () => {
        const mutation = userMockData.missingUsernameMutation;
        try {
          const response = await chai.request(app)
            .post('/graphql')
            .send({ query: mutation });
          expect(response.body.errors[0].message)
            .to.equal('Username is required');
          expect(response.status).equal(500);
        } catch (error) {
          throw error;
        }
      });
    it('should throw an error if the password input field is empty',
      async () => {
        const mutation = userMockData.missingPasswordMutation;
        try {
          const response = await chai.request(app)
            .post('/graphql')
            .send({ query: mutation });
          expect(response.body.errors[0].message)
            .to.equal('Password is required');
          expect(response.status).equal(500);
        } catch (error) {
          throw error;
        }
      });
    it('should throw an error if the email input field is empty',
      async () => {
        const mutation = userMockData.missingEmailMutation;
        try {
          const response = await chai.request(app)
            .post('/graphql')
            .send({ query: mutation });
          expect(response.body.errors[0].message)
            .to.equal('Email is required');
          expect(response.status).equal(500);
        } catch (error) {
          throw error;
        }
      });
  });

  describe('Incorrect input fields', () => {
    it('should throw an error if the password input field is too short',
      async () => {
        const mutation = userMockData.shortPasswordMutation;
        try {
          const response = await chai.request(app)
            .post('/graphql')
            .send({ query: mutation });
          expect(response.body.errors[0].message)
            .to.equal('Password must be at least 8 characters');
          expect(response.status).equal(500);
        } catch (error) {
          throw error;
        }
      });

    it('should throw an error if the email input field is invalid',
      async () => {
        const mutation = userMockData.invalidEmailMutation;
        try {
          const response = await chai.request(app)
            .post('/graphql')
            .send({ query: mutation });
          expect(response.body.errors[0].message)
            .to.equal('Invalid email');
          expect(response.status).equal(500);
        } catch (error) {
          throw error;
        }
      });

    it(`should throw an error if the username input field consists of invalid 
    characters`,
    async () => {
      const mutation = userMockData.invalidUsernameCharacterMutation;
      try {
        const response = await chai.request(app)
          .post('/graphql')
          .send({ query: mutation });
        expect(response.body.errors[0].message)
          .eql(
            'Username can consist of only underscores, alphabets or numbers'
          );
        expect(response.status).equal(500);
      } catch (error) {
        throw error;
      }
    });

    it('should throw an error if the username input field is too short',
      async () => {
        const mutation = userMockData.shortUsernameMutation;
        try {
          const response = await chai.request(app)
            .post('/graphql')
            .send({ query: mutation });
          expect(response.body.errors[0].message)
            .eql(
              'Username must consist of at least 4 characters'
            );
          expect(response.status).equal(500);
        } catch (error) {
          throw error;
        }
      });

    it('should throw an error if the username input field is too long',
      async () => {
        const mutation = userMockData.longUsernameMutation;
        try {
          const response = await chai.request(app)
            .post('/graphql')
            .send({ query: mutation });
          expect(response.body.errors[0].message)
            .eql(
              'Username must not exceed 15 characters'
            );
          expect(response.status).equal(500);
        } catch (error) {
          throw error;
        }
      });
  });
});

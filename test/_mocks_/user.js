const userMockData = {
  missingFirstNameMutation:
    `mutation {
      signupUser (userSignupInput: {
        firstname: "",
        lastname: "user",
        email: "testuser@gmail.com",
        username: "testuser",
        password: "testpassword",
      }, userProfileInput: { bio: "", avatar: ""}) {
        email
        username
      }
    }`,
  missingLastNameMutation: `mutation {
    signupUser (userSignupInput: {
      firstname: "test",
      lastname: "",
      email: "testuser@gmail.com",
      username: "testuser",
      password: "testpassword",
    }, userProfileInput: { bio: "", avatar: ""}) {
      email
      username
    }
  }`,
  missingUsernameMutation: `mutation {
    signupUser (userSignupInput: {
      firstname: "test",
      lastname: "user",
      email: "testuser@gmail.com",
      username: "",
      password: "testpassword",
    }) {
      email
      username
    }
  }`,
  missingPasswordMutation: `mutation {
    signupUser (userSignupInput: {
      firstname: "test",
      lastname: "user",
      email: "testuser@gmail.com",
      username: "testuser",
      password: "",
    }) {
      email
      username
    }
  }`,
  missingEmailMutation: `mutation {
      signupUser (userSignupInput: {
        firstname: "test",
        lastname: "user",
        email: "",
        username: "testuser",
        password: "testpassword",
      }) {
        email
        username
      }
    }`,
  shortPasswordMutation: `mutation {
      signupUser (userSignupInput: {
        firstname: "test",
        lastname: "user",
        email: "testuser@gmail.com",
        username: "testuser",
        password: "test",
      }) {
        email
        username
      }
    }`,
  invalidEmailMutation: `mutation {
      signupUser (userSignupInput: {
        firstname: "test",
        lastname: "user",
        email: "testuser@gmail",
        username: "testuser",
        password: "testpassword",
      }) {
        email
        username
      }
    }`,
  invalidUsernameCharacterMutation: `mutation {
      signupUser (userSignupInput: {
        firstname: "test",
        lastname: "user",
        email: "testuser@gmail.com",
        username: "testuser@",
        password: "testpassword",
      }) {
        email
        username
      }
    }`,
  shortUsernameMutation: `mutation {
      signupUser (userSignupInput: {
        firstname: "test",
        lastname: "user",
        email: "testuser@gmail.com",
        username: "tes",
        password: "testpassword",
      }) {
        email
        username
      }
    }`,
  longUsernameMutation: `mutation {
      signupUser (userSignupInput: {
        firstname: "test",
        lastname: "user",
        email: "testuser@gmail.com",
        username: "testusernameistoolong",
        password: "testpassword",
      }, userProfileInput: { bio: "", avatar: ""}) {
        email
        username
      }
    }`
};

export default userMockData;

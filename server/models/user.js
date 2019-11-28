import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import sanitizeInputData from '../helper/sanitizeInputData';
import GeneralHelperClass from '../helper/GeneralHelperClass';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: 'Username exists',
    required: [true, 'Username is required'],
    minlength: [4, 'Username must consist of at least 4 characters'],
    maxlength: [15, 'Username must not exceed 15 characters'],
    validate: {
      validator(username) {
        return GeneralHelperClass.usernameValidation(username);
      },
      message: () => {
        const usernameValidationErrorMessage = 'Username can consist of only'
        + ' underscores, alphabets or numbers';
        return usernameValidationErrorMessage;
      }
    },
  },
  firstname: {
    type: String,
    required: [true, 'First name is required']
  },
  lastname: {
    type: String,
    required: [true, 'Last name is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  email: {
    type: String,
    unique: 'Email exists',
    required: [true, 'Email is required'],
    validate: {
      validator(email) {
        const emailValidationRegex = /\S+@\S+\.\S+/;
        return emailValidationRegex.test(email);
      },
      message: () => 'Invalid email'
    },
  },
  isVerified: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

userSchema.pre('validate', function preValidation() {
  const thisObject = this;
  /* eslint no-underscore-dangle: ["error", { "allow": ["_doc"] }] */
  thisObject._doc.firstname = sanitizeInputData
    .firstname(thisObject._doc.firstname);
  thisObject._doc.lastname = sanitizeInputData
    .lastname(thisObject._doc.lastname);
  thisObject._doc.email = sanitizeInputData
    .email(thisObject._doc.email);
  thisObject._doc.password = sanitizeInputData
    .password(thisObject._doc.password);
  thisObject._doc.username = sanitizeInputData
    .username(thisObject._doc.username);
});

userSchema.post('validate', async function passwordHash() {
  try {
    this._doc.password = await GeneralHelperClass
      .encryptPassword(this._doc.password);
  } catch (err) {
    throw err;
  }
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);

export default User;

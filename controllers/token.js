import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    // Include any other user information you want to send
  };

  // Sign the token with a secret key
  const token = jwt.sign(payload, 'Welcome@12345');

  return token;
};

export default generateToken;

import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  // Get the token from the request headers or query parameters or cookies
  const token = req.headers.authorization?.split(' ')[1] || req.query.token || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, 'Welcome@12345');

    // Attach the decoded token to the request object for further use
    req.user = decoded;
    next();
    return res.status(200).json({message:req.user})
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

export default authenticate;

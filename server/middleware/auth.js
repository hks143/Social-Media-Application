import jwt from "jsonwebtoken";

const secret = `${process.env.secret_key}`;

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const isCustomAuth = token?.length < 500;
    const NAME = req.headers.authorization?.split(" ")[2];
    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }
    req.target = NAME;
    next();
  } catch (error) {
    res.status(400).json({ message: "You are not allowed !" });
    console.log(error);
  }
};

export default auth;

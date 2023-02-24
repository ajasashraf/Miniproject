const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
//    got error here
    const token = req.headers["autherization"].split(" ")[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).send({
          message: "Auth filed",
          success: false,
        });
      } else {
        req.body.userId = decoded.id;
        next();
      }
    });
  } catch (error) {
    
    return res.status(401).send({
      message: "Auth fileddddd",
      success: false,
    });
  }
};


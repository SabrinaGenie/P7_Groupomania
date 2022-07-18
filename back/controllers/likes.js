const db = require("../models/database");
const jwt = require("jsonwebtoken"); 


exports.addLike = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    const userLike = await db.Like.findOne({
      // vérification de si il y'a déjà un like 
      where: {
        UserId: userId,
        PostId: req.params.postId,
      },
    });

    if (userLike) {
      // si oui on l'enlève de la base de données
      await db.Like.destroy(
        {
          where: {
            UserId: userId,
            PostId: req.params.postId,
          },
        },
        { truncate: true }
      );
      res.status(200).json({ msg: "Post disliké" });
    } else {
      // sinon le rajoute
      db.Like.create({
        UserId: userId,
        PostId: req.params.postId,
      });
      res.status(201).json({ msg: "Post liké" });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); 
const multer = require("../middleware/multer-config");

const postsCtrl = require("../controllers/post");
const commentsCtrl = require("../controllers/comments");
const likesCtrl = require("../controllers/likes");

router.post("/add", auth, multer, postsCtrl.createPost); // Création d'un post
router.get("/:id", auth, postsCtrl.getOnePost); // Obtention d'un post via l'user id
router.get("/", auth, postsCtrl.getAllPosts); // Obtention de tous les posts
router.put("/:id", auth, multer, postsCtrl.updatePost); // Modification d'un post
router.delete("/:id", auth, multer, postsCtrl.deletePost); // Suppression d'un post

router.post("/:postId/comments", auth, commentsCtrl.createComment); // Ajout d'un commentaire
router.get("/:postId/comments", auth, commentsCtrl.getComments); // Obtention de tous les commentaires d'un post
router.delete("/comments/:id", auth, commentsCtrl.deleteComment); // Suppression d'un commentaire

router.post("/:postId/likes", auth, likesCtrl.addLike); // Ajout d'un like
    
module.exports = router;
const express = require("express");
const router = express.Router();

const Article = require("../models/article");

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find({}, null, {
      sort: { _id: -1 },
    }).populate("scategorieID");
    // res.status(200).json(articles);
    res.status(200).json(articles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.get("/pagination", async (req, res) => {
  const filter = req.query.filter || "";

  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const articles = await Article.find(
    { designation: { $regex: filter, $options: "i" } },
    null,
    { sort: { _id: -1 } }
  ).populate("scategorieID");

  const paginatedProducts = articles.slice(startIndex, endIndex);

  const totalPages = Math.ceil(articles.length / pageSize);

  res.json({ products: paginatedProducts, totalPages });
});
router.get("/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  try {
    const article = await Article.findById(articleId);
    res.status(200).json(article);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.post("/", async (req, res) => {
  const newArticle = new Article(req.body);
  try {
    await newArticle.save();
    res.status(200).json(newArticle);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.put("/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  try {
    const article = await Article.findByIdAndUpdate(
      articleId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(article);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.delete("/:articleId", async (req, res) => {
  const articleId = req.params.articleId;
  try {
    await Article.findByIdAndDelete(articleId);
    res.status(200).json({ message: "article deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;

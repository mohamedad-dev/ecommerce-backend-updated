const express = require("express");
const router = express.Router();

const Scategorie = require("../models/scategorie");

router.get("/", async (req, res) => {
  try {
    const scategories = await Scategorie.find({}, null, {
      sort: { _id: -1 },
    }).populate("categorieID");
    res.status(200).json(scategories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.get("/:scategorieId", async (req, res) => {
  const scategorieId = req.params.scategorieId;
  try {
    const scategorie = await Scategorie.findById(scategorieId);
    res.status(200).json(scategorie);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.post("/", async (req, res) => {
  const newScategorie = new Scategorie(req.body);
  try {
    await newScategorie.save();
    res.status(200).json(newScategorie);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.delete("/:scategorieId", async (req, res) => {
  const scategorieId = req.params.scategorieId;
  try {
    await Scategorie.findByIdAndDelete(scategorieId);
    res.status(200).json({ message: "scategorie deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.put("/:scategorieId", async (req, res) => {
  const scategorieId = req.params.scategorieId;
  try {
    const scategorie = await Scategorie.findByIdAndUpdate(
      scategorieId,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(scategorie);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;

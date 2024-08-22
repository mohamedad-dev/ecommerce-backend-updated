const mongoose = require("mongoose");

// const Categorie = require("./categorie");

const scategorieSchema = mongoose.Schema({
  nomscategorie: { type: String, required: true },
  imagescategorie: { type: String, required: false },
  categorieID: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie" },
});

module.exports = mongoose.model("Scategorie", scategorieSchema);

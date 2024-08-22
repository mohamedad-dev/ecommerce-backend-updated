const express = require('express')
const router = express.Router()

const Categorie = require('../models/categorie')
const { verifyToken } = require('../middlewares/verify-token')
const { authorizeRoles } = require('../middlewares/authorizeRoles')

router.get('/', verifyToken, async (req, res) => {
  try {
    const categories = await Categorie.find({}, null, { sort: { _id: -1 } })
    res.status(200).json(categories)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

router.post(
  '/',
  verifyToken,
  authorizeRoles('admin', 'superadmin'),
  async (req, res) => {
    // const { nomcategorie, imagecategorie } = req.body;
    // const newCategorie = new Categorie({
    //   nomcategorie: nomcategorie,
    //   imagecategorie: imagecategorie,
    // });
    // same as
    const newCategorie = new Categorie(req.body)

    try {
      await newCategorie.save()
      res.status(200).json(newCategorie)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  }
)

router.get('/:categorieId', async (req, res) => {
  const categorieId = req.params.categorieId
  try {
    const categorie = await Categorie.findById(categorieId)
    res.status(200).json(categorie)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

router.put('/:categorieId', async (req, res) => {
  const categorieId = req.params.categorieId
  try {
    const categorie = await Categorie.findByIdAndUpdate(
      categorieId,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json(categorie)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

router.delete('/:categorieId', async (req, res) => {
  const categorieId = req.params.categorieId
  try {
    await Categorie.findByIdAndDelete(categorieId)
    res.status(200).json({ message: 'categorie deleted successfully' })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

module.exports = router

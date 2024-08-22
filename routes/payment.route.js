// const express = require('express')
// const router = express.Router()
// const Stripe = require('stripe')(
//   'sk_test_51Piie7Rq6VBdlzmVAhHUYl3bpk81uN3P34SsDjsWqy12hEvpjLEPRVYyibS7g77DG09buxejNqimanoLnyYuExXt008QJnFxqw'
// )
// router.post('/', async (req, res) => {
//   try {
//     const session = await Stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       line_items: req.body.cartItems.map((item) => {
//         return {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: item.designation,
//             },
//             unit_amount: item.prix * 100,
//           },
//           quantity: item.cartQuantity,
//         }
//       }),
//       success_url: `${process.env.CLIENT_URL}`,
//       cancel_url: `${process.env.CLIENT_URL}`,
//     })
//     res.json({ sessionId: session.id })
//   } catch (e) {
//     res.status(500).json({ error: e.message })
//   }
// })
// module.exports = router

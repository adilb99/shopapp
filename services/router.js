const express = require('express');
const router = new express.Router();
const client = require('../controllers/client.js');
const product = require('../controllers/product.js');
const categ = require('../controllers/categ.js');
const manuf = require('../controllers/manuf.js');
const pr_image = require('../controllers/pr_image.js');
const cart = require('../controllers/cart.js');
 
router.route('/client/:id?')
  .get(client.get)
  .post(client.post)
  .put(client.put)
  .delete(client.delete); 


router.route('/product/:id?')
    .get(product.get)
    .post(product.post)
    .put(product.put)
    .delete(product.delete);

router.route('/manuf/:id?')
    .get(manuf.get)
    .post(manuf.post)
    .put(manuf.put)
    .delete(manuf.delete);


router.route('/categ/:id?')
    .get(categ.get)
    .post(categ.post)
    .put(categ.put)
    .delete(categ.delete);

router.route('/pr_image/:id?')
    .get(pr_image.get)
    .post(pr_image.post)
    .put(pr_image.put)
    .delete(pr_image.delete);

router.route('/cart/:id?')
    .get(cart.get)
    .post(cart.post)
    .put(cart.put)
    .delete(cart.delete);


module.exports = router;
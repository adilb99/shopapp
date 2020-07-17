const express = require('express');
const router = new express.Router();
const client = require('../controllers/client.js');
const product = require('../controllers/product.js');
const categ = require('../controllers/categ.js');
const manuf = require('../controllers/manuf.js');
const pr_image = require('../controllers/pr_image.js');
const cart = require('../controllers/cart.js');
const cart_content = require('../controllers/cart_content.js'); 
const review = require('../controllers/review.js');
const ord = require('../controllers/ord.js');
const order_status = require('../controllers/order_status.js');
const cart_status = require('../controllers/cart_status.js');
const cart_history = require('../controllers/cart_history.js');
const cart_content_history = require('../controllers/cart_content_history.js');
const ord_item = require('../controllers/ord_item.js');
const address = require('../controllers/address.js');
const sequence = require('../controllers/sequence.js');



router.route('/client/:id?')
  .get(client.get)
  .post(client.post)
  .put(client.put)  // TBE
  .delete(client.delete); // TBD


router.route('/product/:id?')
    .get(product.get)
    .post(product.post)
    .put(product.put)  // TBE
    .delete(product.delete); // TBD

router.route('/manuf/:id?')
    .get(manuf.get)
    .post(manuf.post)
    .put(manuf.put)
    .delete(manuf.delete);  // TBD


router.route('/categ/:id?')
    .get(categ.get)
    .post(categ.post)
    .put(categ.put)
    .delete(categ.delete);  // TBD

router.route('/pr_image/:id?')
    .get(pr_image.get)
    .post(pr_image.post)
    .put(pr_image.put)
    .delete(pr_image.delete);

router.route('/cart/:id?')
    .get(cart.get)
    .post(cart.post)
    .put(cart.put)
    .delete(cart.delete); // TBD

router.route('/cart_content/:id?')
    .get(cart_content.get)
    .post(cart_content.post)
    .put(cart_content.put)  // TBE
    .delete(cart_content.delete);


router.route('/review/:id?')
    .get(review.get)
    .post(review.post)
    .put(review.put)
    .delete(review.delete);


router.route('/ord/:id?')
    .get(ord.get)
    .post(ord.post)
    .put(ord.put);


router.route('/order_status/:id?')
    .get(order_status.get)
    .post(order_status.post)
    .put(order_status.put)
    .delete(order_status.delete);



router.route('/cart_status/:id?')
    .get(cart_status.get)
    .post(cart_status.post)
    .put(cart_status.put)
    .delete(cart_status.delete);



router.route('/cart_history/:id?')
    .get(cart_history.get)
    .delete(cart_history.delete);


router.route('/cart_content_history/:id?')
    .get(cart_content_history.get)
    .delete(cart_content_history.delete);

router.route('/ord_item/:id?')
    .get(ord_item.get)
    .delete(ord_item.delete);

router.route('/address/:id?')
    .get(address.get);


router.route('/sequence/:sequence_name?')
    .get(sequence.get);


module.exports = router;
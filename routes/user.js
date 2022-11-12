var express = require('express');
const app = require('../app');
const middlewares = require('../controllers/middlewares');

var router = express.Router();

let controllers = require('../controllers/user-controllers')

/* GET home page. */
router.get('/',controllers.userHome);

router.get('/login',controllers.userLogin)

router.post('/login',controllers.userPostLogin)

router.get('/sendotp',controllers.userOtpLogin)

router.post('/sendotp',controllers.userPostSendOtp)

router.post('/submitotp',controllers.userPostSubmitOtp)

router.get('/register',controllers.userRegister)
  
router.post('/register',controllers.userPostRegister)

router.get('/products-list',controllers.userProductList)

router.get('/product-details/:id',controllers.userProductDetails) 

router.get('/cart/:id',controllers.userAjaxCart)

router.get('/cart',controllers.userCart)

router.post('/cart/addQuantity',controllers.userAjaxAddQuantity)

router.post('/cart/removeProduct',controllers.userPostAjaxRemoveProductfromCart)

router.get('/cart-checkout',controllers.userCartCheckout)

router.get('/checkout/address',controllers.userCheckoutAddAddress)


router.post('/checkout-placeOrder',controllers.userPlaceOrder)

router.get('/orderSummary',controllers.getSummary)

router.get('/userProfile',controllers.userProfile)

router.get('/profile/accountInfo',controllers.userProfileAccountInfo)

router.post('/savedInfo',controllers.userPostAccountInfoSaved)


// Address Part for Profile and checkout 
router.get('/profile/address',controllers.userProfileAddress)
router.patch('/addAddress',controllers.userPostProfileAddAddress)
router.post('/geteditAddressDetails',controllers.userEditAddress)
router.patch('/editAddress',controllers.userPostEditAddress)
router.delete('/deleteAddress/:id',controllers.userDeleteAddress)



router.get('/logout',controllers.userLogout)




router.post('/changePassword',controllers.userPostChangePassword)

router.post('/cancelOrder',controllers.userCancelOrder)

router.get('/orderhistory',controllers.userOrderHistory)

router.post('/verify-payment',controllers.ajaxverifyPayment)

router.get('/success',controllers.paypalPayment);

router.get('/viewdetails/:id',controllers.OrderDetails)

router.get('/test',controllers.test)    //for testing try and caTCH

router.patch('/coupon-validate',controllers.couponValidate)

router.get('/coupons',controllers.coupons)    

router.get('/refferal',controllers.refferal)

router.get('/register/:id',controllers.refferallink)

router.get('/wallet',controllers.wallet)

router.get('/wishlist',controllers.wishlist);

router.get('/add-to-wishlist/:id',controllers.addToWishlist);

router.post('/wishlist/removeProduct',controllers.removeWishlistProduct)

router.get('/remove-wishlist/:id',controllers.removeWishlist);

router.post('/filter',controllers.filter)

router.post('/getFruits',controllers.productSearch) 


module.exports = router;








// router.post('/checkout/addAddress',controllers.userPostCheckoutAddress)
// router.get('/userAddress',controllers.userProfileAddAddress)




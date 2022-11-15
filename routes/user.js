var express = require('express');
const app = require('../app');
const middlewares = require('../controllers/middlewares');
const { wishlist } = require('../controllers/user-controllers');
var router = express.Router();
let controllers = require('../controllers/user-controllers')

/* GET home page. */ 
router.get('/',controllers.userHome);
router.post('/getFruits',middlewares.userSessionManagement,controllers.productSearch)
router.get('/login',controllers.userLogin)
router.post('/login',controllers.userPostLogin)
router.get('/sendotp',controllers.userOtpLogin)
router.post('/sendotp',controllers.userPostSendOtp)
router.post('/submitotp',controllers.userPostSubmitOtp)
router.get('/register',controllers.userRegister)
router.post('/register',controllers.userPostRegister)
router.get('/logout',controllers.userLogout)

// products 
router.get('/products-list',middlewares.userSessionManagement,controllers.userProductList)
router.get('/product-details/:id',middlewares.userSessionManagement,controllers.userProductDetails) 
router.post('/filter',middlewares.userSessionManagement,controllers.filter)
router.get('/products-list/:brand',middlewares.userSessionManagement,controllers.brandwiseproduct) 

// cart 
router.get('/cart/:id',middlewares.userSessionManagement,controllers.userAjaxCart)
router.get('/cart',middlewares.userSessionManagement,controllers.userCart)
router.post('/cart/addQuantity',middlewares.userSessionManagement,controllers.userAjaxAddQuantity)
router.post('/cart/removeProduct',middlewares.userSessionManagement,controllers.userPostAjaxRemoveProductfromCart)

// checkout 
router.get('/cart-checkout',middlewares.userSessionManagement,controllers.userCartCheckout)
router.get('/checkout/address',middlewares.userSessionManagement,controllers.userCheckoutAddAddress)
router.post('/checkout-placeOrder',middlewares.userSessionManagement,controllers.userPlaceOrder)
router.get('/orderSummary',middlewares.userSessionManagement,controllers.getSummary)

// payment 
router.post('/verify-payment',middlewares.userSessionManagement,controllers.ajaxverifyPayment)
router.get('/success',middlewares.userSessionManagement,controllers.paypalPayment);

// profile 
router.get('/userProfile',middlewares.userSessionManagement,controllers.userProfile)
router.get('/profile/accountInfo',middlewares.userSessionManagement,controllers.userProfileAccountInfo)
router.post('/savedInfo',middlewares.userSessionManagement,controllers.userPostAccountInfoSaved)
router.post('/changePassword',middlewares.userSessionManagement,controllers.userPostChangePassword)

// Address Part for Profile and checkout 
router.get('/profile/address',middlewares.userSessionManagement,controllers.userProfileAddress)
router.patch('/addAddress',middlewares.userSessionManagement,controllers.userPostProfileAddAddress)
router.post('/geteditAddressDetails',middlewares.userSessionManagement,controllers.userEditAddress)
router.patch('/editAddress',middlewares.userSessionManagement,controllers.userPostEditAddress)
router.delete('/deleteAddress/:id',middlewares.userSessionManagement,controllers.userDeleteAddress)

// order history 
router.get('/orderhistory',middlewares.userSessionManagement,controllers.userOrderHistory)
router.post('/cancelOrder',middlewares.userSessionManagement,controllers.userCancelOrder)
router.get('/viewdetails/:id',middlewares.userSessionManagement,controllers.OrderDetails)
router.get('/replace-order/:id',middlewares.userSessionManagement,controllers.rePlaceOrder)


// coupon 
router.get('/coupons',middlewares.userSessionManagement,controllers.coupons)    
router.patch('/coupon-validate',middlewares.userSessionManagement,controllers.couponValidate)

// refferel 
router.get('/refferal',middlewares.userSessionManagement,controllers.refferal)
router.get('/register/:id',middlewares.userSessionManagement,controllers.refferallink)

// wallet 
router.get('/wallet',middlewares.userSessionManagement,controllers.wallet)

// wishlist 
router.get('/wishlist',middlewares.userSessionManagement,controllers.wishlist);
router.get('/add-to-wishlist/:id',middlewares.userSessionManagement,controllers.addToWishlist);
router.post('/wishlist/removeProduct',middlewares.userSessionManagement,controllers.removeWishlistProduct)
router.get('/remove-wishlist/:id',middlewares.userSessionManagement,controllers.removeWishlist);

module.exports = router;




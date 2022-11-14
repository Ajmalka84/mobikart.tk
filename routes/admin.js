var express = require('express');
var router = express.Router();
let middlewares = require ('../controllers/middlewares')
let controllers = require('../controllers/admin-controllers')
const { upload } = require('../public/javascripts/fileupload');
const { adminHomePage, adminUserManagement, bannerManagement } = require('../controllers/admin-controllers');
const { adminSessionManagement } = require('../controllers/middlewares');


/* GET users listing. */
router.get('/',adminSessionManagement,adminHomePage);
router.post('/',controllers.adminPostLogin)
router.get('/logout',controllers.adminLogout);

// user management 
router.get('/usermanagement',middlewares.adminSessionManagement,adminUserManagement)
router.get('/usermanagement/block/:id',middlewares.adminSessionManagement,controllers.adminBlockUser)
router.get('/usermanagement/unblock/:id',middlewares.adminSessionManagement,controllers.adminUnblockUser)
// user management 

// product management 
router.get('/productmanagement',middlewares.adminSessionManagement,controllers.adminProductManagement)
router.get('/productmanagement/addproduct',middlewares.adminSessionManagement,controllers.adminAddProduct)
router.post('/productmanagement/addproduct',upload.array('image'),middlewares.adminSessionManagement,controllers.adminPostAddProduct)
router.get('/productmanagement/editproduct/:id',middlewares.adminSessionManagement,controllers.adminEditProduct)
router.post('/productmanagement/editproduct/:id',upload.array('image'),middlewares.adminSessionManagement,controllers.adminPostEditProduct)
router.get('/productmanagement/deleteproduct/:id',middlewares.adminSessionManagement,controllers.adminDeleteProduct)
// product management 

// category management 
router.get('/categorymanagement',middlewares.adminSessionManagement,controllers.adminCategoryManagement)
router.get('/categorymanagement/add',middlewares.adminSessionManagement,controllers.adminAddCategory)
router.post('/categorymanagement/add',middlewares.adminSessionManagement,upload.any('image'),controllers.adminPostAddCategory)
router.get('/categorymanagement/edit/:id',middlewares.adminSessionManagement,controllers.adminEditCategory)
router.post('/categorymanagement/edit/:id',middlewares.adminSessionManagement,controllers.adminPostEditCategory)
router.get('/categorymanagement/delete/:id',middlewares.adminSessionManagement,controllers.adminDeleteCategory)
// category management

// order management 
router.get('/ordermanagement',middlewares.adminSessionManagement,controllers.adminOrderManagement)
router.post('/change-order-status',middlewares.adminSessionManagement,controllers.changeProductStatus)
router.get('/ordermanagement/orderDetails/:id',middlewares.adminSessionManagement,controllers.adminOrderDetails)
router.get('/ordermanagement/orderDetails',middlewares.adminSessionManagement,controllers.adminOrderDetailswithoutURL)
router.post('/cancelOrder',middlewares.adminSessionManagement,controllers.adminCancelOrder)
// order management 

// sales report
router.get('/salesReport',middlewares.adminSessionManagement,controllers.salesReport)
// sales report 

// product management
router.get('/offerManagement',middlewares.adminSessionManagement,controllers.offerManagement)
router.post('/apply-offer',middlewares.adminSessionManagement,controllers.applyOffer)
router.post('/edit-offer',middlewares.adminSessionManagement,controllers.editOffer)
router.get('/delete-offer/:id',middlewares.adminSessionManagement,controllers.deleteOffer)
// product management 

// category offer 
router.get('/category-offer',middlewares.adminSessionManagement,controllers.categoryOffer)
router.post('/apply-category-offer',middlewares.adminSessionManagement,controllers.applyCategoryOffer)
router.post('/edit-category-offer',middlewares.adminSessionManagement,controllers.editCategoryOffer)
router.get('/delete-category-offer/:brand/:id',middlewares.adminSessionManagement,controllers.deleteCategoryOffer)
// category offer

// coupon management 
router.get('/coupon-management',middlewares.adminSessionManagement,controllers.couponManagement)
router.post('/add-coupon',middlewares.adminSessionManagement,controllers.addCoupon)
router.post('/edit-coupon',middlewares.adminSessionManagement,controllers.editCoupon)
router.get('/delete-coupon/:id',middlewares.adminSessionManagement,controllers.deleteCoupon)
// coupon management

// banner Management 
router.get('/banner-management',middlewares.adminSessionManagement,controllers.bannerManagement)
router.get('/add-banner',middlewares.adminSessionManagement,controllers.addBanner)
router.post('/add-banner',middlewares.adminSessionManagement,upload.any('image'),controllers.adminAddBanner)
router.get('/edit-banner/:id',middlewares.adminSessionManagement,controllers.editBanner)
router.post('/edit-banner',middlewares.adminSessionManagement,upload.any('image'),controllers.adminEditBanner)
router.get('/delete-banner/:id',middlewares.adminSessionManagement,controllers.deleteBanner)
// banner Management 

module.exports = router;

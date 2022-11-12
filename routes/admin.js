var express = require('express');
var router = express.Router();
let middlewares = require ('../controllers/middlewares')
let controllers = require('../controllers/admin-controllers')
const { upload } = require('../public/javascripts/fileupload');
const { adminHomePage, adminUserManagement } = require('../controllers/admin-controllers');
const { adminSessionManagement } = require('../controllers/middlewares');


/* GET users listing. */
router.get('/',adminSessionManagement,adminHomePage);

router.post('/',controllers.adminPostLogin)

router.get('/usermanagement',middlewares.adminSessionManagement,adminUserManagement)

router.get('/usermanagement/block/:id',middlewares.adminSessionManagement,controllers.adminBlockUser)

router.get('/usermanagement/unblock/:id',middlewares.adminSessionManagement,controllers.adminUnblockUser)

router.get('/productmanagement',middlewares.adminSessionManagement,controllers.adminProductManagement)

router.get('/productmanagement/addproduct',middlewares.adminSessionManagement,controllers.adminAddProduct)

router.post('/productmanagement/addproduct',upload.array('image'),middlewares.adminSessionManagement,controllers.adminPostAddProduct)

router.get('/productmanagement/editproduct/:id',middlewares.adminSessionManagement,controllers.adminEditProduct)

router.post('/productmanagement/editproduct/:id',upload.array('image'),middlewares.adminSessionManagement,controllers.adminPostEditProduct)

router.get('/productmanagement/deleteproduct/:id',middlewares.adminSessionManagement,controllers.adminDeleteProduct)

router.get('/categorymanagement',middlewares.adminSessionManagement,controllers.adminCategoryManagement)

router.get('/categorymanagement/add',middlewares.adminSessionManagement,controllers.adminAddCategory)

router.post('/categorymanagement/add',middlewares.adminSessionManagement,upload.any('image'),controllers.adminPostAddCategory)

router.get('/categorymanagement/edit/:id',middlewares.adminSessionManagement,controllers.adminEditCategory)

router.post('/categorymanagement/edit/:id',middlewares.adminSessionManagement,controllers.adminPostEditCategory)

router.get('/categorymanagement/delete/:id',middlewares.adminSessionManagement,controllers.adminDeleteCategory)

router.get('/ordermanagement',middlewares.adminSessionManagement,controllers.adminOrderManagement)

router.get('/ordermanagement/orderDetails',middlewares.adminSessionManagement,controllers.adminOrderDetailswithoutURL)

router.get('/ordermanagement/orderDetails/:id',middlewares.adminSessionManagement,controllers.adminOrderDetails)

router.post('/cancelOrder',middlewares.adminSessionManagement,controllers.adminCancelOrder)

router.get('/logout',controllers.adminLogout);

router.post('/changeProductStatus',middlewares.adminSessionManagement,controllers.changeProductStatus)

// router.post('/changeProductStatus',middlewares.adminSessionManagement,controllers.changeProductStatus)

router.get('/salesReport',middlewares.adminSessionManagement,controllers.salesReport)


router.get('/offerManagement',middlewares.adminSessionManagement,controllers.offerManagement)


router.post('/apply-offer',middlewares.adminSessionManagement,controllers.applyOffer)
router.post('/edit-offer',middlewares.adminSessionManagement,controllers.editOffer)
router.get('/delete-offer/:id',middlewares.adminSessionManagement,controllers.deleteOffer)



router.post('/apply-category-offer',middlewares.adminSessionManagement,controllers.applyCategoryOffer)
router.post('/edit-category-offer',middlewares.adminSessionManagement,controllers.editCategoryOffer)
router.get('/delete-category-offer/:brand/:id',middlewares.adminSessionManagement,controllers.deleteCategoryOffer)



router.get('/coupon-management',middlewares.adminSessionManagement,controllers.couponManagement)
router.post('/add-coupon',middlewares.adminSessionManagement,controllers.addCoupon)
router.post('/edit-coupon',middlewares.adminSessionManagement,controllers.editCoupon)
router.get('/delete-coupon/:id',middlewares.adminSessionManagement,controllers.deleteCoupon)


router.get('/banner-management',middlewares.adminSessionManagement,controllers.bannerManagement)
router.get('/add-banner',middlewares.adminSessionManagement,controllers.addBanner)
router.post('/add-banner',middlewares.adminSessionManagement,upload.any('image'),controllers.adminAddBanner)
router.get('/edit-banner/:id',middlewares.adminSessionManagement,controllers.editBanner)
router.post('/edit-banner',middlewares.adminSessionManagement,upload.any('image'),controllers.adminEditBanner)
router.get('/delete-banner/:id',middlewares.adminSessionManagement,controllers.deleteBanner)

module.exports = router;

let adminhelpers =require('../helpers/admin-helpers');


module.exports={
    
  adminHomePage : (req, res, next)=> {
    adminhelpers.bringGraph().then((response)=>{
      adminhelpers.paymentGraph().then((paymentGraph)=>{
        const {weeklySales, monthlySales, yearlySales}=response;
        adminhelpers.salesToday().then((salesToday)=>{
        adminhelpers.numberofUsers().then((users)=>{
         adminhelpers.last5orders().then((lastfive)=>{
           console.log(paymentGraph);
           console.log('paymentGraph');
           res.render('./admin/admin-home',{adminheader:true,adminlink:true,weeklySales,monthlySales,yearlySales,paymentGraph,salesToday,users,lastfive})
         })
        })
        })
      }).catch((error)=>{
        console.log(error);
        throw error;
      })
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },
  
  adminPostLogin : (req,res)=>{
    adminhelpers.doAdminLogin(req.body).then((response)=>{
      if(response.status){
        req.session.adminloggedin=true
        res.redirect('/admin')
      }else{
        res.redirect('/admin')
      }
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminUserManagement : (req,res)=>{
    adminhelpers.userinfo().then((response)=>{   
      res.render('./admin/user-management',{adminheader:true,response,adminlink:true})
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },
  
  adminBlockUser: (req,res)=>{
    adminhelpers.userblock(req.params.id).then((response)=>{      
      res.redirect('/admin/usermanagement')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminUnblockUser : (req,res)=>{
    adminhelpers.userunblock(req.params.id).then((response)=>{      
      res.redirect('/admin/usermanagement')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminProductManagement : (req,res)=>{
    adminhelpers.productinfo().then((response)=>{   
      res.render('./admin/product-management',{adminheader:true,adminlink:true,response})
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminAddProduct : (req,res)=>{
    adminhelpers.findCategory().then((response)=>{
      res.render('./admin/add-product',{adminheader:true,adminlink:true,response})
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminPostAddProduct :  (req,res)=>{
   try {
     console.log(req.body);
     const files = req.files
     const file = files.map((file)=>{
         return file
     })
     const fileName = file.map((file)=>{
         return file.filename
     })
     const product  = req.body
     product.img = fileName
     adminhelpers.addproduct(product).then((data)=>{      
           res.redirect('/admin/productmanagement')       
     }).catch((error)=>{
       console.log(error);
       throw error;
     })
    } catch (error) {
       console.log(error);
    }
  },
  
  adminEditProduct : (req,res)=>{
    adminhelpers.editproduct(req.params.id).then((response)=>{
      res.render('./admin/edit-product',{adminheader:true,adminlink:true,response})
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminPostEditProduct : (req,res)=>{   
  try {
    const files = req.files
    const file = files.map((file)=>{
        return file
    })
    const fileName = file.map((file)=>{
        return file.filename
    })
    const product  = req.body
    product.img = fileName
    adminhelpers.submitEditproduct(req.params.id,product).then((response)=>{
      res.redirect('/admin/productmanagement')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })

  } catch (error) {
    console.log(error);
  }  
  },

  adminDeleteProduct : (req,res)=>{
    adminhelpers.deleteProduct(req.params.id).then((response)=>{
      res.redirect('/admin/productmanagement')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminCategoryManagement : (req,res)=>{
    adminhelpers.findCategory().then((response)=>{
      res.render('admin/category-management',{adminheader:true,adminlink:true,response})
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminAddCategory : (req,res)=>{
    res.render('admin/add-category',{adminheader:true,adminlink:true})
  },

  adminPostAddCategory : (req,res)=>{
   try {  
     console.log(req.body);
     const files = req.files
     console.log(files);
     const file = files.map((file)=>{
       console.log(file);
         return file
     })
     const fileName = file.map((file)=>{
         return file.filename
     })
     const product  = req.body
     product.img = fileName
     console.log(product)
     adminhelpers.addCategory(product).then((response)=>{
       if(response.status){
         res.redirect('/admin/categorymanagement')
       }else{
         res.redirect('/admin/categorymanagement')
       }
     }).catch((error)=>{
       console.log(error);
       throw error;
     })
   } catch (error) {
     console.log(error);
   } 
  },

  adminEditCategory : (req,res)=>{
    adminhelpers.findCategoryForEdit(req.params.id).then((response)=>{
      res.render('admin/edit-category',{adminheader:true,adminlink:true,response})
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminPostEditCategory : (req,res)=>{  
    adminhelpers.findCategoryAndUpdate(req.params.id,req.body).then((response)=>{
      res.redirect('/admin/categorymanagement')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminDeleteCategory : (req,res)=>{
    adminhelpers.deleteCategory(req.params.id).then((response)=>{
      res.redirect('/admin/categorymanagement')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },
  productReturn : (req, res)=>{
    adminhelpers.returnOrders().then((response)=>{
      adminhelpers.returnOrders2().then((response2)=>{
        console.log(response);
        console.log(response2);
      res.render('admin/return-approval',{adminheader:true,adminlink:true,response,response2})
    })
  })
  },
  productApproved :  (req, res)=>{
  
    adminhelpers.approveRequest(req.params.id).then((response)=>{
       res.redirect('/admin/return-approval')
   })
  },

  productRejected :  (req, res)=>{
  
    adminhelpers.rejectRequest(req.params.id).then((response)=>{
       res.redirect('/admin/return-approval')
  })
  },

  adminOrderManagement : (req,res)=>{
    adminhelpers.fullOrder().then((fullOrder)=>{
      fullOrder.forEach(element => {
        if(element.status==='shipped'){
          element.shippedstatus=true
        }else if(element.status==='Out for delivery'){
          element.outdeliverystatus=true
        }else if (element.status==='delivered'){
          element.deliverystatus=true
        }else{
          element.otherstatus=true
        }
       });
      res.render('admin/order-management',{adminheader:true,adminlink:true,fullOrder})
      console.log(fullOrder);
      console.log('fullOrder');
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminLogout : (req, res)=>{
    req.session.adminloggedin=false 
    res.redirect('/admin')
  },

  adminOrderDetails : (req,res)=>{
    req.session.params=req.params.id
    res.redirect('/admin/ordermanagement/orderDetails')
  },

  adminOrderDetailswithoutURL : (req,res)=>{
    
    adminhelpers.productsfromOrder(req.session.params).then((response)=>{
      
      console.log('response for orderdetails');
      response.forEach(element => {
        if(element.productStatus==='cancelled')
          element.cancelled=true
       });
       console.log(response);
       console.log('response');
      res.render('admin/order-details',{adminheader:true,adminlink:true,response})
    }).catch((error)=>{
      console.log(error);
      throw error;
    }) 
   
  },

  adminCancelOrder : (req,res)=>{
    console.log(req.body);
    adminhelpers.cancelOrders(req.body).then((response)=>{
      console.log(response);
      console.log('//////////');
      res.redirect('/admin/ordermanagement/orderDetails')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  changeProductStatus: (req,res)=>{
    console.log(req.body);
   adminhelpers.changeStatus(req.body).then((response)=>{
     
     console.log(response)
     res.json({status:true})
   }).catch((error)=>{
    console.log(error);
    throw error;
  })
  },

  salesReport : (req,res)=>{
    adminhelpers.salesreport().then((response)=>{
      const {weeklySales, monthlySales, yearlySales,weeklyTotal,monthlyTotal,yearlyTotal}=response;
      res.render('admin/sales-report',{adminheader:true,adminlink:true,weeklySales, monthlySales, yearlySales,weeklyTotal,monthlyTotal,yearlyTotal})
      console.log(weeklySales,weeklyTotal);
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  offerManagement : (req,res)=>{
    adminhelpers.getOfferlessProduct().then((response)=>{
    adminhelpers.getOfferProduct().then((offerApplied)=>{
    adminhelpers.getOfferlessCategory().then((offerlessCategory)=>{
    adminhelpers.getOfferCategory().then((offerCategory)=>{

      res.render('admin/offer-management',{adminheader:true,adminlink:true,response,offerApplied,offerlessCategory,offerCategory})
          }).catch((error)=>{
            console.log(error);
            throw error;
          })
        }).catch((error)=>{
          console.log(error);
          throw error;
        })
      }).catch((error)=>{
        console.log(error);
        throw error;
      })
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  categoryOffer : (req,res)=>{
   
   
    adminhelpers.getOfferlessCategory().then((offerlessCategory)=>{
    adminhelpers.getOfferCategory().then((offerCategory)=>{
      res.render('admin/category-offer',{adminheader:true,adminlink:true,offerlessCategory,offerCategory})
      }).catch((error)=>{
        console.log(error);
        throw error;
      })
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },
  
  applyOffer : (req,res)=>{
       
    adminhelpers.applyProductsOffer(req.body).then((response)=>{
       res.redirect('/admin/offerManagement')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  applyCategoryOffer : (req,res)=>{
     
    adminhelpers.applyCategoryOffer(req.body).then((response)=>{
       res.redirect('/admin/category-offer')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },


  editOffer : (req,res)=>{
    
    
    adminhelpers.editProductsOffer(req.body).then((response)=>{
       res.redirect('/admin/offerManagement')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  editCategoryOffer : (req,res)=>{
      
    adminhelpers.editCategoryOffer(req.body).then((response)=>{
       res.redirect('/admin/category-offer')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },
  
  deleteOffer : (req,res)=>{
      
    adminhelpers.deleteProductsOffer(req.params.id).then(()=>{
       res.redirect('/admin/offerManagement')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  deleteCategoryOffer : (req,res)=>{
    
    console.log(req.params);
    adminhelpers.deleteCategoryOffer(req.params.id,req.params.brand).then(()=>{
       res.redirect('/admin/category-offer')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  couponManagement : (req,res)=>{
    adminhelpers.getCoupons().then((response)=>{
      res.render('admin/coupon-management',{adminheader:true,adminlink:true,response})
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  addCoupon: (req,res)=>{
   
    adminhelpers.addCoupon(req.body).then((response)=>{
      res.redirect('/admin/coupon-management')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  editCoupon: (req,res)=>{
   
    adminhelpers.editCoupon(req.body).then((response)=>{
      res.redirect('/admin/coupon-management')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },
  
  deleteCoupon : (req,res)=>{
   
    adminhelpers.deleteCoupon(req.params.id).then((response)=>{
      res.redirect('/admin/coupon-management')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  bannerManagement: (req,res)=>{
    adminhelpers.getBanner().then((response)=>{
      res.render('admin/banner-management',{adminheader:true,adminlink:true,response})
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  addBanner : (req,res)=>{
      res.render('admin/add-banner',{adminheader:true,adminlink:true})
  },

  adminAddBanner : (req,res)=>{
    console.log(req.body);
    const files = req.files
    console.log(files);
    const file = files.map((file)=>{
      console.log(file);
        return file
    })
    const fileName = file.map((file)=>{
        return file.filename
    })
    const product  = req.body
    product.img = fileName
    console.log(product)
    adminhelpers.addBanner(product).then((response)=>{
      if(response.status){
        res.redirect('/admin/banner-management')
      }else{
        res.redirect('/admin/banner-management')
      }
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

   editBanner :  (req,res)=>{
    adminhelpers.editBanner(req.params.id).then((response)=>{
      res.render('admin/edit-banner',{adminheader:true,adminlink:true,response})
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  adminEditBanner : (req,res)=>{
    console.log(req.body);
    const files = req.files
    console.log(files);
    const file = files.map((file)=>{
      console.log(file);
        return file
    })
    const fileName = file.map((file)=>{
        return file.filename
    })
    const product  = req.body
    product.img = fileName
    console.log(product)
    adminhelpers.adminEditBanner(product).then(()=>{
        res.redirect('/admin/banner-management')      
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },

  deleteBanner : (req,res)=>{   
    adminhelpers.deleteBanner(req.params.id).then((response)=>{
      res.redirect('/admin/banner-management')
    }).catch((error)=>{
      console.log(error);
      throw error;
    })
  },
}
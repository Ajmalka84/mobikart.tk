let userhelpers =require('../helpers/user-helpers');
let twilio = require('twilio');
const serviceID = process.env.serviceID
const accountSID = process.env.accountSID
const token = process.env.token
const client = require('twilio')(accountSID, token)
let paypal = require('paypal-rest-sdk');
const e = require('express');
const { ReservationList } = require('twilio/lib/rest/taskrouter/v1/workspace/task/reservation');
require('dotenv').config()

let loginmessage
let mob={No:null}
let cartCount


module.exports={
  userHome : async(req, res, next)=> {
    try {
      if(req.session.loggedIn){
        cartCount = await userhelpers.cartCount(req.session.user._id) //try
        userhelpers.wishlistCount(req.session.user._id).then((wishlist)=>{
        userhelpers.getBanner().then((banners)=>{
          userhelpers.findCategory().then((response)=>{  
           userhelpers.getHotDealsProducts().then((hotDeals)=>{
            userhelpers.getHighDemandProducts().then((highDemand)=>{

              res.render('user/user-home',{title:false,userheader:true,response,banners,cartCount,wishlist,hotDeals,highDemand})
            })
           })  
        })

        })
        })
      }else{
        userhelpers.findCategory().then((response)=>{
          res.render('./user/user-home',{title:true,userheader:true,response});
        }).catch((error)=>{
          console.log(error);
        })
      }
      
    } catch (error) {
      console.log(error);
      throw err;
    }
  },
  
  userLogin : (req,res)=>{
    if(req.session.loggedIn){
      res.redirect('/')
    }else{
      res.render('./user/user-login',{loginmessage})
      loginmessage=''
    }
  },
  
  userPostLogin : (req,res)=>{
    userhelpers.doLogin(req.body).then((response)=>{
      if(response.status){
        req.session.loggedIn=true;
            req.session.user=response.user
            console.log(req.session.user._id);          
            res.redirect('/')
          }else{
            loginmessage='Invalid Email or password'
            res.redirect('/login')
          }
        }).catch((error)=>{
          console.log(error);
        })
      },
      
      userOtpLogin : (req,res)=>{
        if(req.session.loggedIn){
          res.redirect('/')
        }else{
          res.render('./user/user-sendotp')
        }
      },
      
      userPostSendOtp : (req,res)=>{
        if(req.session.loggedIn){
          res.redirect('/')
        }else{
          userhelpers.mobilecheck(req.body).then((response)=>{
            if (response.status) {
              req.session.mobile=req.body.mobile
              mob.No=req.body.mobile
              client.verify.services(serviceID).verifications.create({
                to: `+91${mob.No}`,
                channel: 'sms',}).then((data)=>{  
                  console.log('otp sent');          
                  res.redirect('/sendotp')    //succes      
                }).catch((error)=>{
                  console.log(error);
                })
              } else {
                res.redirect('/sendotp')
              }
            }).catch((error)=>{
              console.log(error);
            })
          }
        },
        
        userPostSubmitOtp : (req,res)=>{
          console.log(mob.No);
          if (req.session.loggedIn) {
            res.redirect('/')
          }else{
            req.session.code=req.body.otp
           
            client.verify.services(serviceID).verificationChecks.create({
              to: `+91${mob.No}`,
              code: req.session.code
            })
            .then((data)=>{
              if(data.status === 'approved'){
                console.log('........'+mob.No);
                userhelpers.doOtpLogin(mob.No).then((response)=>{
                  if (response.status){
                    req.session.loggedIn=true
                    res.redirect('/')
                  } else {
                    res.redirect('/sendotp')
                  }
                }).catch((error)=>{
                  console.log(error);
                })
              }else{
                res.redirect('/sendotp')
             }
          }).catch((error)=>{
            console.log(error);
          })
        }
      },
      
      userRegister : (req,res)=>{
        if (req.session.loggedIn) {
          res.redirect('/')
        }else{
          res.render('./user/user-register')
        }
      },

      userPostRegister : (req,res)=>{
        if (req.session.loggedIn) {
          res.redirect('/')
        }else{
          console.log(req.body);
          userhelpers.dosignup(req.body).then((response)=>{
            if (response.status) {
              res.redirect('/register') //fail      
            }else{
              res.redirect('/login')
            }
          }).catch((error)=>{
            console.log(error);
          })
        }
      },
      
      userProductList :async (req,res)=>{
        if(req.session.loggedIn){
          
          // pagination
          const page = parseInt(req.query.page) 
            const limit =5
            console.log(typeof(limit));
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const results = {}
          
              let productsCount= await userhelpers.getProductsCount()
              console.log(productsCount);
              console.log('===========');

            if (endIndex < productsCount) {
              results.next = {
                page: page + 1,
                limit: limit
              }
            }
            
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              }
            } 
            let response = await  userhelpers.bringProducts(limit,startIndex) 
            results.pageCount =Math.ceil(parseInt(productsCount)/parseInt(limit)).toString() 
            results.pages =Array.from({length: results.pageCount}, (_, i) => i + 1)    
            results.currentPage =page.toString()

            console.log(results);
            console.log(response);
            
            console.log('response=======');
            // pagination
          
            userhelpers.bringCategory().then((category)=>{ 
            userhelpers.wishlistCount(req.session.user._id).then((wishlist)=>{ 
            res.render('user/products-list',{userheader:true,response,title:false,cartCount,wishlist,results,category})
          })
          }).catch((error)=>{
            console.log(error);
          })
        }else{
          userhelpers.bringProducts().then((response)=>{
            res.render('user/products-list',{userheader:true,response,title:true})
          }).catch((error)=>{
            console.log(error);
          })
        }
      },
      
      userProductDetails : (req,res)=>{
        if (req.session.loggedIn) {
          userhelpers.productinfo(req.params.id).then((response)=>{
            userhelpers.getProducts(response[0]._id).then((products)=>{
              res.render('user/product-details',{userheader:true,response,products,title:false,cartCount})
              console.log(products);
              console.log('products=================');
            })
          }).catch((error)=>{
            console.log(error);
          })
        } else {
          userhelpers.productinfo(req.params.id).then((response)=>{
            res.render('user/product-details',{userheader:true,response,title:true})
          }).catch((error)=>{
            console.log(error);
          })
        }
      },
      
             
      userCart : async(req,res)=>{
        if(req.session.loggedIn){
          cartCount = await userhelpers.cartCount(req.session.user._id)
          console.log(cartCount);    
          if(cartCount== 0 || cartCount==undefined || cartCount== null){
            res.render('user/cart',{userheader:true,title:false})
          }else{
            
            userhelpers.getCart(req.session.user._id).then((response)=>{
              userhelpers.cartTotal(req.session.user._id).then((grandtotal)=>{
                if(grandtotal[0].grandtotal == 0){
                  res.render('user/cart',{userheader:true,title:false,response,cartCount})
                }
                  else{
                  res.render('user/cart',{userheader:true,title:false,response,cartCount,grandtotal})
                }
              }).catch((error)=>{
                console.log(error);
              })
            }).catch((error)=>{
              console.log(error);
            })
          }
        }else{
          res.redirect('/login')
        }
      },
      
      userAjaxCart : (req,res)=>{
        if(req.session.loggedIn){    
          userhelpers.cartManage(req.session.user._id,req.params.id).then((response)=>{
            console.log(response+'what i want');
            res.json({status:true})
          }).catch((error)=>{
            console.log(error);
          })
        }else{
          res.redirect('/login')
        }
      },
      
      userAjaxAddQuantity : async(req,res)=>{
       try {
         cartCount = await userhelpers.cartCount(req.session.user._id)
         console.log(cartCount);
         if(req.session.loggedIn){
           if (cartCount==0) {
             res.redirect('/cart')
           } else {
             userhelpers.addCartQuantity(req.body).then((response)=>{   
               userhelpers.cartTotal(req.session.user._id).then((grandtotal)=>{
                 response.grandtotal=grandtotal
                 res.json(response)
               }).catch((error)=>{
                 console.log(error);
               })  
             }).catch((error)=>{
               console.log(error);
             })
             
           }
         }else{
           res.send('nbotkshk')
         }
       } catch (error) {
         console.log(error);
       }
      },
      
      userPostAjaxRemoveProductfromCart : (req,res)=>{
        
        if(req.session.loggedIn){
          userhelpers.removeProduct(req.body).then((response)=>{ 
            res.json({response})
          }).catch((error)=>{
            console.log(error);
          })
        }else{
          res.send('nbotkshk')
        }
      },

      removeWishlistProduct: (req,res)=>{
        
        if(req.session.loggedIn){
          userhelpers.removeWishlistProduct(req.body).then((response)=>{ 
            res.json({response})
          }).catch((error)=>{
            console.log(error);
          })
        }else{
          res.send('nbotkshk')
        }
      },
      
      userCartCheckout :async (req,res)=>{
        
        if(req.session.loggedIn){
          let cartCount =await userhelpers.cartCount(req.session.user._id)
          console.log(cartCount);
          if(cartCount==0 || cartCount==undefined){
              res.redirect('/cart')
          }else{
            userhelpers.findAddress(req.session.user._id).then((data)=>{
              userhelpers.getCart(req.session.user._id).then((other)=>{
               
                userhelpers.cartTotal(req.session.user._id).then((resp)=>{
                  console.log(other);
                  res.render('user/user-checkout',{userheader:true,title:false,data,other,resp})
                }).catch((error)=>{
                  console.log(error);
                })
              }).catch((error)=>{
                console.log(error);
              })
            }).catch((error)=>{
              console.log(error);
            })
            
          }
        }else{
          console.log('////');
          res.send('000000')
        }
      },
      
      userProfile : (req,res)=>{
        if (req.session.loggedIn) {
          userhelpers.getUserInfo(req.session.user._id).then((response)=>{
               console.log(response);
               console.log('===========');
            res.render('user/user-profile',{userheader:true,title:false,response})
          })
        } else {
          res.redirect('/')
        }
      },
      
      userProfileAccountInfo : (req,res)=>{
        if(req.session.loggedIn){
          userhelpers.getUserInfo(req.session.user._id).then((response)=>{
            res.render('user/account-info',{userheader:true,title:false,response})
          }).catch((error)=>{
            console.log(error);
          })
        }else{
          res.redirect('/')
        }
      },
      
      userPostAccountInfoSaved : (req,res)=>{
        if (req.session.loggedIn) {
          userhelpers.accountInfoEdit(req.session.user._id,req.body).then((response)=>{
            res.redirect('/profile/accountInfo')
          }).catch((error)=>{
            console.log(error);
          })
        } else {
          res.redirect('/')
        }
      },
      
      userProfileAddress : (req,res)=>{
        if(req.session.loggedIn){
          userhelpers.findAddress(req.session.user._id).then((response)=>{
            console.log(response);
            res.render('user/user-address',{userheader:true,title:false,response})
          }).catch((error)=>{
            console.log(error);
          })
        }else{
          res.redirect('/')
        }
      },
      
      
      userPostProfileAddAddress: (req,res)=>{
        console.log(req.body);
        console.log('this is what i want');
        if (req.session.loggedIn) {
          userhelpers.createAddress(req.session.user._id,req.body).then(()=>{
            res.json({status:true})
          }).catch((error)=>{
            console.log(error);
          })
        } else {
          res.redirect('/')
        }
      },
      
      userLogout : (req,res)=>{
        req.session.loggedIn=false
        res.redirect('/')
      },
      
      userCheckoutAddAddress : (req,res)=>{
        if(req.session.loggedIn){
          res.render('user/checkout-add-address',{userheader:true,title:false})
        }else{
          res.redirect('/')
        }
      },
      
      
      userPlaceOrder : async(req,res)=>{
        
        if (req.session.loggedIn) {
            console.log(req.body);
          if (!req.body.AddressId) {
             res.json({status:true})
          } else {
            userhelpers.findCart(req.session.user._id).then((response1)=>{
              userhelpers.cartTotal(req.session.user._id).then((response2)=>{
                console.log(response2);
                console.log('response2');
                 
                userhelpers.placeOrder(req.session.user._id,response1,req.body,response2[0].grandtotal,response2[0].cpn).then(async(orderId)=>{
                  if(req.body['paymentOptions']==='COD'){
                    res.json({codSuccess:true})
                  }else if(req.body['paymentOptions']==='razorpay'){
                    userhelpers.generateRazorpay(orderId,response2[0].grandtotal).then((order)=>{
                      res.json({order,razor:true})
                    }).catch((error)=>{
                      console.log(error);
                  })
                }else if (req.body['paymentOptions']==='paypal'){
                  req.session.orderId=orderId
                  
                  paypal.configure({
                    'mode': 'sandbox', //sandbox or live
                    'client_id': 'Ae7Efp4PbxNQOrfOn43BQyHmQnhl9Mw5SUz2FWH1W9aIfDnw-aCsts6R-tA3TU1cy5PaZ8XXiuNPNRjP',
                    'client_secret': 'ED-6PSgdN1XbZnVMJzXvFHh5K7q444TPNm6MOAW9i6ECxuIgud7BQciYxTTT6qPbhqU2xBS1O6XlhtQo'
                  });
                  
                  const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                      "payment_method": "paypal"
                    },
                    "redirect_urls": {
                              "return_url": "http://localhost:3000/success",
                              "cancel_url": "http://localhost:3000/cancel"
                            },
                            "transactions": [{
                              "item_list": {
                                  "items": [{
                                    "name": "Red Sox Hat",
                                    "sku": "001",
                                    "price": "5.00",
                                    "currency": "USD",
                                    "quantity": 1
                                  }]
                                  },
                                  "amount": {
                                "currency": "USD",
                                "total": "5.00"
                              },
                              "description": "Hat for the best team ever"
                            }]
                          };
                       
                      paypal.payment.create(create_payment_json, function  (error, payment) {
                        if (error) {
                          throw error;
                        } else {
                          for(let i = 0;i < payment.links.length;i++){
                              if(payment.links[i].rel === 'approval_url'){
                                console.log(payment);
                                res.json(payment.links[i].href);
                              }
                            } 
                          }
                        });  
                      }
                      let deletedcart =  await userhelpers.deleteCart(req.session.user._id)                 
                    }).catch((error)=>{
                      console.log(error);
                    })
                  }).catch((error)=>{
                    console.log(error);
                  })
                }).catch((error)=>{
                  console.log(error);
          })
          }
            
        } else {
          res.redirect('/')
        }
      },
      
      getSummary : (req,res)=>{
        
        res.render('user/order-summary',{userheader:true,title:false})
      },
      
      ajaxverifyPayment : (req,res)=>{
        console.log(req.body['receipt']);
        console.log('this is what i want');
        userhelpers.verifyPayment(req.body).then(()=>{
          userhelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
            
            console.log('payment successful');
            res.json({status:true})
          }).catch((err)=>{
            console.log(err);
            res.json({status:false,errMsg:''})
          })
        }).catch((error)=>{
          console.log(error);
        })
      },
      
      paypalPayment :  (req, res) => {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        
        const execute_payment_json = {
          "payer_id": payerId,
          "transactions": [{
            "amount": {
              "currency": "USD",
              "total": "5.00"
            }
          }]
        };
        
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
          if (error) {
              console.log(error.response);
              throw error;
            } else {
            console.log(JSON.stringify(payment));
            console.log('==================orderId================');
            console.log(req.session.orderId);
            req.session.orderId.toString()
            
              userhelpers.changePaymentStatus(req.session.orderId).then((response)=>{
                console.log(response);
                req.session.orderId=null
                console.log('==================orderId================');
                console.log(req.session.orderId);
                res.redirect('/orderSummary');
              }).catch((error)=>{
                console.log(error);
              })
            }
          });
      },
      
      
      userDeleteAddress : (req,res)=>{
        if (req.session.loggedIn) {
          console.log(req.params.id);
          userhelpers.deleteAddress(req.params.id).then((response)=>{
            res.json({status:true})
          }).catch((error)=>{
            console.log(error);
          })
        } else {
          res.redirect('/')
        }
      },
      
      userEditAddress : (req,res)=>{
        console.log(req.body);
        
        if (req.session.loggedIn) {
                 
          userhelpers.findAddressWithId(req.body.addressId).then((response)=>{
            console.log(response);
            res.json(response)
          }).catch((error)=>{
            console.log(error);
            throw error;
          })
        } else {
          res.redirect('/')
        }
      },
      
      userPostEditAddress : (req,res)=>{
        if (req.session.loggedIn) {
          console.log(req.body);
          userhelpers.editAddress(req.body.addressId,req.body).then((response)=>{
            res.json({status:true})
          }).catch((error)=>{
            console.log(error);
            throw error;
          })
        } else {
          res.redirect('/')
        }
      },
      
      userPostChangePassword : (req,res)=>{
        if (req.session.loggedIn) {
          
          userhelpers.changePassword(req.session.user._id,req.body).then((response)=>{
            if (response) {
              console.log('Password not updated');
              res.redirect('/profile/accountInfo')
            } else {
              console.log('Password updated');
              res.redirect('/profile/accountInfo')  
            }
          }).catch((error)=>{
            console.log(error);
            throw error;
          })
        } else {
          res.redirect('/')
        }
      },
      
      userCancelOrder : (req,res)=>{
        console.log(req.body);
        if (req.session.loggedIn) {
          
          userhelpers.cancelOrders(req.body).then((response)=>{
            res.redirect('/orderHistory')
          }).catch((error)=>{
            console.log(error);
            throw error;
          })
        } else {
          res.redirect('/login')
        }
      },
      
      userOrderHistory : (req,res)=>{
        try {
          if(req.session.loggedIn){
              userhelpers.findOrderforOrderHistory(req.session.user._id).then((response)=>{
                res.render('user/order-history2',{userheader:true,title:false,response})
              }).catch((error)=>{
                console.log(error);
                throw error;
              })
            }else{
              res.redirect('/login')
            
          }         
        } catch (error) {
          console.log(error);
        }
      },
      
      OrderDetails : (req,res)=>{
        userhelpers.showOrder(req.params.id).then((response)=>{
          console.log(response);
          console.log('////////');
          response.forEach(element => {
            if(element.productStatus==='cancelled')
            element.cancelled=true
          });
          console.log(response);
          res.render('user/order-details',{userheader:true,title:false,response})
        }).catch((error)=>{
          console.log(error);
          throw error;
        })
      },

      
      couponValidate : async (req,res)=>{
        console.log(req.body);
        let cartTotal =await userhelpers.cartTotal(req.session.user._id)
        userhelpers.couponValidate(req.body,req.session.user._id,cartTotal[0].grandtotal).then((response)=>{          
          userhelpers.insertcoupontocart(req.session.user._id,response.couponAmount,response.couponOffer).then(async(inserted)=>{
                userhelpers.cartTotal(req.session.user._id).then((priceAftercouponOffer)=>{
                  response.priceAftercouponOffer= priceAftercouponOffer
                  
                  console.log(response);
                  res.json(response)
                })
                
              })
            })
          },
          
          coupons : (req,res)=>{
            userhelpers.coupons().then((response)=>{
              userhelpers.usedCoupons().then((usedCoupons)=>{
                let usedCoupon = usedCoupons
                response.forEach(element => {
                  if(element.name===usedCoupon.couponCode){
                element.status=true
              }
            });
            console.log(response);
            
            res.render('user/coupons',{userheader:true,title:false,response,usedCoupons})
          })
        })
      },
      
      refferal : (req,res)=>{
        let userid =req.session.user._id
        let userdetails ={
          userid: userid
        }
        console.log(userdetails);
        res.render('user/refferal',{userheader:true,title:false,userdetails})
      },

      refferallink: (req,res)=>{
        console.log(req.params.id);
        userhelpers.checkforRefferal(req.params.id).then((response)=>{
          response[0].id=req.params.id
          console.log(response);
          res.render('user/user-register',{response})
        }).catch((err)=>{
          console.log(err);
        })
      },
      
      test : (req,res,next)=>{
       try {
        //  if(req.session.loggedIn){
           userhelpers.testtry().then((response)=>{
             
             res.send('Hello this is a test............')
           }).catch((error)=>{
             console.log(error);
             
           })
        //  }else{
          //  res.send('session Issue')
        //  }
          
       } catch (error) {
          console.log(error);
       }
      },

      wallet : (req,res)=>{
        userhelpers.checkforWallet(req.session.user._id).then((response)=>{
          console.log(response);
          res.render('user/wallet',{userheader:true,title:false,response})
        })
      },

      wishlist : (req, res)=>{
        userhelpers.wishlistCount(req.session.user._id).then((wishlist)=>{
          userhelpers.bringWishlistProducts(req.session.user._id).then((response)=>{
          res.render('user/wishlist',{userheader:true,title:false,response,wishlist,cartCount});
        })
      })
      },

      addToWishlist : (req, res)=>{
        console.log(req.params.id);
        userhelpers.createWishlist(req.params.id,req.session.user._id).then((response)=>{

          res.json(response);
        })
      },

      removeWishlist : (req, res)=>{
        console.log(req.params.id);
        userhelpers.removeWishlist(req.params.id,req.session.user._id).then((response)=>{

          res.json(response);
        })
      },

      filter :  async (req,res)=>{
        if(req.session.loggedIn){
          
          // pagination
          const page = parseInt(req.query.page) 
            const limit =5
            console.log(typeof(limit));
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const results = {}
          
              let productsCount= await userhelpers.getProductsCount()
              console.log(productsCount);
              console.log('===========');
  
            if (endIndex < productsCount) {
              results.next = {
                page: page + 1,
                limit: limit
              }
            }
            
            if (startIndex > 0) {
              results.previous = {
                page: page - 1,
                limit: limit
              }
            } 
            let response = await  userhelpers.filter(req.body,limit,startIndex) 
            results.pageCount =Math.ceil(parseInt(productsCount)/parseInt(limit)).toString() 
            results.pages =Array.from({length: results.pageCount}, (_, i) => i + 1)    
            results.currentPage =page.toString()
  
            console.log(results);
            console.log(response);
          
            // pagination
          
            userhelpers.bringCategory().then((category)=>{ 
            userhelpers.wishlistCount(req.session.user._id).then((wishlist)=>{ 
            res.render('user/products-list',{userheader:true,response,title:false,cartCount,wishlist,results,category})
          })
          }).catch((error)=>{
            console.log(error);
          })
        }else{
          userhelpers.bringProducts().then((response)=>{
            res.render('user/products-list',{userheader:true,response,title:true})
          }).catch((error)=>{
            console.log(error);
          })
        }
      },

      productSearch : async (req, res)=>{
        let payload = req.body.payload.trim()
        console.log(payload);
        let search =await userhelpers.productSearch(payload)
        console.log(search);
        search = search.slice(0,5)
        res.json({payload: search})
      },
    }
        
        
   
    
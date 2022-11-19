const db = require('../config/connection');
const bcrypt = require('bcrypt');
const { response } = require('../app');
// const { ObjectId } = require('mongodb');
let collection = require('../config/collection')
const objId = require('mongodb').ObjectId
const Razorpay = require('razorpay');
const { resolve } = require('path');
const { error } = require('console');
const { ifError } = require('assert');


var instance = new Razorpay({
    key_id: 'rzp_test_lRVn8mJEEw8PB2',
    key_secret: 'KBwULg2zuSLToJ3gDCe47MTZ',
});

module.exports={
    doLogin:(userData)=>
    {
        return new Promise(async(resolve,reject)=>{
          try {
              let response = {}
              let userfind=await db.get().collection(collection.USER_COLLECTION).findOne({$and:[{email:userData.email,status:'true'}]})
              if(userfind){ 
                  bcrypt.compare(userData.password,userfind.password).then((status)=>{
                    if(status){
                      
                      response.user=userfind
                      response.status=true
                      resolve(response)
                    }else{
                      
                      response.status=false
                      resolve(response)
                    }  
                  }).catch((error)=>{
                    reject(error)
                })
              }else{
                  
                  response.status=false
                  resolve(response)           
              }
            
          }catch(error){
            reject(error)
          }  
        })
    },

    dosignup: (userdata)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userdata.referalid);
           try {
               let response={}
               if (userdata.referalid == undefined || userdata.referalid === '' || userdata.referalid == null) {

                   userdata.password=userdata.password.toString()
                   userdata.password= await bcrypt.hash(userdata.password,10)
                   
                   let emailcheck=await db.get().collection(collection.USER_COLLECTION).findOne({email:userdata.email})
                   if(emailcheck){
                       response.status=true;
                       response.user=userdata;
                       resolve(response)
                   }else{
                       response.status=false;
                       db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then((data)=>{
                           
                           response.user=userdata;
                           resolve(response)
                       }).catch((error)=>{
                        reject(error)
                       })
                   }            
               } else {
                   userdata.password=userdata.password.toString()
                   userdata.password= await bcrypt.hash(userdata.password,10)
                   
                   let emailcheck=await db.get().collection(collection.USER_COLLECTION).findOne({email:userdata.email})
                   if(emailcheck){
                    
                       response.status=true;
                       response.user=userdata;
                       resolve(response)
                    }else{
                        response.status=false;
                        db.get().collection(collection.USER_COLLECTION).insertOne({
                            name: userdata.name,
                            name1: userdata.name1,
                            email:  userdata.email,
                            mobile : userdata.mobile,
                            password : userdata.password,
                            status: userdata.password

                        }).then(async(data)=>{
                           let updatereferal = await  db.get().collection(collection.USER_COLLECTION).updateOne({_id:objId(userdata.referalid)},{$set: {refferalRecieved: 50}})
                           
                           response.user=userdata;
                           resolve(response)
                       }).catch((error)=>{
                        reject(error)
                       })
                   }
               }
           } catch (error) {
              reject(error)
           }
           
        })
    },

    mobilecheck : (userdata)=>{
        
        return new Promise (async(resolve,reject)=>{
           try {
               let response ={}
               let userfind = await db.get().collection(collection.USER_COLLECTION).findOne({mobile:userdata.mobile})
               if(userfind){
                   response.status=true;
                   resolve(response)
               }else{
                   
                   response.status=false;
                   resolve(response)
               }
           } catch (error) {
              reject(error)
           }
        })
    },
    doOtpLogin:(userData)=>
    {
        return new Promise(async(resolve,reject)=>{
        try {
            let response = {}
            let userfind=await db.get().collection(collection.USER_COLLECTION).findOne({mobile:userData})
            if(userfind){
                    
                    response.status=true
                    resolve(response)
            }else{
                
                response.status=false
                resolve(response)           
            }
            
        } catch (error) {
            reject(error)
        }
        })
    },

    bringProducts : (limit,startIndex)=>{
        return new Promise (async(resolve,reject)=>{
           try {
               console.log(limit,startIndex);
                   let bringProducts = await db.get().collection(collection.PRODUCTS_COLLECTION).aggregate([
                       {
                           $addFields : {
                               selectedOffer: {
                                   $cond : {
                                       if: {
                                           $gte: [{$toInt: '$productOffer'},{$toInt:'$categoryOffer'}]
                                       },
                                       then : '$productOffer',
                                       else: '$categoryOffer',
                                   }
                               },
                               priceAfterdiscount:{
                                   
                                   $cond : {
                                       if: {
                                           $gte: [{$toInt: '$productOffer'},{$toInt:'$categoryOffer'}]
                                       },
                                       then : {$subtract: [{$toInt: '$price'},{$round:[{$multiply:[{$toInt: '$price'},{$divide: [{$toInt: '$productOffer'},100]}]},0]}]},
                                       else: {$subtract: [{$toInt: '$price'},{$round:[{$multiply:[{$toInt: '$price'},{$divide: [{$toInt: '$categoryOffer'},100]}]},0]}]},
                                   }
                               },
                           }
                       },
                       {
                           $skip :startIndex
                       },
                       {
                           $limit : limit
                       }
                   ]).toArray()    
                       resolve(bringProducts)  
                       console.log(bringProducts);
                       console.log('=======bringProducts=======');           
            
           } catch (error) {
             reject(error)
           }    
          }) 
    },
   

     bringCategory: ()=>{
        return new Promise (async(resolve,reject)=>{
            try {
                let getCategories = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
                console.log(getCategories);
                console.log('===========');
                resolve(getCategories)
              
            } catch (error) {
              reject(error)
            }
        })
    },

    getProductsCount : ()=>{
        return new Promise (async(resolve,reject)=>{
            try {
            
                let productCount =await db.get().collection(collection.PRODUCTS_COLLECTION).find().count()
                console.log(productCount);
                console.log('===========');
                resolve(productCount)
            
            } catch (error) {
              reject(error)
            }
        })
    },

    productinfo : (productId)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                
                let bringProduct = await db.get().collection(collection.PRODUCTS_COLLECTION).aggregate([
                    {
                        $match : {
                            _id: objId(productId)
                        }
                    },
                    {
                        $addFields : {
                            selectedOffer: {
                                $cond : {
                                    if: {
                                        $gte: [{$toInt: '$productOffer'},{$toInt:'$categoryOffer'}]
                                    },
                                    then : '$productOffer',
                                    else: '$categoryOffer',
                                }
                            },
                            priceAfterdiscount:{
                                
                                $cond : {
                                    if: {
                                        $gte: [{$toInt: '$productOffer'},{$toInt:'$categoryOffer'}]
                                    },
                                    then : {$subtract: [{$toInt: '$price'},{$round:[{$multiply:[{$toInt: '$price'},{$divide: [{$toInt: '$productOffer'},100]}]},0]}]},
                                    else: {$subtract: [{$toInt: '$price'},{$round:[{$multiply:[{$toInt: '$price'},{$divide: [{$toInt: '$categoryOffer'},100]}]},0]}]},
                                }
                            },
                        }
                    }
                ]).toArray()
                resolve(bringProduct)
                console.log(bringProduct);
                console.log('bringProduct======');
            } catch (error) {
              reject(error)
            }
        })},

        getProducts : (productId)=>{
           
            console.log(productId);
            return new Promise (async(resolve,reject)=>{
                try {
            
                    let hotDeals = await db.get().collection(collection.PRODUCTS_COLLECTION).aggregate([
                        {
                           $match:  {_id:{$ne:productId} }
                        },
                        {
                            $addFields : {
                                selectedOffer: {
                                    $cond : {
                                        if: {
                                            $gte: [{$toInt: '$productOffer'},{$toInt:'$categoryOffer'}]
                                        },
                                        then : '$productOffer',
                                        else: '$categoryOffer',
                                    }
                                },
                                priceAfterdiscount:{
                                    
                                    $cond : {
                                        if: {
                                            $gte: [{$toInt: '$productOffer'},{$toInt:'$categoryOffer'}]
                                        },
                                        then : {$subtract: [{$toInt: '$price'},{$round:[{$multiply:[{$toInt: '$price'},{$divide: [{$toInt: '$productOffer'},100]}]},0]}]},
                                        else: {$subtract: [{$toInt: '$price'},{$round:[{$multiply:[{$toInt: '$price'},{$divide: [{$toInt: '$categoryOffer'},100]}]},0]}]},
                                    }
                                },
                            }
                        },
                        {
                            $unwind: 
                                '$selectedOffer'           
                        },
                        {
                            $sort:{
                               'selectedOffer':-1
                            }
                        },
                        {
                            $limit:6
                        },
                    ]).toArray()    
                        resolve(hotDeals)  
                        console.log(hotDeals);
                        console.log('=======hot Deals=======');           
                } catch (error) {
                  reject(error)
                }   
              }) 
        },
    

        findCategory : ()=>{
            return new Promise (async(resolve,reject)=>{
             try {
                 let findResult = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
                resolve(findResult)
               
             } catch (error) {
                reject(error)
             }
            })
        },

cartManage :(userData,productData)=>{
    return new Promise (async(resolve,reject)=>{
       try {
        
           let productDetails = {
               item:objId(productData),
               quantity:1
           }
           let userCheck =await db.get().collection(collection.CART_COLLECTION).findOne({user : objId(userData)})
           if(userCheck){
               let productExist = userCheck.products.findIndex(product=>product.item==productData)
               
               if(productExist!=-1){
                   
                   db.get().collection(collection.CART_COLLECTION).updateOne({user:objId(userData),'products.item':objId(productData)},{$inc:{'products.$.quantity':1}}).then((response)=>{
   
                       resolve(response)
                   }).catch((error)=>{
                       reject(error)
                  })
                   
               }else{
                   db.get().collection(collection.CART_COLLECTION).updateOne({user : objId(userData)},{$push:{products:productDetails},
                   })
                   .then((response)=>{
                   resolve()
                   }).catch((error)=>{
                    reject(error)
                    })
               }
           }else{
               let cartData = {
               user:objId(userData),
               products : [productDetails],
               }
           db.get().collection(collection.CART_COLLECTION).insertOne(cartData)
               .then((data)=>{  
                 resolve(data)               
               }).catch((error)=>{
                reject(error)
           })
           }
       } catch (error) {
          reject(error)
       } 
    })
}, 
         

        
getCart : (userId)=>{
        return new Promise (async(resolve, reject)=>{
            try {
                let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {$match:{
                        user:objId(userId)
                    }},
                    {
                        $unwind: '$products'
                    },
                    {
                        $project:{
                            item:'$products.item',
                            quantity:'$products.quantity'
                    
                     }
                    },
                    {
                        $lookup:{
                            from:collection.PRODUCTS_COLLECTION,
                            localField:"item",
                            foreignField:'_id',
                            as:"products"
                        }
                    },
                    {
                        $project:{
                           item:1,quantity:1,products:{$arrayElemAt:['$products',0]},           
                        }
                    },
                    {
                        $addFields: {
                            selectedOffer: {
                                $cond : {
                                    if: {
                                        $gte: [{$toInt: '$products.productOffer'},{$toInt:'$products.categoryOffer'}]
                                    },
                                    then : '$products.productOffer' ,
                                    else: '$products.categoryOffer',
                                }
                            },
                         discountAmount: {
                             $cond : {
                                 if: {
                                     $gte: [{$toInt: '$products.productOffer'},{$toInt:'$products.categoryOffer'}]
                                 },
                                 then : {$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.productOffer'},100]}] } ,
                                 else: {$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.categoryOffer'},100]}] } ,
                             }
                         },
                            priceAfterdiscount:{
                                $cond : {
                                    if: {
                                        $gte: [{$toInt: '$products.productOffer'},{$toInt:'$products.categoryOffer'}]
                                    },
                                    then : {$subtract: [{$toInt: '$products.price'},{$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.productOffer'},100]}] }] },
                                    else: {$subtract: [{$toInt: '$products.price'},{$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.categoryOffer'},100]}] }] },
                                }
                            },
                        }
                    },
                    {
                     $addFields: {
                       productTotal: {
                          $multiply:[ '$priceAfterdiscount','$quantity']
                       }     
                      }  
                    },                          
                ]).toArray() 
               console.log(cartItems);
                   resolve(cartItems)   
           } catch (error) {
              reject(error)
           }
})},

        cartCount : (userId)=>{
            return new Promise (async(resolve, reject)=>{
                try {
                    let count
                    let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objId(userId)})
                    if(cart){
                       count = cart.products.length               
                    }
                    resolve(count)
                } catch (error) {
                    reject(error)
                }
            })
        },

        wishlistCount : (userId)=>{
            return new Promise (async(resolve, reject)=>{
                try {
                    let count 
                    let wishlist = await db.get().collection(collection.WISHLIST_COLLECTION).findOne({userId:objId(userId)})
                    if(wishlist){
                       count = wishlist.products.length 
                       console.log(count);           
                    }
                    resolve(count)
                } catch (error) {
                    reject(error)
                }
            })
        },
        
        addCartQuantity:(details)=>{
    
            return new Promise ((resolve,reject)=>{
                try {
            
                    details.count=parseInt(details.count)
                    details.quantity=parseInt(details.quantity) 
                    if(details.count==-1 && details.quantity==1){
                        db.get().collection(collection.CART_COLLECTION).updateOne({_id : objId(details.cart)},{$pull:
                            {products:{item:objId(details.product)}}}).then((response)=>{
                                resolve({removeProduct:true})
                            }).catch((error)=>{
                                reject(error)
                           })
                    }else{
                        db.get().collection(collection.CART_COLLECTION).updateOne({_id:objId(details.cart),'products.item':objId(details.product)},{$inc:{'products.$.quantity':details.count}})
                        .then((response)=>{                    
                            resolve({removeProduct:false})
                        }).catch((error)=>{
                            reject(error)
                       })
                    }
                } catch (error) {
                  reject(error)
                }
            })
        },

        removeProduct: (details)=>{
            return new Promise ((resolve, reject)=>{
                try {
                    db.get().collection(collection.CART_COLLECTION).updateOne({_id : objId(details.cart)},{$pull:
                        {products:{item:objId(details.product)}}}).then((response)=>{
                            resolve({removeProduct:true})  
                        }).catch((error)=>{
                            reject(error)
                       })
                } catch (error) {
                  reject(error)
                }  
            }
        )},

        removeWishlistProduct: (details)=>{
            
            return new Promise ((resolve, reject)=>{
                try {
                    
                    db.get().collection(collection.WISHLIST_COLLECTION).updateOne({_id : objId(details.wishlist)},{$pull:
                        {products:{productId:objId(details.product)}}}).then((response)=>{
                            db.get().collection(collection.PRODUCTS_COLLECTION).updateOne({_id : objId(details.product)},{$unset:
                                {wishlist:true}})
                            resolve({removeProduct:true})  
                        }).catch((error)=>{
                            reject(error)
                       })
                } catch (error) {
                  reject(error)
                } 
            }
        )},

       
        cartTotal: (userId)=>{
            
            
            return new Promise(async(resolve,reject)=>{
               try {
                   let grandtotal = await db.get().collection(collection.CART_COLLECTION).aggregate([
                       {$match:{
                           user:objId(userId)
                       }},
                       {
                           $unwind: '$products'
                       },
                       {
                           $project:{
                               item:'$products.item',
                               quantity:'$products.quantity',
                               couponAmount: 1,
                               couponOffer : 1
                       
                        }

                       },
                       {
                           $lookup:{
                               from:collection.PRODUCTS_COLLECTION,
                               localField:"item",
                               foreignField:'_id',
                               as:"products"
                           }
                       },
                       {
                           $project:{
                              item:1,quantity:1,products:{$arrayElemAt:['$products',0]},couponAmount:1, couponOffer : 1           
                           }
                       },
                       {
                           $addFields: {
                            discountAmount: {
                                $cond : {
                                    if: {
                                        $gte: [{$toInt: '$products.productOffer'},{$toInt:'$products.categoryOffer'}]
                                    },
                                    then : {$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.productOffer'},100]}] } ,
                                    else: {$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.categoryOffer'},100]}] } ,
                                }
                            },
                               priceAfterdiscount:{
                                   $cond : {
                                       if: {
                                           $gte: [{$toInt: '$products.productOffer'},{$toInt:'$products.categoryOffer'}]
                                       },
                                       then : {$subtract: [{$toInt: '$products.price'},{$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.productOffer'},100]}] }] },
                                       else: {$subtract: [{$toInt: '$products.price'},{$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.categoryOffer'},100]}] }] },
                                   }
                               },
                           }
                       },
                       {
                        $addFields: {
                            productTotal:{
                                $cond : {
                                    if: {
                                        $eq: ['$priceAfterdiscount',null]
                                    },
                                    then :{$multiply:[{$toInt: '$products.price'},'$quantity'] },
                                    else:  { $multiply:[ '$priceAfterdiscount','$quantity']}       ,
                                }
                            },
                         }  
                       },
                       {
                          $group: {
                            _id: null ,
                            grandtotal: {$sum : '$productTotal'},cpn :{$push :'$couponAmount'}
                            
                          }
                       },
                       {
                        $project:{
                            grandtotal:1,cpn:{$arrayElemAt:['$cpn',0]}   
                        }
                       },
                       {
                        $project:{
                            grandtotal:1,cpn:1, priceaftercpndiscount: {$subtract:['$grandtotal','$cpn']}
                        }
                       }
                   ]).toArray()
                   resolve(grandtotal)

                //    if(grandtotal[0].grandtotal==0){

                //    }else{

                //    }
                   console.log('===========');
                   console.log(grandtotal);
                   console.log('===========');
                   
            } catch (error) {
                reject(error)
            }
            })
        },




        getUserInfo: (userId)=>{
            return new Promise (async(resolve,reject)=>{
               try {
                   let userDetails= await db.get().collection(collection.USER_COLLECTION).findOne({_id:objId(userId)})
                   resolve(userDetails)
               } catch (error) {
                  reject(error)
               }
            })
        },

        findAddress : (userId)=>{
            return new Promise(async(resolve,reject)=>{
             try {
                 let findAddress = await db.get().collection(collection.ADDRESS_COLLECTION).find({user:objId(userId)}).toArray()
                 resolve(findAddress)
             } catch (error) {
                reject(error)
             }
            })
        },

        createAddress : (userId,body)=>{                                        //used
            return new Promise (async(resolve,reject)=>{
              try {
                  let createAddress = await db.get().collection(collection.ADDRESS_COLLECTION).insertOne({
                      user:objId(userId),
                      firstname:body.firstname,
                      lastname:body.lastname,
                      address: body.address,
                      city : body.city,
                      pin : body.pin
                  })
                  resolve(createAddress)
              } catch (error) {
                 reject(error)
              }
            })
        },
      
        createOrder : (body,userId)=>{
            return new Promise((resolve,reject)=>{
              try {
                  body.userId=ObjectId(userId)
                 let insertOrder= db.get().collection(collection.ORDER_COLLECTION).insertOne(body)
                 resolve(insertOrder)
              } catch (error) {
                reject(error)
              }
            })
        },

        findOrder :(orderId)=>{
            return new Promise ((resolve,reject)=>{
                try {
                    db.get().collection(collection.ORDER_COLLECTION).find({_id:objId(orderId)}).toArray()
                    .then((response)=>{
                        resolve(response)
                    }).catch((error)=>{
                        reject(error)
                   })
            
                } catch (error) {
                  reject(error)
                }
            })
        },

        
        deleteAddress : (addressId)=>{
            return new Promise((resolve,reject)=>{
                try {
                    db.get().collection(collection.ADDRESS_COLLECTION).deleteOne({_id:objId(addressId)}).then((data)=>{
                    resolve(data)
                }).catch((error)=>{
                    reject(error)
               })
            
                } catch (error) {
                  reject(error)
                }
        })
    },

    editAddress : (addressId,body)=>{
        return new Promise ((resolve, reject)=>{
            try {
                db.get().collection(collection.ADDRESS_COLLECTION).updateOne({_id:objId(addressId)},
                {
                    $set:{
                        firstname:body.firstname,
                        lastname:body.lastname,
                        address:body.address,
                        city: body.city,
                        pin:body.pin
                    }
                }).then((response)=>{
                    resolve(response)
                }).catch((error)=>{
                    reject(error)
                })
            } catch (error) {
              reject(error)
            } 
        })
    },
    
    findAddressWithId : (addressId)=>{
        return new Promise(async(resolve,reject)=>{
            try {
              let findAddress = await db.get().collection(collection.ADDRESS_COLLECTION).find({_id:objId(addressId)}).toArray()
              resolve(findAddress)
              
            } catch (error) {
                reject(error)
          }
        })
    },
    
    accountInfoEdit: (userId,body)=>{
        return new Promise ((resolve,reject)=>{
            try {
                db.get().collection(collection.USER_COLLECTION).updateOne({_id:objId(userId)},
                {
                    $set:{
                    name:body.firstname,
                    name1:body.lastname,
                    email:body.email,
                }
               }).then((response)=>{
                resolve(response)
               }).catch((error)=>{
                reject(error)
            })
            } catch (error) {
              reject(error)
            }
    })
},

changePassword:(userId,body)=>{
        
    return new Promise(async(resolve,reject)=>{
        
        try {
            let userfind=await db.get().collection(collection.USER_COLLECTION).findOne({_id:objId(userId)})
        let response={}
        if (userfind) {
            await bcrypt.hash(body.currentpassword,10)
            await bcrypt.compare(body.currentpassword,userfind.password).then(async(data)=>{
                
                if(data){
                
                    body.newpassword=await bcrypt.hash(body.newpassword,10)

                    db.get().collection(collection.USER_COLLECTION).updateOne({_id:objId(userId)},
                    {
                        $set:{
                            password:body.newpassword
                    }
                }).then((data)=>{
                    response.status=true
                    resolve(response)
                }).catch((error)=>{
                    reject(error)
                })
            }else{
                response.status=false
                   resolve(response)            
               }   
            }).catch((error)=>{
                reject(error)
            })
        }else{
            resolve()
        }
    } catch (error) {
        reject(error)
    }
}) 
        
},

findCart: (userId)=>{
        return new Promise (async(resolve,reject)=>{
       try {
                let cart= await  db.get().collection(collection.CART_COLLECTION).findOne({user:objId(userId)})
                resolve(cart.products)
               
       } catch (error) {
           reject(error)
       }
    })
},

placeOrder :(userId,productId,body,total,couponDiscount)=>{   
    return new Promise(async(resolve,reject)=>{
        try {
            let status = body.paymentOptions === 'COD'? 'Order Placed':'Order Pending'
            let addressDetails = await db.get().collection(collection.ADDRESS_COLLECTION).findOne({_id:objId(body.AddressId)})
            const dateObject = new Date();
              const date = (`0 ${dateObject.getDate()}`).slice(-2);
              const month = (`0 ${dateObject.getMonth() + 1}`).slice(-2);
              const year = dateObject.getFullYear();
              const dates =`${year}-${month}-${date}`
              const months =`${year}-${month}`
              const years = `${year}`
              productId.forEach(element => {         // for entering product status to productId
                  element.productStatus='Placed'
                });
                
                let orderObj = {
                    date : dates,
                    month:months,
                    year: years,
                    user:objId(userId),
                    address:{
                      _id:objId(addressDetails._id),
                      firstname:addressDetails.firstname,
                      lastname:addressDetails.lastname,
                      address:addressDetails.address,
                      city:addressDetails.city,
                      pin:addressDetails.pin,
                    },
                  products:productId,
                  total: total,
                  couponDiscount: couponDiscount,
                  paymentMethod:body.paymentOptions,
                  status: status
                }
                
                db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then(async(data)=>{
                 
                    resolve(data.insertedId)
                  
              }).catch((error)=>{
                reject(error)
           })
        } catch (error) {
            reject(error)
          }
        })
    },

    findOrderforPayment : (orderId)=>{   
        return new Promise(async(resolve,reject)=>{
            try {
                
                    db.get().collection(collection.ORDER_COLLECTION).findOne({_id: objId(orderId)}).then((data)=>{
                        resolve(data)
                      
                  }).catch((error)=>{
                    reject(error)
               })
            } catch (error) {
                reject(error)
              }
            })
        },
    
    deleteCart:(userId)=>{
        return new Promise ((resolve,reject)=>{
            try {
                db.get().collection(collection.CART_COLLECTION).deleteOne({user:objId(userId)}).then((deleteddata)=>{
                  resolve()
                }).catch((error)=>{
                  reject(error)
                })
            
            } catch (error) {
              reject(error)
            }
        })
    },
    
    showOrder : (orderId)=>{
        return new Promise(async (resolve,reject)=>{
            try {
               let showOrder=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                   {
                       $match:{
                       _id:objId(orderId),
                    }
                },
                {
                    $unwind:'$products'                    
                },
                {
                    $project:{
                       user:1,
                       address:1,
                       item:'$products.item',
                       quantity:'$products.quantity',
                       productStatus : '$products.productStatus',
                       total:1,
                       paymentMethod:1,
                       status:1
                    }
                },
                {
                    $lookup:{
                       from:collection.PRODUCTS_COLLECTION,
                       localField:'item',
                       foreignField:'_id',
                       as:collection.PRODUCTS_COLLECTION
                    }
                },
                {
                    $project:{
                       user:1,
                       address:1,
                       quantity:1,
                       productStatus:1,
                       total:1,
                       paymentMethod:1,
                       status:1,
                       products:{$arrayElemAt:['$products',0]},                  
                    }
               },
               {
                   $addFields: { 
                       
                       selectedOffer: {
                        $cond : {
                            if: {
                                $gte: [{$toInt: '$products.productOffer'},{$toInt:'$products.categoryOffer'}]
                            },
                            then : '$products.productOffer' ,
                            else: '$products.categoryOffer',
                        }
                      },
                      discountAmount: {
                        $cond : {
                            if: {
                                $gte: [{$toInt: '$products.productOffer'},{$toInt:'$products.categoryOffer'}]
                            },
                            then : {$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.productOffer'},100]}] } ,
                            else: {$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.categoryOffer'},100]}] } ,
                        }
                    },
                       priceAfterdiscount:{
                           $cond : {
                               if: {
                                   $gte: [{$toInt: '$products.productOffer'},{$toInt:'$products.categoryOffer'}]
                               },
                               then : {$subtract: [{$toInt: '$products.price'},{$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.productOffer'},100]}] }] },
                               else: {$subtract: [{$toInt: '$products.price'},{$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.categoryOffer'},100]}] }] },
                           }
                       },
                       
                    } 
                },
                {
                    $addFields: {productTotal:{$multiply:['$priceAfterdiscount','$quantity']}}
                },
               {
                   $project:{
                       user:1,
                       address:1,
                       quantity:1,
                       productStatus:1,
                       total:1,
                       paymentMethod:1,
                       status:1,
                       products:1,
                       productTotal:1,
                       selectedOffer:1,discountAmount:1, priceAfterdiscount:1
                    }
               }
            ]).toArray()
              console.log(showOrder);
              console.log('showOrder');
              resolve(showOrder)
            } catch (error) {
                reject(error)
            }        
        })
    },

    returnRequest : (body)=>{
        return new Promise ((resolve,reject)=>{
            try {
                db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objId(body.orderId)},{$set : {returnRequest : 'pending',status: 'return pending'}}).then((request)=>{
                    console.log(request);
                    console.log('request');
                    resolve()
                }).catch((error)=>{
                  reject(error)
                })
            } catch (error) {
              reject(error)
            }
        })
    },

    cancelOrders: (body)=>{
        return new Promise((resolve,reject)=>{
            try {
            
                // let findOrder=await db.get().collection(collection.ORDER_COLLECTION).findOne({$and:[{_id:objId(body.orderId)},{'products.item':objId(body.productId)}]})
                // body.quantity=parseInt(body.quantity)
                // if(findOrder){
                    db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objId(body.orderId)},{$set:{status:'cancelled'}})
                //   db.get().collection(collection.ORDER_COLLECTION).updateOne({$and:[{_id:objId(body.orderId)},{'products.item':objId(body.productId)}]},{$set:{status:'cancelled','products.$.productStatus':'cancelled'}})
                  .then((response)=>{
                      resolve(response)
                  }).catch((error)=>{
                     reject(error)
                })
            //  }else{
            //    resolve()
            //  }
            } catch (error) {
                reject(error)
          }
        })
    },

    generateRazorpay : (orderId,total)=>{
        return new Promise((resolve,reject)=>{
            try {
                var options = {
                  amount: total*100,  // amount in the smallest currency unit
                  currency: "INR",
                  receipt: ''+orderId
                };
                instance.orders.create(options, function(err, order) {
                  resolve(order)
                });
                
            } catch (error) {
                reject(error)
            }
        })
    },
    
    verifyPayment : (details)=>{
        return new Promise ((resolve,reject)=>{
            try {
                var crypto = require("crypto");
                var hmac = crypto.createHmac('sha256', 'KBwULg2zuSLToJ3gDCe47MTZ')
                hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
                hmac= hmac.digest('hex')
                if(hmac==details['payment[razorpay_signature]']){
                    resolve()
                }else{
                    reject()
                }
            
            } catch (error) {
              reject(error)
            }
        })
    },
    
    changePaymentStatus : (order)=>{
        return new Promise((resolve,reject)=>{
            try {
                db.get().collection(collection.ORDER_COLLECTION).updateOne({_id: objId(order)},{$set:{status:'Order Placed'}}).then(()=>{
                    resolve()
                }).catch((error)=>{
                    reject(error)
                })
            } catch (error) {
              reject(error)
            }
        })
    },
    
    generatePaypal : (req,res)=>{
        return new Promise((resolve,reject)=>{
            resolve()
        })
    },
    
    findOrderforOrderHistory : (userId)=>{
        try {
            
            return new Promise(async(resolve,reject)=>{
               
            let findOrder =await  db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                   $match : {user:objId(userId)}
                },
                {
                    $addFields: { 
                        
                        priceAfterCoupondiscount:{
                            $cond : {
                                if: {
                                    $gte: [{$toInt: '$total'},{$toInt:'$couponDiscount'}]
                                },
                                then : {$subtract: ['$total','$couponDiscount'] },
                                else:  {$subtract: ['$total','$couponDiscount'] },
                            }
                        },
                        
                     } 
                 },
                 {
                    $sort :{'date':-1 }
                 }
            ])
            .toArray()
            resolve(findOrder)
            
        })
        
            
        } catch (error) {
            console.log(error);
        }
    },

    testtry : ()=>{
        return new Promise ((resolve,reject)=>{
           try {
               let msg = 'fuck you'
               if(msg  ==='fuck you'){
                  console.log('error is here');
                  reject('problem in message')
               }else{
                   console.log('its ok');
                   resolve()
               }
           } catch (error) {
               reject(error)
           } 
        })
    },

    couponValidate :  (body,userId,cartTotal)=>{
        return new Promise (async(resolve,reject)=>{
            try {
                
                let response ={
                status: null,
                couponOffer  : null,
                couponAmount : null
               }
               let findCoupon = await db.get().collection(collection.COUPON_COLLECTION).findOne({name: body.couponcode})
               console.log(findCoupon);
                
               if (findCoupon) {
                  let checkIfUsed =await db.get().collection(collection.COUPONUSERS_COLLECTION).findOne({$and:[{userId: userId},{couponCode: body.couponcode}]})
                     if (checkIfUsed) {
                        response.status=false
                        resolve(response)
                        console.log('its here in checkifused');
                          
                     } else {
                        const dateObject = new Date();
                        const date = (`0 ${dateObject.getDate()}`).slice(-2);
                        const month = (`0 ${dateObject.getMonth() + 1}`).slice(-2);
                        const year = dateObject.getFullYear();
                        const dates =`${year}-${month}-${date}`
                        const months =`${year}-${month}`
                        const years = `${year}`
                        console.log('===========');
                        console.log(dates);
                        console.log(findCoupon.date);
                        console.log('===========');
                        findCoupon.discount= parseInt(findCoupon.discount)
                        
                        
                        console.log('its here in !checkifused');
                         if(findCoupon.date > dates){
                            response.status=true
                            console.log('its here in date');                   
                            response.couponAmount = cartTotal*findCoupon.discount/100
                            response.couponOffer=findCoupon.discount
                            let insertedcoupon = await db.get().collection(collection.COUPONUSERS_COLLECTION).insertOne({userId: userId,couponCode: body.couponcode})
                            resolve(response)
                         }else{
                            response.status=false
                            resolve(response)
                         }
                     } 
               } else {
                response.status=false
                 resolve(response)
               }
            } catch (error) {
              reject(error)
            }
        })
    },

    insertcoupontocart :  (userId,couponAmount,couponOffer)=>{
        return new Promise ((resolve,reject)=>{
          
            try {
            
                db.get().collection(collection.CART_COLLECTION).updateOne({user: objId(userId)},{$set: {couponAmount:couponAmount,couponOffer: couponOffer}}).then((response)=>{
                  resolve()
              }).catch((error)=>{
                  reject(error)
              })
            } catch (error) {
              reject(error)
            }
        })
    },

    coupons : ()=>{
        return new Promise ((resolve,reject)=>{
            try {
            
                db.get().collection(collection.COUPON_COLLECTION).find().toArray().then((response)=>{
                    
                        resolve(response)
                        console.log(response);
                
                }).catch((error)=>{
                    reject(error)
                })
            } catch (error) {
              reject(error)
            } 
        })
    },

    usedCoupons : (userId)=>{
        return new Promise ((resolve,reject)=>{
            try {
                
                db.get().collection(collection.COUPONUSERS_COLLECTION).find({userId:userId}).toArray().then((usedCoupons)=>{
                    resolve(usedCoupons)
                    console.log(usedCoupons);
                }).catch((error)=>{
                    reject(error)
                })
            } catch (error) {
              reject(error)
            }
        })
    },

    checkforRefferal : (refferal)=>{
        return new Promise (async(resolve,reject)=>{
            try {
                let refferalCheck = await db.get().collection(collection.USER_COLLECTION).find({_id:objId(refferal)}).toArray()
                 if(refferalCheck){
                     resolve(refferalCheck)     
                 }else{
                     reject('referal id not valid')
                 }
            
            } catch (error) {
              reject(error)
            }
        })
    },

    checkforWallet: (userId)=>{
        return new Promise (async(resolve,reject)=>{
            try {
                db.get().collection(collection.USER_COLLECTION).findOne({_id:objId(userId)}).then((response)=>{
                  if(response.refferalRecieved){
                      response.gift=true 
                      resolve(response)     
                  }else{
                    
                     resolve(response) 
                  }
                }).catch((error)=>{
                 reject(error)
             })
            
            } catch (error) {
              reject(error)
            }
        })
    },

    createWishlist : (productId,userId)=>{
        return new Promise (async(resolve,reject)=>{
            try {
            
                let productDetails = {productId:objId(productId)}
              
              let checkWishlist = await db.get().collection(collection.WISHLIST_COLLECTION).findOne({userId:objId(userId)})
               console.log(checkWishlist);
              if (checkWishlist) {
                console.log('its here ');
                console.log(productId);
                let checkProduct =await db.get().collection(collection.WISHLIST_COLLECTION).findOne( {userId:objId(userId),products: productDetails})
                console.log(checkProduct);
                if (checkProduct) {
                    console.log('product already exist in wishlist');
                    resolve()                
                    
                } else {
                    db.get().collection(collection.WISHLIST_COLLECTION).updateOne({userId:objId(userId)},{$push: {products: productDetails}}).then(async(response)=>{
                        let Inwishlist =await db.get().collection(collection.PRODUCTS_COLLECTION).updateOne({_id: objId(productId)},{$set: {wishlist:true}})
                        resolve(response)
                    }).catch((error)=>{
                        reject(error)
                    })
                }
              } else {
                let wishlist = {
                    userId : objId(userId) ,
                    products : [productDetails]
                  }
                console.log('new should be created')
                db.get().collection(collection.WISHLIST_COLLECTION).insertOne(wishlist).then(async(response)=>{
                   let Inwishlist =await db.get().collection(collection.PRODUCTS_COLLECTION).updateOne({_id: objId(productId)},{$set: {wishlist:true}})
                  resolve(response)
                }).catch((error)=>{
                    reject(error)
                })
              }
            } catch (error) {
              reject(error)
            }
        })
    },

    removeWishlist : (productId,userId)=>{
        return new Promise ((resolve,reject)=>{
            try {
                db.get().collection(collection.WISHLIST_COLLECTION).updateOne({userId:objId(userId)},{$pull: {products: {productId: objId(productId)}}}).then(async(response)=>{
                    let Inwishlist =await db.get().collection(collection.PRODUCTS_COLLECTION).updateOne({_id: objId(productId)},{$unset: {wishlist:true}})
                    resolve(response)             
            }).catch((error)=>{
                reject(error)
            })
            
            } catch (error) {
              reject(error)
            }
          }) 
    },

    bringWishlistProducts : (userId)=>{
        return new Promise (async(resolve,reject)=>{
            try {
            
                let wishlistProducts = await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([
                 {
                     $match : {
                         userId : objId(userId)
                     }
                 },
                 {
                     $unwind: '$products'
                 },
                 {
                     $project: {
                         userId:1,
                         productId: '$products.productId'
                     }
                 },
                 {
                     $lookup : {
                         from: collection.PRODUCTS_COLLECTION,
                         localField : 'productId',
                         foreignField : '_id',
                         as: collection.PRODUCTS_COLLECTION
                     }
                 },
                 {
                     $project : {
                         userId :1,products:{$arrayElemAt:['$products',0]}
                     }
                 },
                 {
                     $addFields : {
                         selectedOffer: {
                             $cond : {
                                 if: {
                                     $gte: [{$toInt: '$products.productOffer'},{$toInt:'$products.categoryOffer'}]
                                 },
                                 then : '$products.productOffer' ,
                                 else: '$products.categoryOffer',
                             }
                         },
                         priceAfterdiscount:{
                             $cond : {
                                 if: {
                                     $gte: [{$toInt: '$products.productOffer'},{$toInt:'$products.categoryOffer'}]
                                 },
                                 then : {$subtract: [{$toInt: '$products.price'},{$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.productOffer'},100]}] }] },
                                 else: {$subtract: [{$toInt: '$products.price'},{$multiply:[{$toInt: '$products.price'},{$divide: [{$toInt: '$products.categoryOffer'},100]}] }] },
                             }
                         },
                     }
                 }    
                ]).toArray()
                 console.log(wishlistProducts);
                 console.log('==============');   
                 resolve(wishlistProducts)
            } catch (error) {
              reject(error)
            }
        })
    },

    getBanner : ()=>{
        return new Promise ((resolve,reject)=>{
            try {
            
                db.get().collection(collection.BANNER_COLLECTION).find().toArray().then((response)=>{                   
                    resolve(response)  
                    console.log(response);
                    console.log('==============');           
            }).catch((error)=>{
                reject(error)
            })
            } catch (error) {
              reject(error)
            }
          }) 
    },

    getHotDealsProducts : ()=>{
        return new Promise (async(resolve,reject)=>{
            try {
            
                let hotDeals = await db.get().collection(collection.PRODUCTS_COLLECTION).aggregate([
                    {
                        $addFields : {
                            selectedOffer: {
                                $cond : {
                                    if: {
                                        $gte: [{$toInt: '$productOffer'},{$toInt:'$categoryOffer'}]
                                    },
                                    then : '$productOffer',
                                    else: '$categoryOffer',
                                }
                            },
                            priceAfterdiscount:{
                                
                                $cond : {
                                    if: {
                                        $gte: [{$toInt: '$productOffer'},{$toInt:'$categoryOffer'}]
                                    },
                                    then : {$subtract: [{$toInt: '$price'},{$round:[{$multiply:[{$toInt: '$price'},{$divide: [{$toInt: '$productOffer'},100]}]},0]}]},
                                    else: {$subtract: [{$toInt: '$price'},{$round:[{$multiply:[{$toInt: '$price'},{$divide: [{$toInt: '$categoryOffer'},100]}]},0]}]},
                                }
                            },
                        }
                    },
                    {
                        $unwind: 
                            '$selectedOffer'           
                    },
                    {
                        $sort:{
                           'selectedOffer':-1
                        }
                    },
                    {
                        $limit:6
                    },
                ]).toArray()    
                    resolve(hotDeals)  
                    console.log(hotDeals);
                    console.log('=======hot Deals=======');           
            } catch (error) {
              reject(error)
            }
          }) 
    },

    getHighDemandProducts :  ()=>{
        return new Promise (async(resolve,reject)=>{
            try {
            
                let highDemand = await db.get().collection(collection.PRODUCTS_COLLECTION).aggregate([
                    {
                        $addFields : {
                            selectedOffer: {
                                $cond : {
                                    if: {
                                        $gte: [{$toInt: '$productOffer'},{$toInt:'$categoryOffer'}]
                                    },
                                    then : '$productOffer',
                                    else: '$categoryOffer',
                                }
                            },
                            priceAfterdiscount:{                   
                                $cond : {
                                    if: {
                                        $gte: [{$toInt: '$productOffer'},{$toInt:'$categoryOffer'}]
                                    },
                                    then : {$subtract: [{$toInt: '$price'},{$round:[{$multiply:[{$toInt: '$price'},{$divide: [{$toInt: '$productOffer'},100]}]},0]}]},
                                    else: {$subtract: [{$toInt: '$price'},{$round:[{$multiply:[{$toInt: '$price'},{$divide: [{$toInt: '$categoryOffer'},100]}]},0]}]},
                                }
                            },
                        }
                    }
                ]).toArray()    
                    resolve(highDemand)  
                    console.log(highDemand);
                    console.log('=======high demand=======');           
            } catch (error) {
              reject(error)
            }
          }) 
    },

    filter : (body)=>{
        return new Promise ((resolve,reject)=>{
            try {
                let type = Array.isArray(body.brand)
                  console.log(type);
                  if (type==true) {
                      db.get().collection(collection.PRODUCTS_COLLECTION).find({brand:{$in:body.brand}}).toArray().then((response)=>{                   
                          resolve(response) 
                          console.log(response);
                          console.log('==============');       
                     }).catch((error)=>{
                        reject(error)
                    }) 
                  } else {
                    db.get().collection(collection.PRODUCTS_COLLECTION).find({brand:body.brand}).toArray().then((response)=>{                   
                        resolve(response) 
                        console.log(response);
                        console.log('==============');
                   }).catch((error)=>{
                    reject(error)
                })
             }
            } catch (error) {
              reject(error)
            }   
          })
    },

    productSearch : (searchData)=>{
        return new Promise ((resolve,reject)=>{
            try {
                db.get().collection(collection.PRODUCTS_COLLECTION).find({name : {$regex: new RegExp(searchData+'.*','i')}}).limit(5).toArray().then((response)=>{                   
                        resolve(response)  
                        console.log(response);
                        console.log('==============');           
                }).catch((error)=>{
                    reject(error)
                })
            
            } catch (error) {
              reject(error)
            } 
          })
    },

    brandwiseproduct : (body)=>{
        console.log(body);
        console.log('body');
        return new Promise ((resolve,reject)=>{
            try {
                db.get().collection(collection.PRODUCTS_COLLECTION).find({brand: body}).toArray().then((response)=>{                   
                        resolve(response)  
                        console.log(response);
                        console.log('==============');           
                }).catch((error)=>{
                    reject(error)
                })
            
            } catch (error) {
              reject(error)
            } 
          })
    },
}  

const { ObjectID } = require('bson');
const db = require('../config/connection');
var objId =require('mongodb').ObjectId
let collection = require('../config/collection')


module.exports={
    doAdminLogin : (admindata)=>{
        return new Promise ((resolve,reject)=>{
            console.log(admindata);
            let response={}
            db.get().collection(collection.ADMIN_COLLECTION).findOne({$and:[{adminid:admindata.username,password:admindata.password}]}).then((data)=>{
                if(data){
                    
                   response.status=true
                   resolve(response)
                }else{
                   response.status=false
                   resolve(response)
                }
            }).catch((error)=>{
                reject(error)
            })
        })
    },

    userinfo : (data)=>{
        return new Promise(async(resolve,reject)=>{
           try {
               let info =await db.get().collection(collection.USER_COLLECTION).find().toArray()
                  
                   resolve(info)
           } catch (error) {
              reject(error)
           } 
        })
    },

    userblock : (userdata)=>{
        return new Promise(async(resolve,reject)=>{
           try {
               let info =await db.get().collection(collection.USER_COLLECTION).updateOne({_id:objId(userdata)},{$unset:{status:'true'}})
               resolve (info)
           } catch (error) {
              reject(error)
           }
        })
    },

    userunblock : (userdata)=>{
        return new Promise(async(resolve,reject)=>{
           try {
               let info =await db.get().collection(collection.USER_COLLECTION).updateOne({_id:objId(userdata)},{$set:{status:'true'}})
               resolve (info)
           } catch (error) {
               reject(error)
           }
        })
    },

    productinfo : ()=>{
        return new Promise(async(resolve,reject)=>{
          try {
              let info =await db.get().collection(collection.PRODUCTS_COLLECTION).find().toArray()
                  resolve(info)
          } catch (error) {
              reject(error)
          }  
        })},

    addproduct : (productdata)=>{
         return new Promise(async(resolve,reject)=>{
          try {
            // productdata.productTotal= productdata.price-(productdata.price*productdata.productOffer/100)
            // console.log(productdata.productTotal);
            // if(productdata.productOffer=='' || productdata.productOffer==0){
            //     productdata.productOffer='nil'
            // }
            productdata.offerApplied=false
              let data =await db.get().collection(collection.PRODUCTS_COLLECTION).insertOne(productdata)
              resolve(data)
          } catch (error) {
              reject(error)
          }
         })
    },

    editproduct : (productdata)=>{
        return new Promise (async(resolve,reject)=>{
          try {
              let response={}
              let data = await db.get().collection(collection.PRODUCTS_COLLECTION).findOne({_id:objId(productdata)})
              let findResult = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()           
              response.data=data
              response.findResult=findResult
              resolve(response)
          } catch (error) {
              reject(error)
          }
        })
    },

    submitEditproduct : (id,productdata)=>{
       return new Promise (async(resolve,reject)=>{
        try {
            if(productdata.img.length==0){
                let updateddata = await db.get().collection(collection.PRODUCTS_COLLECTION).findOne({_id:objId(id)})
                console.log(updateddata);
                console.log('what i want');
                productdata.img= updateddata.img
            }
            
            
            let updatedData = await db.get().collection(collection.PRODUCTS_COLLECTION).updateOne({_id:objId(id)},{$set:
                {name:productdata.name,
                 brand:productdata.brand,
                 price:productdata.price,
                 stock:productdata.stock,
                 productDescription1: productdata.productDescription1,
                 productDescription2: productdata.productDescription2,
                 productDescription3: productdata.productDescription3,
                 productDescription4: productdata.productDescription4,
                 
                 img: productdata.img
            }})
             resolve(updatedData)   
        } catch (error) {
            reject(error)
        }
       })
    },

    deleteProduct : (productId)=>{
        return new Promise ((resolve,reject)=>{
          try {
              let productFind = db.get().collection(collection.PRODUCTS_COLLECTION).deleteOne({_id:objId(productId)})
              resolve(productFind)
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

    addCategory : (categoryData)=>{
        return new Promise (async(resolve,reject)=>{
          try {
              let response ={}
              
          let findCategory = await db.get().collection(collection.CATEGORY_COLLECTION).findOne({ brand: { $regex: categoryData.brand, $options: 'i' } })
          console.log(findCategory);
          if(findCategory){
              response.status=false
              response.findCategory=findCategory 
              resolve(response)
          }else{
              response.status=true
              categoryData.offerApplied=false
            let createCategory = await db.get().collection(collection.CATEGORY_COLLECTION).insertOne(categoryData)
            response.createCategory = createCategory
            resolve(response)
          } 
          } catch (error) {
             reject(error) 
          }
       })
    },

    findCategoryForEdit : (categoryId)=>{
        return new Promise (async(resolve,reject)=>{
        try {
            let findResult = await db.get().collection(collection.CATEGORY_COLLECTION).findOne()
           resolve(findResult)
        } catch (error) {
            reject(error)
        }
        })
    },

    findCategoryAndUpdate : (categoryId,categoryBody)=>{
        return new Promise (async(resolve,reject)=>{
            try {
                let findResult = await db.get().collection(collection.CATEGORY_COLLECTION).findOneAndUpdate({_id:objId(categoryId)},{$set:{brand:categoryBody.brand}})
               resolve(findResult)
            } catch (error) {
                reject(error)
            }
        })
    },

    deleteCategory : (categoryId)=>{
        return new Promise ((resolve,reject)=>{
          try {
              let categoryFind = db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:objId(categoryId)})
              resolve(categoryFind)
            
          } catch (error) {
             reject(error)
          }
        })
    },

    fullOrder : (userId)=>{
        try {
            
            return new Promise(async(resolve,reject)=>{
               
            let findOrder =await  db.get().collection(collection.ORDER_COLLECTION).aggregate([
                
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
            console.log(findOrder);
            console.log('findOrder');
        })
        
            
        } catch (error) {
            console.log(error);
        }
    },

    findOrder : (orderId)=>{
        return new Promise ((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).findOne({_id: objId(orderId)}).then((response)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            })
        })
    },

    productsfromOrder : (orderId)=>{
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

    cancelOrders: (body)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let findOrder=await db.get().collection(collection.ORDER_COLLECTION).findOne({$and:[{_id:objId(body.orderId)},{'products.item':objId(body.productId)}]})
                 body.quantity=parseInt(body.quantity)
                 if(findOrder){
                      // let pullProduct = {
                      //     item:objId(body.productId),
                      //     quantity:body.quantity,
                      //     productStatus: 'cancelled'
                      // }
                      // console.log(pullProduct);
                      db.get().collection(collection.ORDER_COLLECTION).updateOne({$and:[{_id:objId(body.orderId)},{'products.item':objId(body.productId)}]},{$set:{'products.$.productStatus':'cancelled'}}).then((response)=>{
                      
                      resolve(response)
                      }).catch((err)=>{
                        reject(err)
                      })
                    
                   }else{
                     resolve()
                   }
            }catch(err){
                reject(err)
            }
        })
    },

    bringGraph : ()=>{
        return new Promise(async(resolve,reject)=>{
            try {
            
                let weeklySales= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    {
                        $unwind:"$products"
                    },
                    {
                        $match: {
                            'products.productStatus':{
                                $nin:['cancelled']
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$date',
                            total: {$sum:'$total'}
                        }
                    },
                    {
                        $sort:{
                           '_id':-1
                        }
                    },
                    {
                        $limit:7
                    },
                    {
                        $sort:{
                           '_id':1
                        }
                    }
                ]).toArray()
                let monthlySales= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    {
                        $unwind:"$products"
                    },
                    {
                        $match: {
                            'products.productStatus':{
                                $nin:['cancelled']
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$month',
                            total: {$sum:'$total'}
                        }
                    },
                    {
                        $sort:{
                           '_id':-1
                        }
                    },
                    {
                        $limit:7
                    },
                    {
                        $sort:{
                           '_id':1
                        }
                    }
                ]).toArray()
                let yearlySales= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    {
                        $unwind:"$products"
                    },
                    {
                        $match: {
                            'products.productStatus':{
                                $nin:['cancelled']
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$year',
                            total: {$sum:'$total'}
                        }
                    },
                    {
                        $sort:{
                           '_id':-1
                        }
                    },
                    {
                        $limit:7
                    },
                    {
                        $sort:{
                           '_id':1
                        }
                    }
                ]).toArray()
                console.log('---------------------------');
                console.log(weeklySales,monthlySales,yearlySales);
                console.log('---------------------------');
                resolve({weeklySales,monthlySales,yearlySales})
            } catch (error) {
               reject(error)
            }
        })
    },

    paymentGraph:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
               
                {$match:{status:'Order Placed'}},
                {$group:{_id:'$paymentMethod',count:{$sum:1}}},
                // {$group:{_id:"$_id.Payment",Count:{$sum:1}}}
            ]).toArray().then((payment)=>{
                console.log(payment);
                console.log('////////////////');
                resolve(payment)
            }).catch((err)=>{
            reject(err)
        })
        })
    },

    changeStatus : (body)=>{

        return new Promise (async(resolve,reject)=>{
            try {
                let changeStatus =await db.get().collection(collection.ORDER_COLLECTION).updateOne({$and:[{_id:objId(body.orderId)},{'products.item': objId(body.productId)}]},{$set:{'products.$.productStatus':body.productStatus}})
               console.log(changeStatus);
               resolve(changeStatus)
            
            } catch (error) {
               reject(error)
            }
        })
    },

    salesreport: ()=>{
        return new Promise(async(resolve,reject)=>{
            try {
            
                let weeklySales= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                       {
                           $unwind:"$products"
                       },
                       {
                           $match: {
                               'products.productStatus':{
                                   $nin:['cancelled']
                               }
                           }
                       },
                       {
                           $group: {
                               _id: '$date',count:{$sum:1},
                               total: {$sum:'$total'},
                           }
                       },
                       
                       {
                           $sort:{
                              '_id':-1
                           }
                       },
                       {
                           $limit:7
                       },
                       {
                           $sort:{
                              '_id':1
                           }
                       },
                       
                   ]).toArray() 
                console.log(weeklySales);
                let monthlySales= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    {
                        $unwind:"$products"
                    },
                    {
                        $match: {
                            'products.productStatus':{
                                $nin:['cancelled']
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$month',count:{$sum:1},
                            total: {$sum:'$total'}
                        }
                    },
                    {
                        $sort:{
                           '_id':-1
                        }
                    },
                    {
                        $limit:7
                    },
                    {
                        $sort:{
                           '_id':1
                        }
                    }
                ]).toArray()
                console.log(monthlySales);
                let yearlySales= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    {
                        $unwind:"$products"
                    },
                    {
                        $match: {
                            'products.productStatus':{
                                $nin:['cancelled']
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$year',count:{$sum:1},
                            total: {$sum:'$total'}
                        }
                    },
                    {
                        $sort:{
                           '_id':-1
                        }
                    },
                    {
                        $limit:7
                    },
                    {
                        $sort:{
                           '_id':1
                        }
                    }
                ]).toArray()
                console.log(yearlySales);
    
                let weeklyTotal= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    {
                        $unwind:"$products"
                    },
                    {
                        $match: {
                            'products.productStatus':{
                                $nin:['cancelled']
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$date',count:{$sum:1},
                            totals: {$sum:'$total'},
                        }
                    },
                    
                    {
                        $sort:{
                           '_id':-1
                        }
                    },
                    {
                        $limit:7
                    },
                    {
                        $sort:{
                           '_id':1
                        }
                    },
                    {
                        $group:{
                           _id:null,
                           grandtotal: {$sum:'$totals'}
                        }
                        
                    }
                    
                ]).toArray() 
             console.log(weeklyTotal);
             let monthlyTotal= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                 {
                     $unwind:"$products"
                 },
                 {
                     $match: {
                         'products.productStatus':{
                             $nin:['cancelled']
                         }
                     }
                 },
                 {
                     $group: {
                         _id: '$month',count:{$sum:1},
                         totals: {$sum:'$total'}
                     }
                 },
                 {
                     $sort:{
                        '_id':-1
                     }
                 },
                 {
                     $limit:7
                 },
                 {
                     $sort:{
                        '_id':1
                     }
                 },
                 {
                    $group:{
                       _id:null,
                       grandtotal: {$sum:'$totals'}
                    }
                    
                }
             ]).toArray()
             console.log(monthlyTotal);
             let yearlyTotal= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                 {
                     $unwind:"$products"
                 },
                 {
                     $match: {
                         'products.productStatus':{
                             $nin:['cancelled']
                         }
                     }
                 },
                 {
                     $group: {
                         _id: '$year',count:{$sum:1},
                         totals: {$sum:'$total'}
                     }
                 },
                 {
                     $sort:{
                        '_id':-1
                     }
                 },
                 {
                     $limit:7
                 },
                 {
                     $sort:{
                        '_id':1
                     }
                 },
                 {
                    $group:{
                       _id:null,
                       grandtotal: {$sum:'$totals'}
                    }
                    
                }
             ]).toArray()
             console.log(yearlyTotal);
                resolve({weeklySales,monthlySales,yearlySales,weeklyTotal,monthlyTotal,yearlyTotal})
            } catch (error) {
               reject(error)
            }
    })
  },

  getOfferlessProduct : ()=>{
    return new Promise ((resolve,reject)=>{
        db.get().collection(collection.PRODUCTS_COLLECTION).find({offerApplied:false}).toArray().then((data)=>{
            console.log(data);
            resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    })
  },

  getOfferProduct: ()=>{
    return new Promise(async(resolve,reject)=>{
        // productdata.productTotal= productdata.price-(productdata.price*productdata.productOffer/100)
        let productData =await db.get().collection(collection.PRODUCTS_COLLECTION).find({offerApplied:true}).toArray()
          productData.forEach(element => {
            element.priceAfterOffer=element.price-(element.price*element.productOffer/100)
          });
        //   let priceAfterOffer = db.get().collection(collection.PRODUCTS_COLLECTION).updateMany({offerApplied:true},{$set:{priceAfterOffer:'$productData.priceAfterOffer'}})
        console.log(productData);
        resolve(productData)
    })
  },

  getOfferlessCategory: ()=>{
    return new Promise ((resolve,reject)=>{
        db.get().collection(collection.CATEGORY_COLLECTION).find({offerApplied:false}).toArray().then((data)=>{
            console.log(data);
            resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    })
  },

  getOfferCategory: ()=>{
    return new Promise(async(resolve,reject)=>{
       
        let categoryData =await db.get().collection(collection.CATEGORY_COLLECTION).find({offerApplied:true}).toArray() 
        console.log(categoryData);
        resolve(categoryData)
    })
  }, 

  applyProductsOffer:(body)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCTS_COLLECTION).updateOne({_id: objId(body.productId)},{$set:{offerApplied:true,productOffer:body.productOffer}}).then((data)=>{
            console.log(data);
            resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    })
  },

  applyCategoryOffer : (body)=>{
    
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id: objId(body.categoryId)},{$set:{offerApplied:true,categoryOffer:body.categoryOffer}}).then((data)=>{
     
            db.get().collection(collection.PRODUCTS_COLLECTION).updateMany({brand:body.brand},{$set:{categoryOffer:body.categoryOffer}}).then((response)=>{
                resolve(data)
            })
        }).catch((err)=>{
            reject(err)
        })
    })
  },


  editProductsOffer: (body)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCTS_COLLECTION).updateOne({_id: objId(body.productId)},{$set:{productOffer:body.productOffer}}).then((data)=>{
            console.log(data);
            resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    })
  },

  editCategoryOffer : (body)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id: objId(body.categoryId)},{$set:{categoryOffer:body.categoryOffer}}).then((data)=>{
            db.get().collection(collection.PRODUCTS_COLLECTION).updateMany({brand:body.brand},{$set:{categoryOffer:body.categoryOffer}}).then((response)=>{
                resolve(data)
            })

        }).catch((err)=>{
            reject(err)
        })
    })
  },

  deleteProductsOffer: (productId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCTS_COLLECTION).updateOne({_id: objId(productId)},{$unset:{productOffer:1},$set:{offerApplied:false}}).then((data)=>{
            console.log(data);
            resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    })
  },

  deleteCategoryOffer : (categoryId,brand)=>{
    return new Promise(async(resolve,reject)=>{
        let deleteData =await  db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id: objId(categoryId)},{$unset:{categoryOffer:1},$set:{offerApplied:false}})
        db.get().collection(collection.PRODUCTS_COLLECTION).updateMany({brand:brand},{$unset:{categoryOffer:1}})
            console.log(deleteData);
            console.log('this is what i want');
            resolve()
    })
  },

  addCoupon : (body)=>{
    
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).insertOne(body).then((data)=>{
          resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    })
  },

  editCoupon: (body)=>{
    
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).updateOne({_id: objId(body.couponId)},{$set:
            {
                name:body.name,
                discount:body.discount,
                description:body.description,
                date:body.date
            }}).then((data)=>{
          resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    })
  },

  deleteCoupon : (couponId)=>{
    
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).deleteOne({_id: objId(couponId)}).then((data)=>{
          resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    })
  },

  getCoupons: ()=>{
    
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).find().toArray().then((data)=>{
          resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    })
  },

  addBanner : (bannerData)=>{
    return new Promise (async(resolve,reject)=>{
      try {
          let response ={}
          
      let findBanner = await db.get().collection(collection.BANNER_COLLECTION).findOne({ name: { $regex: bannerData.name, $options: 'i' } })
      console.log(findBanner);
      if(findBanner){
          response.status=false
          response.findBanner=findBanner 
          resolve(response)
      }else{
          response.status=true
          
        let createBanner = await db.get().collection(collection.BANNER_COLLECTION).insertOne(bannerData)
        response.createBanner = createBanner
        resolve(response)
      } 
      } catch (error) {
         reject(error) 
      }
   })
},

getBanner: ()=>{
    
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.BANNER_COLLECTION).find().toArray().then((data)=>{
          resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    })
  },

  editBanner : (bannerId)=>{
    return new Promise (async(resolve,reject)=>{
    try {
        let findResult = await db.get().collection(collection.BANNER_COLLECTION).findOne({_id: objId(bannerId)})
       resolve(findResult)
    } catch (error) {
        reject(error)
    }
    })
},

adminEditBanner : (bannerData)=>{
    return new Promise (async(resolve,reject)=>{
          
        let updateBanner = await db.get().collection(collection.BANNER_COLLECTION).updateOne({_id: objId(bannerData._id)},{$set: {name: bannerData.name,img: bannerData.img}})
        
        resolve(updateBanner)
      } 
      
   )
},

deleteBanner : (bannerId)=>{
    
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.BANNER_COLLECTION).deleteOne({_id: objId(bannerId)}).then((data)=>{
          resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    })
  },
}
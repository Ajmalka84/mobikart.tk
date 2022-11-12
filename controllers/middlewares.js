let userhelpers =require('../helpers/user-helpers')

module.exports={
    adminSessionManagement : (req,res,next)=>{
        if(req.session.adminloggedin){
            return next()
        }else{
            res.render('admin/admin-login')
        }
    },

    userSessionManagement : (req,res,next)=>{
        if(req.session.loggedIn){
            return next()
        }else{
            userhelpers.findCategory().then((response)=>{
              res.render('./user/user-home',{title:true,userheader:true,response});
            })
        }
    },

    wishlistCount :async (req,res,next)=>{
        if(req.session.loggedIn){
         let wishlist = await   userhelpers.wishlistCount(req.session.user._id)
                return next(wishlist)
        
        }else{
            res.render('user/user-login')
        }
    },

    pagination : ()=>{
        
    }
}
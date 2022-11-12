// Add Address

let firstnameMessage = document.getElementById('firstnameMessage')
let lastnameMessage = document.getElementById('lastnameMessage')
let addressMessage = document.getElementById('addressMessage')
let cityMessage = document.getElementById('cityMessage')
let pinMessage = document.getElementById('pinMessage')
let addressformMessage = document.getElementById('addressformMessage')

function validatefirstname(){
 let firstname = document.getElementById('firstname').value
 if(firstname.length == 0){
    firstnameMessage.innerHTML='Enter firstname'
    return false
 }
 if(!firstname.match(/^[A-Za-z]{3,30}\s*$/)){
    firstnameMessage.innerHTML='Min 3 char required'
    return false
 }   
 firstnameMessage.innerHTML=''
 return true
}

function validatelastname(){
 let lastname = document.getElementById('lastname').value
 if(lastname.length == 0){
    lastnameMessage.innerHTML='Enter lastname'
    return false
 }
 if(!lastname.match(/^[A-Za-z]{3,30}\s*$/)){
    lastnameMessage.innerHTML='Min 3 char required'
    return false
 }   
 lastnameMessage.innerHTML=''
 return true
}

function validateaddress(){

    var address = document.getElementById('address').value;
    
    if(address.length < 4){
        addressMessage.innerHTML='min 4 charecters required';
        return false;
    }
    addressMessage.innerHTML=' ';
    return true;
  }

function validatecity(){
 let city = document.getElementById('city').value
 if(city.length == 0){
    cityMessage.innerHTML='Enter city'
    return false
 }
 if(!city.match(/^[A-Za-z]{3,30}\s*$/)){
    cityMessage.innerHTML='Min 3 char required'
    return false
 }   
 cityMessage.innerHTML=''
 return true
}

function validatepin(){
   var pin =document.getElementById('pin').value
   
   if(!pin.match(/^\d{6}$/)){
       pinMessage.innerHTML='Enter correct pin';
       return false;
   }else{
   pinMessage.innerHTML='';
   return true;
  }
}

// function validateaddressform(){
//     if(!validatefirstname() || !validatelastname() || !validateaddress() || !validatecity() || !validatepin()){
//       addressformMessage.style.display='block';
//         addressformMessage.innerHTML='Please fix Error';
//         setTimeout(function(){addressformMessage.style.display='none';},3000);
//         return false;
//     }else{
//        addressformMessage.innerHTML='';
//        return true;  
//     }
// }

// End Add Address  

// Edit Address 

let editfirstnameMessage = document.getElementById('editfirstnameMessage')
let editlastnameMessage = document.getElementById('editlastnameMessage')
let editaddressMessage = document.getElementById('editaddressMessage')
let editcityMessage = document.getElementById('editcityMessage')
let editpinMessage = document.getElementById('editpinMessage')
let editaddressformMessage = document.getElementById('editaddressformMessage')

function editvalidatefirstname(){
   let editfirstname = document.getElementById('editfirstname').value
   if(editfirstname.length == 0){
      editfirstnameMessage.innerHTML='Enter firstname'
      return false
   }
   if(!editfirstname.match(/^[A-Za-z]{3,30}\s*$/)){
      editfirstnameMessage.innerHTML='Min 3 char required'
      return false
   }   
   editfirstnameMessage.innerHTML=''
   return true
  }
  
  function editvalidatelastname(){
   let editlastname = document.getElementById('editlastname').value
   if(editlastname.length == 0){
      editlastnameMessage.innerHTML='Enter lastname'
      return false
   }
   if(!editlastname.match(/^[A-Za-z]{3,30}\s*$/)){
      editlastnameMessage.innerHTML='Min 3 char required'
      return false
   }   
   editlastnameMessage.innerHTML=''
   return true
  }
  
  function editvalidateaddress(){
  
      var editaddress = document.getElementById('editaddress').value;
      
      if(editaddress.length < 4){
         editaddressMessage.innerHTML='min 4 charecters required';
          return false;
      }
      editaddressMessage.innerHTML=' ';
      return true;
    }
  
  function editvalidatecity(){
   let editcity = document.getElementById('editcity').value
   if(editcity.length == 0){
      editcityMessage.innerHTML='Enter city'
      return false
   }
   if(!editcity.match(/^[A-Za-z]{3,30}\s*$/)){
      editcityMessage.innerHTML='Min 3 char required'
      return false
   }   
   editcityMessage.innerHTML=''
   return true
  }
  
  function editvalidatepin(){
     var editpin =document.getElementById('editpin').value
     
     if(!editpin.match(/^\d{6}$/)){
      editpinMessage.innerHTML='Enter correct pin';
         return false;
     }else{
      editpinMessage.innerHTML='';
     return true;
    }
  }

//   End Edit Address 
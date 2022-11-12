

$("#checkout-form").submit((e)=>{
    e.preventDefault()
    $.ajax({
        
        url: '/checkout-placeOrder',
        method:'post',
        data: $("#checkout-form").serialize(),
        success: (response)=>{
            if(response.status){
                window.location.reload()
                
            }else{
                if(response.codSuccess){
                 alert('success')
                 location.href='/orderSummary'		
               }else if(response.razor){
                 razorpayPayment(response.order)
               }else{
                 location.href = response
             //    paypalPayment(response)
               }

            }
        }
    })
})

function razorpayPayment(order){
    
    var options = {
        "key": "rzp_test_lRVn8mJEEw8PB2", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Mobikart",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            verifyPayment(response,order) 
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
         }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
}

function verifyPayment(payment,order){
    $.ajax({
        url: '/verify-payment',
        data: {
            payment,
            order,
        },
        method:'post',
        success: (response)=>{
            if(response.status){
                location.href='/orderSummary'
            }else{
                alert('payment failed')
            }
        }
    })
  
}
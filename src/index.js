 function wxPay(data) {
     function onBridgeReady() {
         // eslint-disable-next-line 
         WeixinJSBridge.invoke(
             'getBrandWCPayRequest', {
                 appId: data.appId,
                 timeStamp: data.timestamp,
                 nonceStr: data.nonce,
                 package: data.packageName,
                 signType: data.signType,
                 paySign: data.sign
             },
             function(res) {
                 console.log('Apple MacBook : wxPay -> res', res)
                 if (res.err_msg === "get_brand_wcpay_request:ok") {
                     Toast.info('支付成功', 1)
                 } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
                     Toast.info('用户取消支付', 1)
                 } else if (res.err_msg === "get_brand_wcpay_request:fail") {
                     Toast.info('支付失败', 1)
                 }
             }
         )
     }

     if (typeof WeixinJSBridge === "undefined") {
         if (document.addEventListener) {
             //eslint-disable-next-line 
             document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
         } else if (document.attachEvent) {
             // eslint-disable-next-line 
             document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                 // eslint-disable-next-line 
             document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
         }
     } else {
         onBridgeReady()
     }
 }

const pricing = {
  onetime: { 
    id: 'onetime',
    label: 'OneTime',
    options: [
      { id: 'onetime_219', amount: 219, text: 'Taharah' },
      { id: 'onetime_360', amount: 360, text: '' },
      { id: 'onetime_3600', amount: 3600, text: 'תחינות ותפילות / Prayer Wall' },
      { id: 'onetime_4000', amount: 4000, text: 'Washing Stations' },
      { id: 'onetime_12000', amount: 12000, text: 'Electricity & Lighting' },
      { id: 'onetime_15000', amount: 15000, text: 'Interior Decor + Furniture' },
      { id: 'onetime_18000_a', amount: 18000, text: 'אוצר זריעה ,השקה / Zriah , Hashaka Pool' },
      { id: 'onetime_18000_b', amount: 18000, text: 'חדר כניסה / Reception Area' },
      { id: 'onetime_20000', amount: 20000, text: 'חדרי הכנה / Preparation Rooms' },
      { id: 'onetime_25000', amount: 25000, text: 'מאגר מי גשמים  / Rainwater Reservoir' },
      { id: 'onetime_36000', amount: 36000, text: 'חדר כלה / Kallah Room' },
      { id: 'onetime_50000', amount: 50000, text: 'בית טבילה / Bais Hatvillah' },
      { id: 'onetime_75000', amount: 75000, text: 'שער כניסה למקווה / Main Entrance' },
      { id: 'onetime_200000', amount: 200000, text: 'זכות הנצחת המקוה / Mikvah Dedication' },
    ]
  },
  monthly: {
    id: 'monthly',
    label: 'Monthly',
    options: [
      { id: 'monthly_360', amount: 360, text: '' },
      { id: 'monthly_219', amount: 219, text: 'Give "Taharah" every month' },
      { id: 'monthly_18_25', amount: 18.25, text: 'Give "Taharah" (18.25 x 12) for $219 every year' },
    ]
  }
};

const pricingTabs = new PricingTabs("paymentwrapper",pricing,(amountSelected)=>{
    $(".amt-desc").html('');
    $("input[name=selectedamt]").val(amountSelected.amount)
    $("input[name=selectedcurrency]").val(pricingTabs.active_currency.code)
    $("input[name=selectedduration]").val(pricingTabs.duration)
    if(pricingTabs.isNotReuccring()){
        $(".total-amt-selected").html(pricingTabs.active_currency.symbol+pricingTabs.formatNum(amountSelected.amount))
        $("input[name=selectedduration]").val("1")
    }else{
        if(pricingTabs.duration == "0"){
            $(".total-amt-selected").html(pricingTabs.active_currency.symbol+pricingTabs.formatNum(amountSelected.amount)+"/month")
        }else{
            $(".total-amt-selected").html(pricingTabs.active_currency.symbol+pricingTabs.formatNum(pricingTabs.getGrandTotal()))
            $(".amt-desc").html(pricingTabs.active_currency.symbol+(pricingTabs.formatNum(amountSelected.amount)+`/month for ${pricingTabs.duration} months`))
        }
    }
});

$(document).ready(function () {
    $('#wf-form-Donation-Form').ajaxer();
    $(".dependent-chk").dependentCheckbox();
    $(".pgateway-tabs").GatewayTabs({
        activeIndex:0,
        onSelected:function(value){
            $(".selected_payment_type").val(value)
        }
    });
});
  

class PricingTabs {
  constructor(containerId, data,onAmtSelected=null) {
      this.container = document.getElementById(containerId);
      this.onAmtSelected = onAmtSelected;
      this.selectedAmt = null
      this.data = data;
      this.isOpen = false
      this.total_amount = 0;
      this.end_after = 0;
      this.activeTab = this.data[Object.keys(data)[0]]; // 'suggested' or 'monthly'
      this.currencies = [
        { code: "USD", name: "USD", flag: "https://flagcdn.com/us.svg", symbol: "$" },
        { code: "UK", name: "UK", flag: "https://flagcdn.com/gb.svg", symbol: "£" },
        { code: "IL", name: "IL", flag: "https://flagcdn.com/il.svg", symbol: "₪" }
      ];
      this.active_currency = this.currencies[0]
      this.duration = 1;
      
      this.render();
  }
  getGrandTotal(){
    return parseFloat(this.selectedAmt.amount)*parseInt(this.duration)
  }
  render() {
      // Clear container to render fresh content
      this.container.innerHTML = '';
      this.renderTabButtons();
      this.renderPricingOptions(this.activeTab);
      
  }

  renderTabButtons() {
      let tabsHtml = `<div class="relative flex w-full p-1.5 mt-5 bg-[#FAFAFA] border border-[#E9EAEB] rounded-[12px]">`;
      tabsHtml += `<span id="glider"
                  class="absolute top-1.5 left-1.5 w-[calc(50%-6px)] h-[calc(100%-12px)] bg-[#a35d5d] rounded-[10px] transition-all duration-300">
              </span>`;

      const tabs = Object.keys(this.data);
      tabs.forEach((tabidx) => {
          let tab = this.data[tabidx];
          tabsHtml += `<input type="radio" name="donation_option" id="tab_${tab.id}" value="${tab.id}" class="sr-only peer/${tab.id}" onchange="pricingTabs.ontabSwitch('${tab.id}')" ${(tab.id==this.activeTab.id?'checked="checked"':'')}/>`;
          tabsHtml += `<label for="tab_${tab.id}" class="tab-btn flex-1 text-center z-10 cursor-pointer text-sm py-3 font-semibold text-[#929292] transition-colors duration-200 peer-checked/${tab.id}:text-white">${tab.label}</label>`;
      });
      tabsHtml += `</div>`;

      const tabWrapper = document.createElement('div');
      tabWrapper.className = 'tab-buttons';
      tabWrapper.innerHTML = tabsHtml;
      this.container.appendChild(tabWrapper);
  }
  isNotReuccring(){
    return this.activeTab.id=='onetime';
  }
  ontabSwitch(activeTabId) {
    this.activeTab = this.data[activeTabId]; 
    if(this.isNotReuccring()){
        this.duration =1;
    }else{
        if(this.duration==1){
            this.duration = 16
        }
    }
    
    this.updateGliderPosition(); // Update the glider position
    this.renderPricingOptions(this.activeTab);

  }
  onChangeAmount(amountId,value=0) {
    let amountSelected = this.activeTab.options.find(item=>item.id==amountId)
    if(amountId=="custom"){
        amountSelected = {
            id:"custom",
            amount:value
        }
    }
    this.total_amount = amountSelected.amount;
    this.selectedAmt = amountSelected
    if(this.onAmtSelected!=null){
        this.onAmtSelected(amountSelected)
    }
    this.renderPricingOptions(this.activeTab);
  }
  onDuratioChange(duration){
    this.duration = duration;
    this.duration  = (this.total_amount *this.duration );
    this.renderPricingOptions(this.activeTab);
  }
  onEndAfter(isChecked){
    if(isChecked.checked){
        this.end_after = 1;
        if(this.duration == 0){
            this.duration = 16; 
        }
        
    } else {
        this.end_after = 0; 
        this.duration = 0;
    }
    
    this.renderPricingOptions(this.activeTab);
    if(this.onAmtSelected!=null){
        this.onAmtSelected(this.selectedAmt)
    }
  }
 
  updownVal(isNumber){
    if($(isNumber).attr('data-action')=='increase'){
        this.duration = (this.duration+1);
    } else {
        this.duration= (this.duration>0)?(this.duration-1):0;
    }
    this.renderPricingOptions(this.activeTab);
  }

    onChangeCurrency(code) {
        this.active_currency = this.getCurrency(code);
        this.renderPricingOptions(this.activeTab);
    }
  renderAmountSection(){ 
    let customAmtContainer = this.container.querySelector(".custom-amt-section")
    if(customAmtContainer){
        customAmtContainer.remove();
    }
    const tabWrapper = document.createElement('div');
    tabWrapper.className = 'w-full mt-5 custom-amt-section';
    tabWrapper.innerHTML = this.renderCustom()+this.renderMonthsDropdown();
    this.container.appendChild(tabWrapper);

  }
  customSelected(obj){
    this.container.querySelector(".amt-radio-custom").checked = true;
  }
  setDuration(){
    if(this.isNotReuccring()){
        this.duration = 1;
    }
  }
   allowOnlyNumbersAndDot(input, event) {
    const char = String.fromCharCode(event.which);
    const value = input.value;
  
    // Allow only digits and one dot
    if (!/[0-9]/.test(char) && (char !== '.' || value.includes('.'))) {
      return false; // Prevent the keypress
    }
    
  
    return true; // Allow the keypress
  }
  onCustomAmountUpdated(input){
    this.onChangeAmount('custom',input.value)
   

  }
    getCurrency(countryName) {
        return this.currencies.find(c => c.code.toLowerCase() == countryName.toLowerCase());
    }

  renderCustom(){ 
    return  ` 
    <input type="radio" name="donation" id="donation-custom" class="hidden peer amt-radio amt-radio-custom" value="custom" ${this.selectedAmt!=null && this.selectedAmt.id=="custom"?'checked="checked"':''}/>
    <label for="donation-custom"
        class=" border border-[#E9EAEB] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-300 peer-checked:border-[#181D27]">
        <div id="custom-amount" class="text-base text-left w-full p-5 font-bold pb-4">Enter custom amount</div>
        <!-- Amount Input -->
        <div class="flex items-center justify-between  p-5 pt-0  rounded-xl custom-input-section w-full">
            <div class="text-4xl font-normal text-[#A9A9A9] Bethany">${this.active_currency.symbol}</div>
            <input id="amount" type="text" placeholder="Other" onfocus="pricingTabs.customSelected(this)" onkeypress="return pricingTabs.allowOnlyNumbersAndDot(this, event)" onchange="pricingTabs.onCustomAmountUpdated(this)"
                class="tracking-[-2px] w-input w-full mx-2 outline-none text-4xl text-[#A35D5D] placeholder:text-[#A35D5D] Bethany placeholder:opacity-[0.3]"
                autofocus="true" maxlength="256" name="amount" data-name="Amount" ${this.selectedAmt!=null && this.selectedAmt.id=="custom"?`value="${this.selectedAmt.amount}"`:''}  />
                ${this.renderCurrency()}
        </div>
    </label>
	
	
	
	
	
	
    `;
  }
  renderCurrency(){
    let currencyHtml =``;
    //let selectedCurrency = this.getCurrency(this.currency_code);
    $.each(this.currencies, function(index, currency) {
         currencyHtml += `
        <li data-currency="USD" data-flag="${currency.flag}" onclick="pricingTabs.onChangeCurrency('${currency.code}')" class="li flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
            <img src="${currency.flag}" class="w-5 h-5 rounded-full object-cover"
                alt="${currency.name} Flag" />
            <span id="selectedCurrency">${currency.name}</span>
        </li>`;
    });
    return `
    <div class="relative group inline-block w-[120px]">
        <div class="flex items-center gap-1 sm:gap-2  bg-white cursor-pointer">
            <img id="selectedFlag" src="${this.active_currency.flag}" class="w-6 h-6 rounded-full object-cover" alt="Flag" />
            <span id="selectedCurrency" class="text-gray-700">${this.active_currency.name}</span>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
        <div class="absolute -left-[55px] pt-4 w-40 bg-transparent opacity-0 pointer-events-none translate-y-[-10px] transition-all duration-300 ease-out group-hover:opacity-100   group-hover:pointer-events-auto group-hover:translate-y-0 z-10">
            <ul class="text-gray-700 bg-white rounded-md shadow" id="currencyList">
                ${currencyHtml}
            </ul>
        </div>
    </div>`;
  }
  reccurringMonthsHtml(){
    if(this.end_after==1){
        return ` <div id="recurring_numbers" class="flex flex-col transition-all">
            <div class="flex">
                <div class="flex relative w-[120px] relative">
                    <button  type="button" class="custom-btn absolute left-5 top-1/2 -translate-y-1/2 " onclick="pricingTabs.updownVal(this)" data-action="decrease" >−</button>
                    <input type="number"   onchange="pricingTabs.onDuratioChange(this.value)" name="split_options" min="1" class="w-full text-center px-4 py-2  border border-[#D5D7DA] rounded-l-md  text-base outline-none focus:ring-2 focus:z-2 focus:ring-[#f7d0b4]  transition-all required" value="${this.duration}" style=" -webkit-appearance: none;" />
                    <button type="button" class="custom-btn absolute right-5 top-1/2 -translate-y-1/2" onclick="pricingTabs.updownVal(this)" data-action="increase">+</button>
                </div>
                
                <span class="border border-[#D5D7DA] border-l-0 rounded-r-md w-[120px] text-center flex items-center justify-center">Payments</span>
            </div>
            
            <p class="text-s font-medium text-[#535862]">Total donation <strong>${this.active_currency.symbol}${this.getGrandTotal()}</strong></p>
            
        </div>`
    } else {
        return ``;
    }
  }
  renderMonthsDropdown(){
    if(this.isNotReuccring()) return ``;
    return `
        	<div class="mt-[20px]">
                    <!-- Checkbox -->
                    <label class="inline-flex items-start space-x-2 cursor-pointer">
                        <input id="month_numbers" onchange="pricingTabs.onEndAfter(this)" type="checkbox" name="recurring_numbers"  data-target="recurring_numbers"
                            class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dependent-chk cursor-pointer" ${(this.end_after==1)?"checked":''}/>
                        <span class="text-gray-800 font-medium">End after</span>
                    </label>

                    <!-- Hidden Input Field -->
                    ${this.reccurringMonthsHtml()}
            </div>
            <style>
            input[type=number]::-webkit-inner-spin-button,
            input[type=number]::-webkit-outer-spin-button {
                -webkit-appearance: none;
            }
            </style>
    `;
  }

  updateGliderPosition() {
      const glider = document.getElementById('glider');
      const activeTabLabel = document.querySelector(`label[for="tab_${this.activeTab.id}"]`);
      const tabWidth = activeTabLabel.offsetWidth;
      const offset = activeTabLabel.offsetLeft;
      
      // Move the glider
      glider.style.width = `${tabWidth - 6}px`;
      glider.style.transform = `translateX(${offset + 3}px)`;
  }

  formatNum(num) {
      const parsed = parseFloat(num);
      if (isNaN(parsed)) return '';

      const hasDecimal = parsed % 1 !== 0;
      return parsed.toLocaleString('en-US', {
          minimumFractionDigits: hasDecimal ? 2 : 0,
          maximumFractionDigits: hasDecimal ? 2 : 0
      });
  }

  renderOptions(options) {
      let optionsHtml = '';
      options.forEach((item, idx) => {
          optionsHtml += `
              <div class="w-[48%] sm:w-[32%] flex-grow">
                  <input type="radio" name="donation" id="donation_option_${idx}" class="hidden peer amt-radio" onchange="pricingTabs.onChangeAmount('${item.id}')" value="${item.amount}" ${this.selectedAmt!=null && item.id==this.selectedAmt.id?'checked = "checked" ':''} />
                  <label for="donation_option_${idx}" class="flex flex-col gap-3 border border-[#E9EAEB] rounded-xl p-5 cursor-pointer peer-checked:border-[#a35d5d] peer-checked:bg-[#fff6f6]  h-full relative transition-all before:absolute before:left-0 before:right-0 before:top-0 before:bottom-0 before:border-[3px] before:border-[#181D27] before:rounded-xl before:opacity-0 peer-checked:opacity-100">
                      <p class="text-4xl text-[#A35D5D] tracking-[-2.5px]">${this.active_currency.symbol}${this.formatNum(item.amount)}</p>
                      <p class="text-xs font-medium text-black">${item.text}</p>
                  </label>
              </div>
          `;
      });
      return optionsHtml;
  }

  renderPricingOptions(activeTab) {
    let pricingOptionsContainer = this.container.querySelector(".pricing-options")
    if(pricingOptionsContainer){
      pricingOptionsContainer.remove();
    }
      const optionsWrapper = document.createElement('div');
      optionsWrapper.className = 'pricing-options';

      let optionsHtml = `
          <div class="mt-4">
              <div class="flex flex-wrap gap-3 mt-2.5">
                  <div class="donationContainer flex flex-wrap gap-2.5 w-full pb-[60px] overflow-hidden ${this.isOpen?'view_less':'h-[200px]'} relative donation-scroll-container transition-all duration-500 ease-in-out" id="donationContainer_${activeTab.id}">
                      ${this.renderOptions(activeTab.options)}
                      ${activeTab.options.length>4?this.renderExpander():''}
                  </div>
              </div>
          </div>
      `;

      optionsWrapper.innerHTML = optionsHtml;
      this.container.appendChild(optionsWrapper);
      this.renderAmountSection();
    //   if(this.isOpen){
    //     this.openBox();
    //   }else{
    //     this.closeBox();
    //   }
  }
  renderExpander(){
    return `<div class="absolute bottom-0 left-0 right-0 text-center h-[54px] flex items-center justify-center flex-col gap-2 bg-gradient-to-t from-white to-[rgba(255,255,255,0.6)]">
            <button onclick="pricingTabs.toggleExpand()" type="button" id="toggleAccordion" class="toggleAccordion flex flex-col items-center justify-center text-xs font-bold gap-1 transition-transform duration-300 tracking-[1.2px]">
                <span class="onee">VIEW ALL</span>    <span class="two hidden">VIEW LESS</span>
                <svg id="accordionArrow" class="accordionContent transition-transform duration-300  ${this.isOpen?'rotate-180':''}" width="28" height="13" viewBox="0 0 28 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1L14 12L26.5 1" stroke="#111111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </button>
        </div>`
  }
  openBox(){
    let boxContainer = this.container.querySelector(".donationContainer")
    let arrow = this.container.querySelector("#accordionArrow")

    boxContainer.style.height = boxContainer.scrollHeight + 'px';
    arrow.classList.add('rotate-180');
    boxContainer.classList.add('view_less'); 
  }
  closeBox(){
    let boxContainer = this.container.querySelector(".donationContainer")
    let arrow = this.container.querySelector("#accordionArrow")

    boxContainer.style.height = '200px';
    arrow.classList.remove('rotate-180');
    boxContainer.classList.remove('view_less'); 
  }
  toggleExpand(){
      if (!this.isOpen) {
       this.openBox();
    } else {
       this.closeBox()
    }
    this.isOpen = !this.isOpen; 
  }
}


(function($){
  $.fn.dependentCheckbox = function() {
      this.each(function() {
          let $checkbox = $(this);
          let toggle = () => {
              let $target = $("#" + $checkbox.data("target"));
              $checkbox.is(":checked") ? $target.show() : $target.hide();
          };
          $checkbox.on("change", toggle);
          toggle();
      });
      return this;
  };
})(jQuery);
(function($) {
  $.fn.GatewayTabs = function(options) {
      const settings = $.extend({
          activeIndex: 0,
          onSelected:null,
      }, options);

      this.each(function() {
          const $container = $(this);
          const $tabs = $container.find('.tab-button');
          const $contents = $container.find('.tab-content');

          $tabs.on('click', function() {
              const selected = $(this).data('method');

              $tabs.removeClass('shadow-[0px_0px_10px_0px_#0000001a] text-[#a35d5d] rounded-lg bg-[#fff]')
                   .addClass('text-[#717680]');
              
              $(this).addClass('shadow-[0px_0px_10px_0px_#0000001a] text-[#a35d5d] rounded-lg bg-[#fff]');

              $contents.addClass('hidden');
              $container.find(`#tab-content-${selected}`).removeClass('hidden');
              if(settings.onSelected!=null){
                  settings.onSelected(selected)
              }
              
          });

          $tabs.eq(settings.activeIndex).trigger('click');
      });

      return this;
  };
})(jQuery);
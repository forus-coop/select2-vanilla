/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(window.S2)var n=window.S2;n.define("select2/i18n/dsb",[],function(){var n=["znamuško","znamušce","znamuška","znamuškow"],e=["zapisk","zapiska","zapiski","zapiskow"],i=function(n,e){return 1===n?e[0]:2===n?e[1]:n>2&&n<=4?e[2]:n>=5?e[3]:void 0};return{errorLoading:function(){return"Wuslědki njejsu se dali zacytaś."},inputTooLong:function(e){var u=e.input.length-e.maximum;return"Pšosym lašuj "+u+" "+i(u,n)},inputTooShort:function(e){var u=e.minimum-e.input.length;return"Pšosym zapódaj nanejmjenjej "+u+" "+i(u,n)},loadingMore:function(){return"Dalšne wuslědki se zacytaju…"},maximumSelected:function(n){return"Móžoš jano "+n.maximum+" "+i(n.maximum,e)+"wubraś."},noResults:function(){return"Žedne wuslědki namakane"},searching:function(){return"Pyta se…"},removeAllItems:function(){return"Remove all items"}}}),window.require=n.require,window.define=n.define,n.define,n.require}();
/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(window.S2)var n=window.S2;n.define("select2/i18n/ps",[],function(){return{errorLoading:function(){return"پايلي نه سي ترلاسه کېدای"},inputTooLong:function(n){var e=n.input.length-n.maximum,i="د مهربانۍ لمخي "+e+" توری ړنګ کړئ";return 1!=e&&(i=i.replace("توری","توري")),i},inputTooShort:function(n){return"لږ تر لږه "+(n.minimum-n.input.length)+" يا ډېر توري وليکئ"},loadingMore:function(){return"نوري پايلي ترلاسه کيږي..."},maximumSelected:function(n){var e="تاسو يوازي "+n.maximum+" قلم په نښه کولای سی";return 1!=n.maximum&&(e=e.replace("قلم","قلمونه")),e},noResults:function(){return"پايلي و نه موندل سوې"},searching:function(){return"لټول کيږي..."},removeAllItems:function(){return"ټول توکي لرې کړئ"}}}),window.require=n.require,window.define=n.define,n.define,n.require}();
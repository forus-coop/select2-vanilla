/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(window.S2)var n=window.S2;n.define("select2/i18n/sl",[],function(){return{errorLoading:function(){return"Zadetkov iskanja ni bilo mogoče naložiti."},inputTooLong:function(n){var e=n.input.length-n.maximum,i="Prosim zbrišite "+e+" znak";return 2==e?i+="a":1!=e&&(i+="e"),i},inputTooShort:function(n){var e=n.minimum-n.input.length,i="Prosim vpišite še "+e+" znak";return 2==e?i+="a":1!=e&&(i+="e"),i},loadingMore:function(){return"Nalagam več zadetkov…"},maximumSelected:function(n){var e="Označite lahko največ "+n.maximum+" predmet";return 2==n.maximum?e+="a":1!=n.maximum&&(e+="e"),e},noResults:function(){return"Ni zadetkov."},searching:function(){return"Iščem…"},removeAllItems:function(){return"Odstranite vse elemente"}}}),n.define,n.require}();
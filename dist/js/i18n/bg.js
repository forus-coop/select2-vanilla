/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(window.S2)var n=window.S2;n.define("select2/i18n/bg",[],function(){return{inputTooLong:function(n){var i=n.input.length-n.maximum,t="Моля въведете с "+i+" по-малко символ";return i>1&&(t+="a"),t},inputTooShort:function(n){var i=n.minimum-n.input.length,t="Моля въведете още "+i+" символ";return i>1&&(t+="a"),t},loadingMore:function(){return"Зареждат се още…"},maximumSelected:function(n){var i="Можете да направите до "+n.maximum+" ";return n.maximum>1?i+="избора":i+="избор",i},noResults:function(){return"Няма намерени съвпадения"},searching:function(){return"Търсене…"},removeAllItems:function(){return"Премахнете всички елементи"}}}),n.define,n.require}();
/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(window.S2)var n=window.S2;n.define("select2/i18n/pl",[],function(){var n=["znak","znaki","znaków"],e=["element","elementy","elementów"],i=function(n,e){return 1===n?e[0]:n>1&&n<=4?e[1]:n>=5?e[2]:void 0};return{errorLoading:function(){return"Nie można załadować wyników."},inputTooLong:function(e){var r=e.input.length-e.maximum;return"Usuń "+r+" "+i(r,n)},inputTooShort:function(e){var r=e.minimum-e.input.length;return"Podaj przynajmniej "+r+" "+i(r,n)},loadingMore:function(){return"Trwa ładowanie…"},maximumSelected:function(n){return"Możesz zaznaczyć tylko "+n.maximum+" "+i(n.maximum,e)},noResults:function(){return"Brak wyników"},searching:function(){return"Trwa wyszukiwanie…"},removeAllItems:function(){return"Usuń wszystkie elementy"},removeItem:function(){return"Usuń element"},search:function(){return"Szukaj"}}}),window.require=n.require,window.define=n.define,n.define,n.require}();
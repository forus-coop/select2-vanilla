/*! Select2 4.1.0-rc.0 | https://github.com/select2/select2/blob/master/LICENSE.md */

!function(){if(window.S2)var e=window.S2;e.define("select2/i18n/ro",[],function(){return{errorLoading:function(){return"Rezultatele nu au putut fi incărcate."},inputTooLong:function(e){var n=e.input.length-e.maximum,t="Vă rugăm să ștergeți "+n+" caracter";return 1!==n&&(t+="e"),t},inputTooShort:function(e){return"Vă rugăm să introduceți "+(e.minimum-e.input.length)+" sau mai multe caractere"},loadingMore:function(){return"Se încarcă mai multe rezultate…"},maximumSelected:function(e){var n="Aveți voie să selectați cel mult "+e.maximum;return n+=" element",1!==e.maximum&&(n+="e"),n},noResults:function(){return"Nu au fost găsite rezultate"},searching:function(){return"Căutare…"},removeAllItems:function(){return"Eliminați toate elementele"}}}),window.require=e.require,window.define=e.define,e.define,e.require}();
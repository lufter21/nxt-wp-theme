(function() {
   'use strict';
   
   // animate when is visible
   const animationOnVisible = {
      animElements: null,
      
      scroll: function() {
         console.log('scr');
         console.log(this.animElements);
         const winBotEdge = window.pageYOffset + window.innerHeight;
         
         for (let i = 0; i < this.animElements.length; i++) {
            const animElem = this.animElements[i],
            animElemOffsetTop = animElem.getBoundingClientRect().top + window.pageYOffset,
            animElemOffsetBot = animElemOffsetTop + animElem.offsetHeight;
            
            if (animElemOffsetTop < winBotEdge && animElemOffsetBot > window.pageYOffset) {
               animElem.classList.add('animated');
            } else {
               animElem.classList.remove('animated');
            }
         }
      },
      
      init: function() {
         const animElements = document.querySelectorAll('.js-animate');
         
         if (animElements.length) {
            this.animElements = animElements;
            
            this.scroll();
         }
      }
   };
   
   // document ready
   document.addEventListener('DOMContentLoaded', function() {
      animationOnVisible.init();
      
      if (animationOnVisible.animElements) {
         window.addEventListener('scroll', animationOnVisible.scroll.bind(animationOnVisible));
      }
   });

   // onload animate
   window.onload = function () {
      const animElems = document.querySelectorAll('.js-onload-animate');

      for (let i = 0; i < animElems.length; i++) {
         animElems[i].classList.add('animated');
      }
   }
})();
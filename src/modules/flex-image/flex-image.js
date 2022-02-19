; var FlexImg;

(function() {
    'use strict';
    
    FlexImg = function(elementsStr) {
        
        function load(elem) {
            
            if (!elem.hasAttribute('data-images')) {
                return;
            }
            
            var images = elem.getAttribute('data-images').split(',');
            
            images.forEach(function(image) {
                
                var imageProp = image.split('->');
                
                if (window.innerWidth < (+imageProp[0])) {
                    elem.src = imageProp[1];
                }
                
            });
            
        }
        
        //init
        var elements = document.querySelectorAll(elementsStr);
        
        if (elements.length) {
            
            for (var i = 0; i < elements.length; i++) {
                load(elements[i]);
            }
            
        }
        
    }
})();
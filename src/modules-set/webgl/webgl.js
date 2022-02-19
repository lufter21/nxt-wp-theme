; var WEBGL;

(function() {
   WEBGL = {
      VSTxt: null,
		FSTxt: null,
		
      loadTxtRes: function(url, successFun) {
         ajax({
            url: url,
            success: function(response) {
               successFun(response);
            },
            error: function(response) {
               
            }
         });
		},
		
		start: function() {
			
		},
      
      init: function() {
         this.loadTxtRes('/shaders/vertexShader.glsl', (response) => {
				this.VSTxt = response;
				
				this.loadTxtRes('/shaders/fragmentShader.glsl', (response) => {
					this.FSTxt = response;

					this.start();
				});
			});
      }
   };
})();


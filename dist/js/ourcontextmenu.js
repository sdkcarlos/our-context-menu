if("undefined"==typeof jQuery){
    throw new Error("Our Context Menu requires jQuery");
}
(function($){
    /**
     * 
     * @type type
     */
    var api = {};
    
    /**
     * This function returns the location where the context menu should be correctly positioned according
     * to the click.
     * 
     * @param {type} clickEvent
     * @param {type} contextItem
     * @returns {ourcontextmenu_L4.api.getContextPosition._location}
     */
    api.getContextPosition = function(clickEvent,contextItem){
        var dimensions = {
            windowWidth:$(window).width(),
            windowHeight:$(window).height(),
            containerWidth:$(contextItem).outerWidth(),
            containerHeight:$(contextItem).outerHeight(),
            distanceX : clickEvent.pageX,
            distanceY : clickEvent.pageY
        };
        
        var _location = {};
        
        // Alles ok
        if(((dimensions.distanceX + dimensions.containerWidth) <= dimensions.windowWidth) && ((dimensions.distanceY + dimensions.containerHeight) <= dimensions.windowHeight)){
            _location.x = clickEvent.pageX;
            _location.y = clickEvent.pageY;
        // Needs to be relocated in both locations (x,y)
        }else if(((dimensions.distanceX + dimensions.containerWidth) >= dimensions.windowWidth) && ((dimensions.distanceY + dimensions.containerHeight) >= dimensions.windowHeight)){
            _location.x = (clickEvent.pageX - (dimensions.containerWidth));
            _location.y = (clickEvent.pageY - (dimensions.containerHeight));
        // Needs to be relocated horizontally (X)
        }else if((dimensions.distanceX + dimensions.containerWidth) >= dimensions.windowWidth){
            _location.x = (clickEvent.pageX - (dimensions.containerWidth));
            _location.y = clickEvent.pageY;
        // Needs to be relocated vertically (Y)
        }else if((dimensions.distanceY + dimensions.containerHeight) >= dimensions.windowHeight){
            _location.x = clickEvent.pageX;
            _location.y = (clickEvent.pageY - (dimensions.containerHeight));
        }
        
        // Fix for parents with relative or absolute positioning
        var parentOffset = $(contextItem).offsetParent().offset();
        _location.x = _location.x - parentOffset.left;
        _location.y = _location.y - parentOffset.top;
        
        return _location;
    };
    
    /**
     * Handle context menu via selector
     */
    api.selector = {
        /**
         * Function to determine an action when the user
         * stops press a key in a DOM Object
         * useful for example (searchers) to not send 
         * a query every time the user press a key, instead
         * this will do the action after of a keypress with 
         * a given or default time.
         * 
         * @param {function} funcion
         * @param {integer} tiempo
         * @returns {undefined}
         */
        ourcontextmenu : function(settings){
            var container = this;
            
            if(!(settings.target instanceof jQuery)){
                throw new Error("The context menu needs a target (selected DOM item with jQuery)");
            }
            
            settings.target.bind("contextmenu", function (event) {
                // Stop the browser contextual menu
                event.preventDefault();
                
                var contextLocation = api.getContextPosition(event,container);
                
                if(typeof settings.beforeShow === 'function'){
                    var show = settings.beforeShow(event.target);
                    
                    if(show !== false){
                        $(container).finish().toggle().css({
                            top: contextLocation.y + "px",
                            left: contextLocation.x + "px"
                        });
                    }
                }else{
                    $(container).finish().toggle().css({
                        top: contextLocation.y + "px",
                        left: contextLocation.x + "px"
                    });
                }
            });
            
            // If the document is clicked somewhere
            $(document).bind("mousedown", function (event) {
                // If the clicked element is not the menu
                if (!$(event.target).parents('.our-context-menu').length > 0) {

                    // Hide it if not prevented
                    if(typeof settings.onHide === 'function'){
                        var close = settings.onHide();
                        
                        if(close !== false){
                            $(container).hide();
                        }
                    // else close it
                    }else{
                        $(container).hide();
                    }
                }
            });
            
            $(container).find('li').click(function(){
                var selectedDom = $(this);
                
                if(typeof settings.onAction === 'function'){
                    var execute = settings.onAction(selectedDom);
                    
                    if(execute !== false){
                        $(container).hide();
                    }
                }
            });
        }
    };
    
    $.fn.extend(api.selector);
})(jQuery);
/*
* @Author: Alex Dong
* @Date:   2020-07-29 13:21:07
 * @Last Modified by: Alex Dong
 * @Last Modified time: 2022-07-30 17:56:37
*/

(function($) {
	"use strict";
    $.gridSlider = function(element, options) {
        var _ = this,
        	defaults = {
	            selector: '.grid-slider',
	            IntersectionObserver: false
	        },
            $element = $(element);
        _.settings = {};
        _.init = function() {
            _.settings = $.extend({}, defaults, options);
            _._initSlider();
        }
		_.uniqid = function (length=10) {
            let result       	   = '';
            const characters 	   = 'abcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for ( let i = 0; i < length; i++ ) {
            	result += characters.charAt(Math.floor(Math.random() * charactersLength));
           	}
           	return result;
		};
	    _._initSlider = function () {
	    	var settings = _.settings,
	        	useIntersectionObserver = settings.IntersectionObserver,
	        	$head = $('head'),
	        	elements = $element.find(settings.selector);
	        if(!elements.length) elements = $element;
	        elements.each(function() {
	            var element = $(this),
                    isRTL   = $('body').hasClass('rtl'),
	            	selector = 'grid-slider-' + _.uniqid();
	            var styleId  = selector;
	            element.addClass(selector);
	            selector = '.' + selector;
	            if(isRTL){
	                element.attr('dir', 'rtl');
	                element.data( 'rtl', true );
	            }
	            if(iClass === undefined){
	                element.children().addClass('alo-item');
	                var iClass = '.alo-item';
	            }
	            var options = element.data(),
					rows 	= ((options || {}).rows === void 0) ? 1 : options.rows,
					classes	= rows ? selector + ' '+ iClass : selector + ' .slick-track > '+ iClass,
	            	padding = ((options || {}).padding === void 0) ? 0 : options.padding,
	            	style 	= classes + '{padding: 0 '+padding+'px; box-sizing: border-box} ' + selector + '{margin: 0 -'+padding+'px; }' + selector + '.grid-init{visibility: visible; opacity: 1;}';
              		style  += classes + '{float: left; min-height: 1px; min-width: 1px;}';
              		style  += '.rtl ' + classes + '{float: right; min-height: 1px; min-width: 1px;}';
	            if(style) $head.append('<style type="text/css" >'+style+'</style>');
	            style 		= '';
	            if(options.slidesToShow){
					if ("IntersectionObserver" in window && useIntersectionObserver) {
						var nthChild = options.slidesToShow + 1;
						style += selector + ' .item:nth-child(n+ ' + nthChild + ')' + '{display: none;} ' + selector +  ' .item{float:left};';
						let gridSliderObserver = new IntersectionObserver(function(entries, observer) {
							entries.forEach(function(entry) {
								if (entry.isIntersecting) {
									let el  = entry.target;
									var $el = $(el);
									$el.on('init', function(){
										$head.find('#' + styleId).remove();
									});
									_.sliderRender($el);
									/* gridSliderObserver.unobserve(el); */
								}
							});
						});
						element.each(function(index, el){
					    	gridSliderObserver.observe(el);
					    });
					} else {
						_.sliderRender(element);
					}
	            }
	            if(options.appendArrows || options.appendDots){
                  	var wrapper = options.wrapper ? element.find(options.wrapper) : element.parent();
                	if(options.appendArrows) element.data('append-Arrows', wrapper.find(options.appendArrows));
                  	if(options.appendDots) element.data('append-Dots', wrapper.find(options.appendDots));
	            }
	            var responsive 	= _.getPesponsive(options);
				if(responsive == undefined) return;
				var length = Object.keys(responsive).length;
				$.each( responsive, function( key, value ) {
					var col = 0, maxWith = 0, minWith = 0;
					$.each( value , function(size, num) { minWith = parseInt(size) + 1; col = num;});
					if(key+2<length){
						$.each( responsive[key+1], function( size, num) { maxWith = size; col = num;});
						style += ' @media (min-width: '+minWith+'px) and (max-width: '+maxWith+'px)';
					} else { 
						if(key+2 == length) return; // don't use key = length - 1;
						$.each( responsive[key], function( size, num) { maxWith = size; col = num;});
						style += ' @media (min-width: '+maxWith+'px)';
					}
					let clearRtl = (rows != 1) ? classes + ':nth-child('+col+'n+1){clear: left}' : ' ';
                  	clearRtl 	+= (rows != 1) ? '.rtl ' + classes+':nth-child('+col+'n+1){clear: right}' : ' ';
					style += ' {'+selector + '{margin: 0 -'+padding+'px}'+classes+'{padding: 0 '+padding+'px; box-sizing: border-box; width: calc(100% / ' + col + ')} '+clearRtl+'}';
				});	
	           	$head.append('<style type="text/css" id="' + styleId + '" >'+style+'</style>');
	           	element.addClass('grid-init');	
	        });
	        return this;
	    };
	    _.getPesponsive = function (options) {
	    	if(!options.responsive) return;
            if(!options.slidesToShow) return options.responsive.reverse();
			var responsive 	= options.responsive,
				length = Object.keys(responsive).length,
				gridResponsive = [];
			$.each( responsive, function( key, value ) { 
				var breakpoint = {};
				breakpoint[value.breakpoint] = parseInt(value.settings.slidesToShow);
				gridResponsive.push(breakpoint);
			 });
			return gridResponsive.reverse();
	    };
	    _.sliderRender = function (el) {
	    	if(el.hasClass('slick-initialized')){
	    		el.slick("refresh");
	    		return;
	    	}
	    	var options = el.data(),
				lazy    = el.find('img.lazyload');
	        if(lazy.length){
	            lazy.each(function(index) {
	                $(this).data('lazy', $(this).data('src'));
	            });
	        }
	        el.on('init', function(event, slick){
	        	$('body').trigger('contentUpdated'); // support lazyload
	            var video = $(this).find('.external-video');
	            video.on('click', function(e) {
	            	e.preventDefault();
	            	if($this.hasClass('embed')) return;
	                var $this = $(this), img = $this.find('img'), url = $(this).data('video');
	                url = url.replace("://vimeo.com/", "://player.vimeo.com/video/");
	                url = url.replace("://www.youtube.com/watch?v=", "://youtube.com/embed/");
	                url = url + '?autoplay=1&badge=0';
	                var iframe = '<iframe class="iframe-video" src="' + url + '" width="' + img.width() + '" height="' + img.height()  + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'; 
	                $this.append(iframe).addClass('embed');
	                img.hide();
	            });
	        });
	        var slider = el.slick(options);
	        el.on('beforeChange', function(event, slick, currentSlide, nextSlide){
	            var video = $(this).find('.external-video');
	            video.removeClass('embed').find('img').show();
	            video.find('.iframe-video').remove();
	        });
	        slider.on( "click", ".item", function() {
	            el.slick('slickSetOption', "autoplay",false,false);
	        });
	    }; 
        _.init();
    }
    $.fn.gridSlider = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('gridSlider')) {
                var plugin = new $.gridSlider(this, options);
                $(this).data('gridSlider', plugin);
            }
        });
    }
    $( document ).ready(function($) {
		$(".grid-slider").not('.exception').each(function() {
			$(this).gridSlider();
		});
    });
    $(document).on('contentUpdated', function (event) {
		$(".grid-slider").not('.exception, .grid-init, .slick-initialized').each(function() {
			$(this).gridSlider();
		});
    });
    $(document).on('Alothemes:SwitchRTL:reload', function (event) {
		$(".grid-slider").not('.exception').each(function() {
            if($('body').hasClass('rtl')){
              	$(this).attr('dir', 'rtl').data('rtl', true);
            }else {
              	$(this).attr('dir', 'ltr').data('rtl', false);            
            }
          	if($(this).hasClass('slick-initialized')){
          		$(this).slick("unslick").slick($(this).data());
          	}
		});
    });
    $(document).on('shopify:section:unload shopify:section:load', function (event) {
      	$('#shopify-section-' + event.detail.sectionId).find(".grid-slider").not('.exception').each(function() {
        	$(this).gridSlider();
      	});
    });
})(jQuery);

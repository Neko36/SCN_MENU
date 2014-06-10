jQuery.sap.declare("neko.control.MultiLevelMenu");
jQuery.sap.require("sap.ui.commons.library");
jQuery.sap.require("sap.ui.core.Control");

/**
 * Reference: Multi-Level Push Menu
 * 
 * http://tympanus.net/codrops/2013/08/13/multi-level-push-menu/
 */
sap.ui.core.Control.extend("neko.control.MultilevelMenu", {

	metadata : {
		properties: {
			// overlap: there will be a gap between open levels
			// cover: the open levels will be on top of any previous open level
			type: {
				type: "string",
				defaultValue: "overlap",
				group : "Appearance"
			},
			// space between each overlaped level
			levelSpacing:{
				type: "int",
				defaultValue: 40,
				group : "Dimension"				
			},
			// flag to control the existence of backlinks
			showBackLinks: {
				type : "boolean",
				defaultValue: false,
				group : "Behavior"
			},
			// id of element for opening menu
			triggerId: {
				type: "string",
				group : "Behavior"
			}			
		},
		
		aggregations: {
			"content" : {
				singularName: "content"
			},
			"menu" : {				
				type : "sap.ui.commons.MenuItem",
				multiple : false,
				singularName: "menu"
			}
		}
	},
	
	/**
	 * Using render class for creating HTML-output
	 */
	renderer : "neko.renderer.MultiLevelMenu",

	/**
	 * Control-Logic starts here, when HTML is rendered and part of the DOM
	 */
	onAfterRendering : function() {
		
		// if menu is open or not
		this.open = false;
		// level depth
		this.level = 0;
		// the main object
		this.$menu = $("#mp-menu");
		// the moving wrapper
		this.$wrapper = $("#mp-pusher");
		// the mp-level elements
		this.$levels = this.$menu.find("div.mp-level");
		// save the depth of each of these mp-level elements
		var self = this;
		$.each(this.$levels , function( index, level ) {
			$(level).attr("data-level", self._getLevelDepth(level, self.$menu.attr("id"), "mp-level"));
		});
		// the menu items
		this.$menuItems = this.$menu.find( "li" );
		// if type == "cover" these will serve as hooks to move back to the previous level
		this.$levelBack = this.$menu.find(".mp-back");
		// event type (if mobile use touch events)
		this.eventtype = this._mobileCheck() ? "touchstart" : "click";
		// add the class mp-overlap or mp-cover to the main element depending on options.type
		this.$menu.addClass("mp-" + this.getType());
		// initialize / bind the necessary events
		
		// consistency checks
		if(this.$menuItems.length && this.$levels.length){
			this._initEvents();	
		}else{
			console.error("ML_MENU_CONTROL:", "Error in initialization process");
		}			
	},

	/**
	 * Registers Event-Handlers
	 */
	_initEvents : function(){
		// safe reference
		var self = this;
		
		var bodyClickFn = function( element ) {
			self._resetMenu();
			$(element).off( self.eventtype, bodyClickFn );
		};

		// Event-Handler for menu trigger
		$("#"+this.getTriggerId()).on(this.eventtype, function( event ) {
			
			// stop event bubbling and default behavior
			event.stopPropagation();
			event.preventDefault();
			
			if( self.open ) {
				// if menu is open, close menu
				self._resetMenu();
			}
			else {
				// open menu
				self._openMenu();
				// the menu should close if clicking somewhere on the body (excluding clicks on the menu)
				$(document).on(self.eventtype, function( event ) {
					if( self.open && !self._hasParent( event.target, self.$menu.attr("id")) ) {
						bodyClickFn( this );
					}
				} );
			}
		});
			
		this.$menu.find("a").on(self.eventtype, function(event){
			// Fires custom event for action and navigation event-handling
			$(document).trigger("ml-menu-press", {id:event.target.id, name:event.target.text});
		});
		
		$.each(this.$menuItems , function( index, menuItem ) {
	
			// check if it has a sub level
			var subLevel = $(menuItem).find( "div.mp-level" ).get(0);
			if( subLevel ) {
				// find all link-elements
				$(menuItem).find("a").on(self.eventtype, function(event){
					// get the level depth of the closest sublevel-DOM-element
					var level = $(menuItem).closest(".mp-level").attr("data-level");
					// if current level is smaller or equal, open next level
					if( self.level <= level ) {	
						event.preventDefault();
						event.stopPropagation();
						$(menuItem).closest(".mp-level").addClass("mp-level-overlay");
						self._openMenu( subLevel );
					}
				});		
			}
		});
		
		// closing the sub levels :
		// by clicking on the visible part of the level element
		$.each(this.$levels , function( index, level ) {
			$(level).on(self.eventtype, function( event ) {
				event.stopPropagation();
				var l = $(level).attr("data-level");
				if( self.level > l ) {
					self.level = l;
					self._closeMenu();
				}
			});
		});
		
		// by clicking on a specific element
		$.each(this.$levelBack , function( index, levelBack ) {
			$(levelBack).on(self.eventtype, function( event ) {
				event.preventDefault();
				// get the level depth of the closest sublevel-DOM-element
				var level = $(levelBack).closest(".mp-level").attr("data-level");
				// if current level is smaller or equal, close sublevel or entire menu
				if( self.level <= level ) {
					event.stopPropagation();
					self.level = level - 1;
					// depending on the level, reset or close menu
					if(self.level === 0){
						self._resetMenu();
					}else{
						self._closeMenu();
					}
				}
			});
		});	
	},

	/**
	 * Opens the Menu and corresponding Sublevels
	 * 
	 * @param {DOM element} subLevel A SubLevel of the Menu
	 */
	_openMenu : function( subLevel ) {

		var self = this;

		// increment level depth
		this.level++;

		// move the main wrapper
		var levelFactor = ( this.level - 1 ) * this.getLevelSpacing(),
			translateValue = this.getType() === "overlap" ? this.$menu.outerWidth(true) + levelFactor : this.$menu.outerWidth(true);

		this._setTransform( "translate3d(" + translateValue + "px,0,0)" );

		if( subLevel ) {
			// reset transform for sublevel
			this._setTransform( "", subLevel );
			// need to reset the translate value for the level menus that have the same level depth and are not open
			$.each(this.$levels , function( index, level ) {
				if (level != subLevel && !$(level).hasClass("mp-level-open")){
					self._setTransform( "translate3d(-100%,0,0) translate3d(" + -1*levelFactor + "px,0,0)", level );
				}
			});
			$(subLevel).addClass("mp-level-open");
		}else{
			// add class mp-level-open to the opening level element
			$(this.$levels[0]).addClass("mp-level-open");
		}
		// add class mp-pushed to main wrapper if opening the first time
		if( this.level === 1 ) {
			this.$wrapper.addClass("mp-pushed");
			this.open = true;
		}
	},
	
	/**
	 * Closes the entire Menu
	 */
	_resetMenu : function() {
		this._setTransform("translate3d(0,0,0)");
		this.level = 0;
		// remove class mp-pushed from main wrapper
		this.$wrapper.removeClass("mp-pushed");
		this._toggleLevels();
		this.open = false;
	},

	/**
	 * Closes SubLevels
	 */
	_closeMenu : function(){
		var translateVal = this.getType() === "overlap" ? this.$menu.outerWidth(true) + ( this.level - 1 ) * this.getLevelSpacing() : this.$menu.outerWidth(true);
		this._setTransform( "translate3d(" + translateVal + "px,0,0)" );
		this._toggleLevels();
	},

	/**
	 * Translates the given element
	 * 
	 * @param {string} value CSS-Value for translation
	 * @param {DOM element} element DOM-element, which is part of the translation
	 */
	_setTransform : function( value, element ) {
		element = element || this.$wrapper.get(0);
		$(element).css("WebkitTransform", value);
		$(element).css("MozTransform", value);
		$(element).css("transform", value);
	},

	/**
	 * Removes classes mp-level-open/overlay from closing levels
	 */
	_toggleLevels : function() {
		var self = this;
		$.each(this.$levels , function( index, level ) {
			if ($(level).attr("data-level") >= self.level +1){
				$(level).removeClass("mp-level-open");
				$(level).removeClass("mp-level-overlay");
			}else if( Number($(level).attr("data-level")) == self.level){
				$(level).removeClass("mp-level-overlay");
			}
		});
	},

	/**
	 * Provides a simple MobileCheck
	 */
	_mobileCheck : function(){
		// http://coveroverflow.com/a/11381730/989439
		var check = false;
		(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	},

	/**
	 * Returns the depth of the element "element" relative to element with id=id.
	 * For this calculation only parents with classname = waypoint are considered
	 * 
	 * @param {DOM element} element Source-Element for calculation
	 * @param {string} id Target-Element, calculation stops here
	 * @param {string} waypoint CSS-Class, which determines the waypoint
	 * @param {int} cnt Counter for Level Depth
	 */
	_getLevelDepth : function(element, id, waypoint, cnt ){

		cnt = cnt || 0;
		if(element.id.indexOf(id) >= 0) return cnt;
		if($(element).hasClass(waypoint)){
			++cnt;
		}
		return element.parentNode && this._getLevelDepth( element.parentNode, id, waypoint, cnt);
	},

	/**
	 * Determines the existing of a parent
	 * 
	 * @param {DOM element} element DOM-element, which is part of the translation
	 * @param {string} id Element, which is an exception of the determination
	 */
	_hasParent : function(element, id){
		// taken from https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
		if (!element) return false;
		var el = element.target||element.srcElement||element||false;
		while (el && el.id != id) {
			el = el.parentNode||false;
		}
		return (el!==false);
	}
});
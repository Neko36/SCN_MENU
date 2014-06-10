sap.ui.controller("scn_menu.app", {

	/**
	* Called when a controller is instantiated and its View controls (if available) are already created.
	* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	* @memberOf scn_menu.app
	*/
	onInit: function() {
		
		this.registerNavigation();
	},
	
	/**
	 * Creates an event-handler for doing navigation stuff
	 * 
	 * @memberOf scn_menu.app
	 */
	registerNavigation : function(){
		
		$(document).on("ml-menu-press", function(event, params){
						
			switch(params.id){
				case "item_4":
					alert("MenuItem " + params.name + " pressed");
					break;
				case "item_5":	
					alert("MenuItem " + params.name + " pressed");
					break;			
				default:
					// backLinks, which have no id, can be handled here...
					break;
			}
		});
	}
});
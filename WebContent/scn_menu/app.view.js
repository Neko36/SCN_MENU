jQuery.sap.require("neko.control.MultiLevelMenu");
jQuery.sap.require("neko.element.MultiLevelMenuItem");

sap.ui.jsview("scn_menu.app", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is
	 * not implemented, or that "null" is returned, this View does not have a
	 * Controller.
	 * 
	 * @memberOf scn_menu.app
	 */
	getControllerName : function() {
		return "scn_menu.app";
	},
	
	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf scn_menu.app
	 */
	createContent : function(oController) {

		// create the ApplicationHeader control
		var oAppHeader = new sap.ui.commons.ApplicationHeader("AppHeader", {
			logoText : "Multi-Level Push Menu for UI5",
			displayWelcome : false,
			displayLogoff : false
		});

		// create a Panel for placing views to it
		var oPanel = new sap.ui.commons.Panel("ViewContainer", {
			text : "Content",
			applyContentPadding : true,
			areaDesign : sap.ui.commons.enums.AreaDesign.Plain,
			borderDesign : sap.ui.commons.enums.BorderDesign.None,
			showCollapseIcon : false
		});

		// button for opening menu
		var oButton = new sap.ui.commons.Button("ActionButton", {
			text : "Open Menu",
			tooltip : "Open Menu"
		});

		oPanel.addContent(oButton);

		// create a Vertical Layout Container to arrange all controls
		var oVerticalLayout = new sap.ui.layout.VerticalLayout("MainLayout", {
			width : "100%",
			content : [ oMenu, oAppHeader, oPanel ]
		});
		
		var oMainMenu = this.generateMenuStructure();

		// create the new custom control and place everything in it
		var oMenu = new neko.control.MultilevelMenu("Menu", {
			content : oVerticalLayout,
			menu : oMainMenu,
			triggerId : oButton.getId()
		});

		// place menu in content-area
		oMenu.placeAt("content");
	},
	
	/**
	 * Generates the menu structure for the Multi-Level Menu Control
	 * 
	 * @memberOf scn_menu.app
	 */
	generateMenuStructure: function(){
				
		// top menu item
		var oTopMenuItem = new neko.element.MultiLevelMenuItem("item_top", {
			text : "All Categories",
			iconClass : "icon-world"
		});
		// first level menu
		var oSubMenu1 = new sap.ui.commons.Menu("menu1");
		// second level menu for "Devices"
		var oSubMenu2 = new sap.ui.commons.Menu("menu2");
		// second level menu for "Magazines", without icons
		var oSubMenu3 = new sap.ui.commons.Menu("menu3");
		// third level menu for "Devices"->"Phones", without icons
		var oSubMenu4 = new sap.ui.commons.Menu("menu4");
		
		// create first level with basic menu-items
		oTopMenuItem.setSubmenu(oSubMenu1);

		var oMenuItem1 = new neko.element.MultiLevelMenuItem("item_1", {
			text : "Devices",
			iconClass : "icon-device"
		});
		oSubMenu1.addItem(oMenuItem1);

		var oMenuItem2 = new neko.element.MultiLevelMenuItem("item_2", {
			text : "Magazines",
			iconClass : "icon-magazine"
		});
		oSubMenu1.addItem(oMenuItem2);

		var oMenuItem3 = new neko.element.MultiLevelMenuItem("item_3", {
			text : "Store",
			iconClass : "icon-store",
			href : "http://www.amazon.com/" // this site will be opened in the current frame
		});
		oSubMenu1.addItem(oMenuItem3);

		var oMenuItem4 = new neko.element.MultiLevelMenuItem("item_4", {
			text : "Collections",
			iconClass : "icon-collection"
		});
		oSubMenu1.addItem(oMenuItem4);

		var oMenuItem5 = new neko.element.MultiLevelMenuItem("item_5", {
			text : "Credits",
			iconClass : "icon-credit"
		});
		oSubMenu1.addItem(oMenuItem5);

		// Create next sublevel "Devices"
		oMenuItem1.setSubmenu(oSubMenu2);

		var oMenuItem6 = new neko.element.MultiLevelMenuItem("item_1-1", {
			text : "Mobile Phones",
			iconClass : "icon-phone"
		});
		oSubMenu2.addItem(oMenuItem6);

		var oMenuItem = new neko.element.MultiLevelMenuItem("item_1-2", {
			text : "Televisions",
			iconClass : "icon-television"
		});
		oSubMenu2.addItem(oMenuItem);

		oMenuItem = new neko.element.MultiLevelMenuItem("item_1-3", {
			text : "Cameras",
			iconClass : "icon-camera"
		});
		oSubMenu2.addItem(oMenuItem);
		
		// Create next sublevel "Magazines"
		oMenuItem2.setSubmenu(oSubMenu3);
		
		oMenuItem = new neko.element.MultiLevelMenuItem("item_2-1", {
			text : "National Geographic",
			href : "http://www.nationalgeographic.com/",
			target : "_blank" // this site will be opened in a new window or tab
		});
		oSubMenu3.addItem(oMenuItem);

		oMenuItem = new neko.element.MultiLevelMenuItem("item_2-2", {
			text : "Scientific American",
			href : "http://www.scientificamerican.com/",
			target : "_blank" // this site will be opened in a new window or tab
		});
		oSubMenu3.addItem(oMenuItem);
		
		// Create next sublevel "Devices"->"Mobile Phones"
		oMenuItem6.setSubmenu(oSubMenu4);
		
		oMenuItem = new neko.element.MultiLevelMenuItem("item_1-1-1", {
			text : "Super Smart Phone"
		});
		oSubMenu4.addItem(oMenuItem);

		oMenuItem = new neko.element.MultiLevelMenuItem("item_1-1-2", {
			text : "Thin Magic Mobile"
		});
		oSubMenu4.addItem(oMenuItem);
		
		oMenuItem = new neko.element.MultiLevelMenuItem("item_1-1-3", {
			text : "Performance Crusher"
		});
		oSubMenu4.addItem(oMenuItem);
		
		return oTopMenuItem;
	}
});
jQuery.sap.declare("neko.renderer.MultiLevelMenu");

neko.renderer.MultiLevelMenu = {};

/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 *
 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
 */
neko.renderer.MultiLevelMenu.render = function(oRm, oControl){
	
	neko.renderer.control = oControl;
	
	oRm.write("<div");
	oRm.writeControlData(oControl);
	oRm.writeStyles();
	oRm.addClass("container");
	oRm.writeClasses();
	oRm.write(">");
	oRm.write("<div");
	oRm.writeAttribute("id", "mp-pusher");
	oRm.addClass("mp-pusher");
	oRm.writeClasses();
	oRm.write(">");
	oRm.write("<nav");
	oRm.writeAttribute("id", "mp-menu");
	oRm.addClass("mp-menu");
	oRm.writeClasses();
	oRm.write(">");
	// render menu structure
	this.renderMenu(oRm, oControl.getMenu(), true);
	oRm.write("</nav>");
	oRm.write("<div");
	oRm.addClass("scroller");
	oRm.writeClasses();
	oRm.write(">");
	oRm.write("<div");
	oRm.addClass("scroller-inner");
	oRm.writeClasses();
	oRm.write(">");
	// render content
	$.each(oControl.getContent() , function( index, content ) {
		oRm.renderControl(content);
	});
	oRm.write("</div>");
	oRm.write("</div>");
	oRm.write("</div>");
	oRm.write("</div>");
};

/**
 * Renders the HTML recursively for the given menu structure
 *
 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
 * @param {neko.element.MultiLevelMenuIteml} oMenu The menu structure.
 * @param {boolean} topNav Controls the rendering of the top navigation item.
 */
neko.renderer.MultiLevelMenu.renderMenu = function(oRm, oMenu, topNav) {
	
	var self = this;
	
	// render new menu-level, if a menu-object has a submenu
	if(oMenu.getSubmenu()){
		
		if(topNav === false){
			oRm.write("<li");
			oRm.addClass("icon");
			oRm.addClass("icon-arrow-left");
			oRm.writeClasses();
			oRm.write(">");
			this.renderLink(oRm, oMenu);
		}

		oRm.write("<div");
		oRm.addClass("mp-level");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("<h2");
		if(oMenu.getIconClass()){
			this.renderIcon(oRm, oMenu);
		}	
		oRm.write(">");
		oRm.writeEscaped(oMenu.getText());
		oRm.write("</h2>");
		
		// render backlinks
		if(neko.renderer.control.getShowBackLinks() === true && topNav === false){
			oRm.write("<a");
			oRm.addClass("mp-back");
			oRm.writeClasses();
			oRm.writeAttributeEscaped("href", "javascript:void(0);");
			oRm.write(">");
			oRm.write("back");
			oRm.write("</a>");
		}
		
		oRm.write("<ul>");
		$.each(oMenu.getSubmenu().getItems(), function( index, menuItem){
			// recursive call, until all items and submenus are rendernd
			self.renderMenu(oRm, menuItem, false);
		});
		oRm.write("</ul>");
		oRm.write("</div>");

		if(topNav === false){
			oRm.write("</li>");
		}
	}else{
		oRm.write("<li>");
		this.renderLink(oRm, oMenu);
		oRm.write("</li>");
	}

};

/**
 * Renders the HTML for a link
 *
 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
 * @param {neko.element.MultiLevelMenuIteml} oMenuItem A menu item.
 */
neko.renderer.MultiLevelMenu.renderLink = function(oRm, oMenuItem){
	
	oRm.write("<a");
	oRm.writeControlData(oMenuItem);
	// render href attribute
	if (oMenuItem.getHref()) {
		oRm.writeAttributeEscaped("href", oMenuItem.getHref());
	}else{
		oRm.writeAttributeEscaped("href", "javascript:void(0);");
	}
	// render target attribute
	if (oMenuItem.getTarget()) {
		oRm.writeAttributeEscaped("target", oMenuItem.getTarget());
	}else{
		oRm.writeAttributeEscaped("target", "_self");
	}
	// render iconClass
	if(oMenuItem.getIconClass()){
		this.renderIcon(oRm, oMenuItem);
	}
	oRm.write(">");
	// render text
	oRm.writeEscaped(oMenuItem.getText());
	oRm.write("</a>");
};

/**
 * Renders the HTML for an icon
 *
 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
 * @param {neko.element.MultiLevelMenuIteml} oMenuItem A menu item.
 */
neko.renderer.MultiLevelMenu.renderIcon = function(oRm, oMenuItem){

	oRm.addClass("icon");
	oRm.addClass(oMenuItem.getIconClass());
	oRm.writeClasses();

};

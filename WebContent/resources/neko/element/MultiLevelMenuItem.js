jQuery.sap.declare("neko.element.MultiLevelMenuItem");
jQuery.sap.require("sap.ui.commons.MenuItem");

/**
 * This element is derivation of sap.ui.commons.MenuItem. It extends
 * the standard control by additional attributes.
 */
sap.ui.commons.MenuItem.extend("neko.element.MultiLevelMenuItem", {

	metadata : {
		properties : {
			iconClass : {
				type : "string",
				group : "Appearance"
			},
			href : {
				type : "string",
				defaultValue: "javascript:void(0);",
				group : "Behavior"				
			},
			target : {
				type : "string",
				defaultValue: "_self",
				group : "Behavior"				
			}
		}
	}
});
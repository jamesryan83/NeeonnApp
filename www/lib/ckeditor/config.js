/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {

    config.extraPlugins = "sharedspace,justify";

	config.toolbarGroups = [
		{ name: "document", groups: [ "mode", "document", "doctools" ] },
		{ name: "clipboard", groups: [ "clipboard", "undo" ] },
		{ name: "editing", groups: [ "find", "selection", "spellchecker", "editing" ] },
		{ name: "forms", groups: [ "forms" ] },
		{ name: "basicstyles", groups: [ "basicstyles", "cleanup" ] },
		{ name: "paragraph", groups: [ "list", "indent", "blocks", "align", "bidi", "paragraph" ] },
		{ name: "links", groups: [ "links" ] },
		{ name: "insert", groups: [ "insert" ] },
        { name: 'alignment', groups : [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight' ] },
		{ name: "styles", groups: [ "styles" ] },
		{ name: "colors", groups: [ "colors" ] },
		{ name: "tools", groups: [ "tools" ] },
		{ name: "others", groups: [ "others" ] },
		{ name: "about", groups: [ "about" ] }
	];

    // Remove automatic insertion of &nbsp; instead of space in text
    config.fillEmptyBlocks = false;

    // Custom format names
    config.format_Normal = { element: "p", name: "Normal" };
    config.format_Big_Heading = { element: "h1", name: "Big Heading" };
    config.format_Small_Heading = { element: "h2", name: "Small Heading" };
    config.format_tags = "Big_Heading;Small_Heading;Normal";

	config.removeButtons = "Cut,Copy,Paste,Undo,Redo,Anchor,About,Outdent,Indent,Strike,Subscript,Superscript,Link,Unlink";
    config.removePlugins = "resize";

//    CKEDITOR.editorConfig = function(config) {
//        config.allowedContent = true;
//    }

    config.allowedContent = 'span h1 h2 b p i u ul ol li div br[*]{*}(*);';

    config.extraAllowedContent = 'span[*]{*};';
};

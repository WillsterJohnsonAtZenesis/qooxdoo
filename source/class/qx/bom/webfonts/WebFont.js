/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

/**
 * Requests web fonts from {@link qx.bom.webfonts.Manager} and fires events
 * when their loading status is known.
 */
qx.Class.define("qx.bom.webfonts.WebFont", {
  extend: qx.bom.Font,

  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events: {
    /**
     * Fired when the status of a web font has been determined. The event data
     * is a map with the keys "family" (the font-family name) and "valid"
     * (Boolean).
     */
    changeStatus: "qx.event.type.Data"
  },

  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties: {
    /**
     * The fontFaces which need to be defined
     */
    fontFaces: {
      nullable: true,
      apply: "_applyFontFaces"
    },

    /** CSS urls or paths which need to be loaded */
    css: {
      nullable: true,
      check: "Array"
    },

    /**
     * Indicates that the font has loaded successfully
     */
    valid: {
      init: false,
      check: "Boolean",
      event: "changeValid"
    }
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members: {
    __families: null,

    // property apply
    _applyFontFaces(fontFaces, old) {
      var families = [];

      for (var i = 0, l = fontFaces.length; i < l; i++) {
        let fontFace = fontFaces[i];
        var familyName = this._quoteFontFamily(fontFace.family);
        if (families.indexOf(familyName) < 0) {
          families.push(familyName);
        }
        fontFace.comparisonString = this.getComparisonString();
        fontFace.version = this.getVersion();
        qx.bom.webfonts.Manager.getInstance().require(
          familyName,
          fontFace,
          this._onWebFontChangeStatus,
          this
        );
      }

      this.getFamily().forEach(familyName => {
        if (families.indexOf(familyName) < 0) {
          families.unshift(familyName);
        }
      });
      this.setFamily(families);
    },

    /**
     * Propagates web font status changes
     *
     * @param ev {qx.event.type.Data} "changeStatus"
     */
    _onWebFontChangeStatus(ev) {
      var result = ev.getData();
      this.setValid(!!result.valid);
      this.fireDataEvent("changeStatus", result);
      if (qx.core.Environment.get("qx.debug")) {
        if (result.valid === false) {
          this.warn(
            "WebFont " +
              result.family +
              " was not applied, perhaps the source file could not be loaded."
          );
        }
      }
    },

    /**
     * Makes sure font-family names containing spaces are properly quoted
     *
     * @param familyName {String} A font-family CSS value
     * @return {String} The quoted family name
     */
    _quoteFontFamily(familyName) {
      return familyName.replace(/["']/g, "");
    }
  },

  statics: {
    __loadedStylesheets: {},

    __loadStylesheet(url) {
      if (qx.bom.webfonts.WebFont.__loadedStylesheets[url]) {
        return;
      }
    },

    __addFontFace(url) {}
  }
});

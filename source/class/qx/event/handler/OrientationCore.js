/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     MIT: https://opensource.org/licenses/MIT
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)
     * Daniel Wagner (danielwagner)

   ======================================================================

   This class contains code based on the following work:

   * Unify Project

     Homepage:
       http://unify-project.org

     Copyright:
       2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

************************************************************************ */

/**
 * Listens for native orientation change events
 *
 * NOTE: Instances of this class must be disposed of after use
 *
 */
qx.Bootstrap.define("qx.event.handler.OrientationCore", {
  extend: Object,
  implement: [qx.core.IDisposable],

  /**
   *
   * @param targetWindow {Window} DOM window object
   * @param emitter {qx.event.Emitter} Event emitter object
   */
  construct(targetWindow, emitter) {
    this._window = targetWindow || window;
    this.__emitter = emitter;
    this._initObserver();
  },

  members: {
    __emitter: null,
    _window: null,
    _currentOrientation: null,
    __onNativeWrapper: null,
    __nativeEventType: null,

    /*
    ---------------------------------------------------------------------------
      OBSERVER INIT
    ---------------------------------------------------------------------------
    */

    /**
     * Initializes the native orientation change event listeners.
     */
    _initObserver() {
      this.__onNativeWrapper = qx.lang.Function.listener(this._onNative, this);

      // Handle orientation change event for Android devices by the resize event.
      // See http://stackoverflow.com/questions/1649086/detect-rotation-of-android-phone-in-the-browser-with-javascript
      // for more information.
      this.__nativeEventType = qx.bom.Event.supportsEvent(
        this._window,
        "orientationchange"
      )
        ? "orientationchange"
        : "resize";

      qx.bom.Event.addNativeListener(
        this._window,
        this.__nativeEventType,
        this.__onNativeWrapper
      );
    },

    /*
    ---------------------------------------------------------------------------
      OBSERVER STOP
    ---------------------------------------------------------------------------
    */

    /**
     * Disconnects the native orientation change event listeners.
     */
    _stopObserver() {
      qx.bom.Event.removeNativeListener(
        this._window,
        this.__nativeEventType,
        this.__onNativeWrapper
      );
    },

    /*
    ---------------------------------------------------------------------------
      NATIVE EVENT OBSERVERS
    ---------------------------------------------------------------------------
    */

    /**
     * Handler for the native orientation change event.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} The touch event from the browser.
     */
    _onNative(domEvent) {
      var orientation = qx.bom.Viewport.getOrientation();

      if (this._currentOrientation != orientation) {
        this._currentOrientation = orientation;
        var mode = qx.bom.Viewport.isLandscape() ? "landscape" : "portrait";

        domEvent._orientation = orientation;
        domEvent._mode = mode;

        if (this.__emitter) {
          this.__emitter.emit("orientationchange", domEvent);
        }
      }
    },

    // ------------------------------------------------------------------------
    /**
     * no-op implementation.
     */
    dispose() {}
  },

  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct() {
    this._stopObserver();
    this.__manager = this.__emitter = null;
  }
});

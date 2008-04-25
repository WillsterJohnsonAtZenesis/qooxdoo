/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

qx.Class.define("demobrowser.demo.layout.LayoutApplication",
{
  extend : qx.application.Standalone,

  members :
  {
    main : function()
    {
      this.base(arguments);

      var frame = new qx.ui.container.Composite(new qx.ui.layout.Dock());

      var root = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
      root.addMain = function(child, stretch) {
        root.add(child, stretch ? {left:0, top:0, right:0, bottom:0} : {left:0, top:0});
      }

      editor = new demobrowser.demo.layout.PropertyEditor(root);
      root.addListener("click", this._onClickRoot, this);

      frame.add(editor, {edge: "east"});
      frame.add(root);

      this._root = root;
      this._editor = editor;

      qx.application.Standalone.prototype.getRoot.call(this).addMain(frame, true);
    },


    getRoot : function() {
      return this._root;
    },


    _onClickRoot : function(e)
    {
      if (e.getTarget() !== this._root) {
        this._editor.handleWidgetClick(e);
      }
    }
  }

})
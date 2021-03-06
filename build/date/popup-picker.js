/*
Copyright 2013, KISSY v1.50dev
MIT Licensed
build time: Nov 27 00:39
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 date/popup-picker/render-xtpl
 date/popup-picker
*/

KISSY.add("date/popup-picker/render-xtpl", ["date/picker/picker-xtpl"], function(S, require, exports, module) {
  return function(scopes, S, undefined) {
    var buffer = "", config = this.config, engine = this, moduleWrap, utils = config.utils;
    if(typeof module != "undefined" && module.kissy) {
      moduleWrap = module
    }
    var runBlockCommandUtil = utils["runBlockCommand"], getExpressionUtil = utils["getExpression"], getPropertyOrRunCommandUtil = utils["getPropertyOrRunCommand"];
    buffer += '<div class="';
    var config1 = {};
    var params2 = [];
    params2.push("content");
    config1.params = params2;
    var id0 = getPropertyOrRunCommandUtil(engine, scopes, config1, "getBaseCssClasses", 0, 1, true, undefined);
    buffer += id0;
    buffer += '">\n    ';
    var config4 = {};
    var params5 = [];
    params5.push("date/picker/picker-xtpl");
    config4.params = params5;
    if(moduleWrap) {
      require("date/picker/picker-xtpl");
      config4.params[0] = moduleWrap.resolveByName(config4.params[0])
    }
    var id3 = getPropertyOrRunCommandUtil(engine, scopes, config4, "include", 0, 2, false, undefined);
    buffer += id3;
    buffer += "\n</div>";
    return buffer
  }
});
KISSY.add("date/popup-picker", ["./popup-picker/render-xtpl", "date/picker", "component/extension/shim", "component/extension/align"], function(S, require) {
  var PopupPickerTpl = require("./popup-picker/render-xtpl"), DatePicker = require("date/picker"), Shim = require("component/extension/shim"), AlignExtension = require("component/extension/align");
  var PopupDatePickerRender = DatePicker.getDefaultRender().extend({}, {ATTRS:{contentTpl:{value:PopupPickerTpl}}});
  return DatePicker.extend([Shim, AlignExtension], {}, {xclass:"popup-date-picker", ATTRS:{xrender:{value:PopupDatePickerRender}}})
});


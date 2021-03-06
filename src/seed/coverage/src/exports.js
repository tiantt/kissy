function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/exports.js']) {
  _$jscoverage['/exports.js'] = {};
  _$jscoverage['/exports.js'].lineData = [];
  _$jscoverage['/exports.js'].lineData[6] = 0;
  _$jscoverage['/exports.js'].lineData[7] = 0;
  _$jscoverage['/exports.js'].lineData[8] = 0;
  _$jscoverage['/exports.js'].lineData[11] = 0;
  _$jscoverage['/exports.js'].lineData[12] = 0;
  _$jscoverage['/exports.js'].lineData[15] = 0;
  _$jscoverage['/exports.js'].lineData[16] = 0;
  _$jscoverage['/exports.js'].lineData[19] = 0;
  _$jscoverage['/exports.js'].lineData[25] = 0;
  _$jscoverage['/exports.js'].lineData[26] = 0;
  _$jscoverage['/exports.js'].lineData[29] = 0;
  _$jscoverage['/exports.js'].lineData[30] = 0;
  _$jscoverage['/exports.js'].lineData[31] = 0;
  _$jscoverage['/exports.js'].lineData[34] = 0;
  _$jscoverage['/exports.js'].lineData[35] = 0;
  _$jscoverage['/exports.js'].lineData[39] = 0;
  _$jscoverage['/exports.js'].lineData[43] = 0;
  _$jscoverage['/exports.js'].lineData[44] = 0;
  _$jscoverage['/exports.js'].lineData[45] = 0;
  _$jscoverage['/exports.js'].lineData[47] = 0;
  _$jscoverage['/exports.js'].lineData[49] = 0;
  _$jscoverage['/exports.js'].lineData[50] = 0;
  _$jscoverage['/exports.js'].lineData[52] = 0;
  _$jscoverage['/exports.js'].lineData[56] = 0;
  _$jscoverage['/exports.js'].lineData[60] = 0;
  _$jscoverage['/exports.js'].lineData[65] = 0;
  _$jscoverage['/exports.js'].lineData[66] = 0;
  _$jscoverage['/exports.js'].lineData[67] = 0;
}
if (! _$jscoverage['/exports.js'].functionData) {
  _$jscoverage['/exports.js'].functionData = [];
  _$jscoverage['/exports.js'].functionData[0] = 0;
  _$jscoverage['/exports.js'].functionData[1] = 0;
  _$jscoverage['/exports.js'].functionData[2] = 0;
  _$jscoverage['/exports.js'].functionData[3] = 0;
  _$jscoverage['/exports.js'].functionData[4] = 0;
  _$jscoverage['/exports.js'].functionData[5] = 0;
  _$jscoverage['/exports.js'].functionData[6] = 0;
}
if (! _$jscoverage['/exports.js'].branchData) {
  _$jscoverage['/exports.js'].branchData = {};
  _$jscoverage['/exports.js'].branchData['22'] = [];
  _$jscoverage['/exports.js'].branchData['22'][1] = new BranchData();
  _$jscoverage['/exports.js'].branchData['22'][2] = new BranchData();
  _$jscoverage['/exports.js'].branchData['25'] = [];
  _$jscoverage['/exports.js'].branchData['25'][1] = new BranchData();
  _$jscoverage['/exports.js'].branchData['29'] = [];
  _$jscoverage['/exports.js'].branchData['29'][1] = new BranchData();
  _$jscoverage['/exports.js'].branchData['44'] = [];
  _$jscoverage['/exports.js'].branchData['44'][1] = new BranchData();
  _$jscoverage['/exports.js'].branchData['47'] = [];
  _$jscoverage['/exports.js'].branchData['47'][1] = new BranchData();
  _$jscoverage['/exports.js'].branchData['50'] = [];
  _$jscoverage['/exports.js'].branchData['50'][1] = new BranchData();
  _$jscoverage['/exports.js'].branchData['52'] = [];
  _$jscoverage['/exports.js'].branchData['52'][1] = new BranchData();
  _$jscoverage['/exports.js'].branchData['65'] = [];
  _$jscoverage['/exports.js'].branchData['65'][1] = new BranchData();
}
_$jscoverage['/exports.js'].branchData['65'][1].init(1708, 11, 'S.UA.nodejs');
function visit9_65_1(result) {
  _$jscoverage['/exports.js'].branchData['65'][1].ranCondition(result);
  return result;
}_$jscoverage['/exports.js'].branchData['52'][1].init(59, 177, 'INVALID_CHARS_REG.test(data.replace(INVALID_ESCAPES_REG, "@").replace(INVALID_TOKENS_REG, "]").replace(INVALID_BRACES_REG, ""))');
function visit8_52_1(result) {
  _$jscoverage['/exports.js'].branchData['52'][1].ranCondition(result);
  return result;
}_$jscoverage['/exports.js'].branchData['50'][1].init(84, 4, 'data');
function visit7_50_1(result) {
  _$jscoverage['/exports.js'].branchData['50'][1].ranCondition(result);
  return result;
}_$jscoverage['/exports.js'].branchData['47'][1].init(93, 24, 'typeof data === "string"');
function visit6_47_1(result) {
  _$jscoverage['/exports.js'].branchData['47'][1].ranCondition(result);
  return result;
}_$jscoverage['/exports.js'].branchData['44'][1].init(17, 13, 'data === null');
function visit5_44_1(result) {
  _$jscoverage['/exports.js'].branchData['44'][1].ranCondition(result);
  return result;
}_$jscoverage['/exports.js'].branchData['29'][1].init(444, 10, 'nativeJson');
function visit4_29_1(result) {
  _$jscoverage['/exports.js'].branchData['29'][1].ranCondition(result);
  return result;
}_$jscoverage['/exports.js'].branchData['25'][1].init(385, 13, 'UA.ieMode < 9');
function visit3_25_1(result) {
  _$jscoverage['/exports.js'].branchData['25'][1].ranCondition(result);
  return result;
}_$jscoverage['/exports.js'].branchData['22'][2].init(95, 26, 'typeof global === \'object\'');
function visit2_22_2(result) {
  _$jscoverage['/exports.js'].branchData['22'][2].ranCondition(result);
  return result;
}_$jscoverage['/exports.js'].branchData['22'][1].init(82, 39, 'UA.nodejs && typeof global === \'object\'');
function visit1_22_1(result) {
  _$jscoverage['/exports.js'].branchData['22'][1].ranCondition(result);
  return result;
}_$jscoverage['/exports.js'].lineData[6]++;
(function(S) {
  _$jscoverage['/exports.js'].functionData[0]++;
  _$jscoverage['/exports.js'].lineData[7]++;
  S.add('ua', function() {
  _$jscoverage['/exports.js'].functionData[1]++;
  _$jscoverage['/exports.js'].lineData[8]++;
  return S.UA;
});
  _$jscoverage['/exports.js'].lineData[11]++;
  S.add('uri', function() {
  _$jscoverage['/exports.js'].functionData[2]++;
  _$jscoverage['/exports.js'].lineData[12]++;
  return S.Uri;
});
  _$jscoverage['/exports.js'].lineData[15]++;
  S.add('path', function() {
  _$jscoverage['/exports.js'].functionData[3]++;
  _$jscoverage['/exports.js'].lineData[16]++;
  return S.Path;
});
  _$jscoverage['/exports.js'].lineData[19]++;
  var UA = S.UA, Env = S.Env, win = Env.host, nativeJson = ((visit1_22_1(UA.nodejs && visit2_22_2(typeof global === 'object'))) ? global : win).JSON;
  _$jscoverage['/exports.js'].lineData[25]++;
  if (visit3_25_1(UA.ieMode < 9)) {
    _$jscoverage['/exports.js'].lineData[26]++;
    nativeJson = null;
  }
  _$jscoverage['/exports.js'].lineData[29]++;
  if (visit4_29_1(nativeJson)) {
    _$jscoverage['/exports.js'].lineData[30]++;
    S.add('json', function() {
  _$jscoverage['/exports.js'].functionData[4]++;
  _$jscoverage['/exports.js'].lineData[31]++;
  return S.JSON = nativeJson;
});
    _$jscoverage['/exports.js'].lineData[34]++;
    S.parseJson = function(data) {
  _$jscoverage['/exports.js'].functionData[5]++;
  _$jscoverage['/exports.js'].lineData[35]++;
  return nativeJson.parse(data);
};
  } else {
    _$jscoverage['/exports.js'].lineData[39]++;
    var INVALID_CHARS_REG = /^[\],:{}\s]*$/, INVALID_BRACES_REG = /(?:^|:|,)(?:\s*\[)+/g, INVALID_ESCAPES_REG = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, INVALID_TOKENS_REG = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
    _$jscoverage['/exports.js'].lineData[43]++;
    S.parseJson = function(data) {
  _$jscoverage['/exports.js'].functionData[6]++;
  _$jscoverage['/exports.js'].lineData[44]++;
  if (visit5_44_1(data === null)) {
    _$jscoverage['/exports.js'].lineData[45]++;
    return data;
  }
  _$jscoverage['/exports.js'].lineData[47]++;
  if (visit6_47_1(typeof data === "string")) {
    _$jscoverage['/exports.js'].lineData[49]++;
    data = S.trim(data);
    _$jscoverage['/exports.js'].lineData[50]++;
    if (visit7_50_1(data)) {
      _$jscoverage['/exports.js'].lineData[52]++;
      if (visit8_52_1(INVALID_CHARS_REG.test(data.replace(INVALID_ESCAPES_REG, "@").replace(INVALID_TOKENS_REG, "]").replace(INVALID_BRACES_REG, "")))) {
        _$jscoverage['/exports.js'].lineData[56]++;
        return (new Function("return " + data))();
      }
    }
  }
  _$jscoverage['/exports.js'].lineData[60]++;
  return S.error("Invalid Json: " + data);
};
  }
  _$jscoverage['/exports.js'].lineData[65]++;
  if (visit9_65_1(S.UA.nodejs)) {
    _$jscoverage['/exports.js'].lineData[66]++;
    S.KISSY = S;
    _$jscoverage['/exports.js'].lineData[67]++;
    module.exports = S;
  }
})(KISSY);

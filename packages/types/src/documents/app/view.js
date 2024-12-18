"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewCalculation = exports.ViewV2Type = exports.CalculationType = void 0;
var CalculationType;
(function (CalculationType) {
    CalculationType["SUM"] = "sum";
    CalculationType["AVG"] = "avg";
    CalculationType["COUNT"] = "count";
    CalculationType["MIN"] = "min";
    CalculationType["MAX"] = "max";
})(CalculationType || (exports.CalculationType = CalculationType = {}));
var ViewV2Type;
(function (ViewV2Type) {
    ViewV2Type["CALCULATION"] = "calculation";
})(ViewV2Type || (exports.ViewV2Type = ViewV2Type = {}));
var ViewCalculation;
(function (ViewCalculation) {
    ViewCalculation["SUM"] = "sum";
    ViewCalculation["COUNT"] = "count";
    ViewCalculation["STATISTICS"] = "stats";
})(ViewCalculation || (exports.ViewCalculation = ViewCalculation = {}));

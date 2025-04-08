"use strict";

var _react = require("@testing-library/react");
var _Registration = _interopRequireDefault(require("./Registration"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
test("bouton désactivé si champs invalides", function () {
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_Registration["default"], {
    onRegister: function onRegister() {}
  }));
  var button = _react.screen.getByRole("button");
  expect(button).toBeDisabled();
});
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var UserList = function UserList(_ref) {
  var users = _ref.users;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
      children: "Liste des inscrits"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("ul", {
      children: users.map(function (u, i) {
        return /*#__PURE__*/(0, _jsxRuntime.jsxs)("li", {
          children: [u.prenom, " ", u.nom, " \u2013 ", u.ville, " (", u.codePostal, ")"]
        }, i);
      })
    })]
  });
};
var _default = exports["default"] = UserList;
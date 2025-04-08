"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidPostalCode = exports.isValidName = exports.isValidEmail = exports.isOver18 = exports.calculateAge = void 0;
var isValidName = exports.isValidName = function isValidName(str) {
  var regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\-\'\s]+$/;
  return regex.test(str);
};
var isValidEmail = exports.isValidEmail = function isValidEmail(email) {
  var regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
};
var isValidPostalCode = exports.isValidPostalCode = function isValidPostalCode(code) {
  return /^\d{5}$/.test(code);
};
var calculateAge = exports.calculateAge = function calculateAge(birthDate) {
  var today = new Date();
  var dob = new Date(birthDate);
  var age = today.getFullYear() - dob.getFullYear();
  var m = today.getMonth() - dob.getMonth();
  if (m < 0 || m === 0 && today.getDate() < dob.getDate()) age--;
  return age;
};
var isOver18 = exports.isOver18 = function isOver18(birthDate) {
  return calculateAge(birthDate) >= 18;
};
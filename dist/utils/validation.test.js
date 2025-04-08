"use strict";

var _validation = require("../utils/validation");
test("calcul de l'âge", function () {
  expect((0, _validation.calculateAge)("2000-01-01")).toBeGreaterThanOrEqual(24);
});
test("âge > 18", function () {
  expect((0, _validation.isOver18)("2010-01-01")).toBe(false);
  expect((0, _validation.isOver18)("2000-01-01")).toBe(true);
});
test("code postal", function () {
  expect((0, _validation.isValidPostalCode)("75001")).toBe(true);
  expect((0, _validation.isValidPostalCode)("ABCDE")).toBe(false);
});
test("nom/prénom/ville", function () {
  expect((0, _validation.isValidName)("Jean-Luc")).toBe(true);
  expect((0, _validation.isValidName)("O'Neill")).toBe(true);
  expect((0, _validation.isValidName)("1234")).toBe(false);
});
test("email", function () {
  expect((0, _validation.isValidEmail)("test@mail.com")).toBe(true);
  expect((0, _validation.isValidEmail)("fail@")).toBe(false);
});
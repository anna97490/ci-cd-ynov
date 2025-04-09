import {
  isValidName,
  isValidEmail,
  isValidPostalCode,
  isOver18,
  calculateAge,
} from "../utils/validation";

test("calcule l'âge correctement quand la date anniversaire est passée", () => {
  const today = new Date();
  const birth = new Date(today.getFullYear() - 20, today.getMonth() - 1, today.getDate());
  expect(calculateAge(birth.toISOString())).toBe(20);
});

test("calcule l'âge correctement quand la date anniversaire est aujourd'hui", () => {
  const today = new Date();
  const birth = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  expect(calculateAge(birth.toISOString())).toBe(18);
});

test("calcule l'âge correctement quand l'anniversaire n'est pas encore passé cette année", () => {
  const today = new Date();
  const birth = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 1);
  expect(calculateAge(birth.toISOString())).toBe(17);
});

test("âge > 18", () => {
  expect(isOver18("2010-01-01")).toBe(false);
  expect(isOver18("2000-01-01")).toBe(true);
});

test("code postal", () => {
  expect(isValidPostalCode("75001")).toBe(true);
  expect(isValidPostalCode("ABCDE")).toBe(false);
});

test("nom/prénom/ville", () => {
  expect(isValidName("Jean-Luc")).toBe(true);
  expect(isValidName("O'Neill")).toBe(true);
  expect(isValidName("1234")).toBe(false);
});

test("email", () => {
  expect(isValidEmail("test@mail.com")).toBe(true);
  expect(isValidEmail("fail@")).toBe(false);
});

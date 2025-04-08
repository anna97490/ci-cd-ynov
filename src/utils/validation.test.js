import {
  isValidName,
  isValidEmail,
  isValidPostalCode,
  isOver18,
  calculateAge,
} from "../utils/validation";

test("calcul de l'âge", () => {
  expect(calculateAge("2000-01-01")).toBeGreaterThanOrEqual(24);
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

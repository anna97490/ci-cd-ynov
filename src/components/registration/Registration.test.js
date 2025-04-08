import { render, screen, fireEvent } from "@testing-library/react";
import Registration from "./Registration";

test("bouton désactivé si champs invalides", () => {
  render(<Registration onRegister={() => {}} />);
  const button = screen.getByRole("button");
  expect(button).toBeDisabled();
});

import { render, screen, fireEvent } from "@testing-library/react";
import Registration from "./Registration";
import { toast } from "react-toastify";

// Mock de la fonction toast pour éviter les effets de bord
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

describe("Registration", () => {
  const fillValidForm = () => {
    fireEvent.change(screen.getByPlaceholderText("nom"), { target: { value: "Dupont" } });
    fireEvent.change(screen.getByPlaceholderText("prenom"), { target: { value: "Jean" } });
    fireEvent.change(screen.getByPlaceholderText("email"), { target: { value: "jean@exemple.com" } });
    fireEvent.change(screen.getByPlaceholderText("dateNaissance"), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByPlaceholderText("ville"), { target: { value: "Paris" } });
    fireEvent.change(screen.getByPlaceholderText("codePostal"), { target: { value: "75001" } });
  };

  test("bouton désactivé si champs invalides", () => {
    render(<Registration onRegister={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  test("bouton activé si tous les champs sont valides", () => {
    render(<Registration onRegister={() => {}} />);
    fillValidForm();
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });

  test("affiche les erreurs de validation si champs invalides", () => {
    render(<Registration onRegister={() => {}} />);

    // Champs partiellement ou incorrectement remplis
    fireEvent.change(screen.getByPlaceholderText("nom"), { target: { value: "12234" } });
    fireEvent.change(screen.getByPlaceholderText("prenom"), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText("email"), { target: { value: "invalidemail" } });
    fireEvent.change(screen.getByPlaceholderText("dateNaissance"), { target: { value: "2010-01-01" } });
    fireEvent.change(screen.getByPlaceholderText("ville"), { target: { value: "1234" } });
    fireEvent.change(screen.getByPlaceholderText("codePostal"), { target: { value: "abcde" } });

    // Utiliser data-testid pour soumettre le formulaire
    fireEvent.submit(screen.getByTestId("registration-form"));

    // Vérifie les messages d'erreur
    expect(screen.getByText("Email invalide")).toBeInTheDocument();
    expect(screen.getByText("Âge < 18")).toBeInTheDocument();
    expect(screen.getByText("Code postal invalide")).toBeInTheDocument();
  });

  test("appel de onRegister avec les bonnes données si valide", () => {
    const onRegisterMock = jest.fn();
    render(<Registration onRegister={onRegisterMock} />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button"));
    expect(onRegisterMock).toHaveBeenCalledWith({
      nom: "Dupont",
      prenom: "Jean",
      email: "jean@exemple.com",
      dateNaissance: "1990-01-01",
      ville: "Paris",
      codePostal: "75001",
    });
  });

  test("toast s'affiche après succès d'inscription", () => {
    render(<Registration onRegister={() => {}} />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button"));
    expect(toast.success).toHaveBeenCalledWith("Inscription réussie !");
  });
});

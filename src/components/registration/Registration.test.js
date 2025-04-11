import { render, screen, fireEvent } from "@testing-library/react";
import Registration from "./Registration";
import { toast } from "react-toastify";

// Mock des toasts pour éviter les effets de bord
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

beforeEach(() => {
  localStorage.clear();
  toast.success.mockClear();
  toast.error.mockClear();
});

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
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("bouton activé si tous les champs sont valides", () => {
    render(<Registration onRegister={() => {}} />);
    fillValidForm();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  test("affiche les erreurs spécifiques pour champs invalides", () => {
    render(<Registration onRegister={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText("nom"), { target: { value: "123" } });
    fireEvent.blur(screen.getByPlaceholderText("nom"));

    fireEvent.change(screen.getByPlaceholderText("prenom"), { target: { value: "456" } });
    fireEvent.blur(screen.getByPlaceholderText("prenom"));

    fireEvent.change(screen.getByPlaceholderText("email"), { target: { value: "invalid" } });
    fireEvent.blur(screen.getByPlaceholderText("email"));

    fireEvent.change(screen.getByPlaceholderText("dateNaissance"), { target: { value: "2015-01-01" } });
    fireEvent.blur(screen.getByPlaceholderText("dateNaissance"));

    fireEvent.change(screen.getByPlaceholderText("ville"), { target: { value: "789" } });
    fireEvent.blur(screen.getByPlaceholderText("ville"));

    fireEvent.change(screen.getByPlaceholderText("codePostal"), { target: { value: "abc" } });
    fireEvent.blur(screen.getByPlaceholderText("codePostal"));

    fireEvent.submit(screen.getByTestId("registration-form"));

    expect(screen.getByText("Le nom ne doit contenir que des lettres.")).toBeInTheDocument();
    expect(screen.getByText("Le prénom ne doit contenir que des lettres.")).toBeInTheDocument();
    expect(screen.getByText("L'adresse email n'est pas valide.")).toBeInTheDocument();
    expect(screen.getByText("Vous devez avoir au moins 18 ans.")).toBeInTheDocument();
    expect(screen.getByText("Le nom de la ville ne doit contenir que des lettres.")).toBeInTheDocument();
    expect(screen.getByText("Le code postal doit comporter 5 chiffres.")).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Veuillez corriger les erreurs dans le formulaire.");
  });

  test("affiche les erreurs 'requis' si tout est vide", () => {
    render(<Registration onRegister={() => {}} />);

    ["nom", "prenom", "email", "dateNaissance", "ville", "codePostal"].forEach((field) =>
      fireEvent.blur(screen.getByPlaceholderText(field))
    );

    fireEvent.submit(screen.getByTestId("registration-form"));

    expect(screen.getByText("Le nom est requis.")).toBeInTheDocument();
    expect(screen.getByText("Le prénom est requis.")).toBeInTheDocument();
    expect(screen.getByText("L'email est requis.")).toBeInTheDocument();
    expect(screen.getByText("La date de naissance est requise.")).toBeInTheDocument();
    expect(screen.getByText("La ville est requise.")).toBeInTheDocument();
    expect(screen.getByText("Le code postal est requis.")).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Veuillez corriger les erreurs dans le formulaire.");
  });

  test("onRegister est appelé avec les bonnes données si tout est valide", () => {
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

  test("toast.success est appelé après une inscription valide", () => {
    render(<Registration onRegister={() => {}} />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button"));
    expect(toast.success).toHaveBeenCalledWith("Inscription réussie !");
  });

  test("empêche l'inscription avec un email déjà utilisé", () => {
    localStorage.setItem(
      "users",
      JSON.stringify([
        {
          nom: "Dupont",
          prenom: "Jean",
          email: "jean@exemple.com",
          dateNaissance: "1990-01-01",
          ville: "Paris",
          codePostal: "75001",
        },
      ])
    );

    render(<Registration onRegister={() => {}} />);
    fillValidForm();
    fireEvent.blur(screen.getByPlaceholderText("email"));
    fireEvent.submit(screen.getByTestId("registration-form"));

    expect(screen.getByText("Cet email est déjà utilisé.")).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Veuillez corriger les erreurs dans le formulaire.");
  });
});

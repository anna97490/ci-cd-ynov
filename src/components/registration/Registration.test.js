import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Registration from "./Registration";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import * as service from "./registrationService";
import { MemoryRouter } from "react-router-dom";

jest.spyOn(service, "registerUser").mockResolvedValueOnce({});

// Mock Toast
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

// Mock navigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Registration Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("affiche les erreurs de validation si le formulaire est vide", async () => {
    render(<Registration />, { wrapper: MemoryRouter });

    const fields = ["nom", "prenom", "email", "password", "dateNaissance", "ville", "codePostal"];
    for (const field of fields) {
      fireEvent.blur(screen.getByPlaceholderText(field));
    }

    fireEvent.submit(screen.getByTestId("registration-form"));

    expect(await screen.findByText("Le nom est requis.")).toBeInTheDocument();
    expect(screen.getByText("Le prénom est requis.")).toBeInTheDocument();
    expect(screen.getByText("L'email est requis.")).toBeInTheDocument();
    expect(screen.getByText("Le mot de passe est requis.")).toBeInTheDocument();
    expect(screen.getByText("La date de naissance est requise.")).toBeInTheDocument();
    expect(screen.getByText("La ville est requise.")).toBeInTheDocument();
    expect(screen.getByText("Le code postal est requis.")).toBeInTheDocument();

    expect(toast.error).toHaveBeenCalledWith("Veuillez corriger les erreurs dans le formulaire.");
  });

  test("soumet le formulaire avec succès", async () => {
    jest.useFakeTimers(); 
    jest.spyOn(service, "registerUser").mockResolvedValueOnce({});

    render(<Registration />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("nom"), { target: { value: "Dupont" } });
    fireEvent.change(screen.getByPlaceholderText("prenom"), { target: { value: "Jean" } });
    fireEvent.change(screen.getByPlaceholderText("email"), { target: { value: "jean@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("password"), { target: { value: "Test123" } });
    fireEvent.change(screen.getByPlaceholderText("dateNaissance"), { target: { value: "2000-01-01" } });
    fireEvent.change(screen.getByPlaceholderText("ville"), { target: { value: "Paris" } });
    fireEvent.change(screen.getByPlaceholderText("codePostal"), { target: { value: "75000" } });

    fireEvent.submit(screen.getByTestId("registration-form"));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Inscription réussie ! Redirection vers la page de connexion...")
    );

    expect(service.registerUser).toHaveBeenCalledWith({
      nom: "Dupont",
      prenom: "Jean",
      email: "jean@example.com",
      password: "Test123",
      dateNaissance: "2000-01-01",
      ville: "Paris",
      codePostal: "75000",
    });

    jest.runAllTimers();

    expect(mockedNavigate).toHaveBeenCalledWith("/login");

    jest.useRealTimers();
  });

  test("affiche un message d'erreur si l'inscription échoue", async () => {
    jest.spyOn(service, "registerUser").mockRejectedValueOnce(new Error("Erreur serveur"));

    render(<Registration />, { wrapper: BrowserRouter });

    fireEvent.change(screen.getByPlaceholderText("nom"), { target: { value: "Dupont" } });
    fireEvent.change(screen.getByPlaceholderText("prenom"), { target: { value: "Jean" } });
    fireEvent.change(screen.getByPlaceholderText("email"), { target: { value: "jean@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("password"), { target: { value: "Test123" } });
    fireEvent.change(screen.getByPlaceholderText("dateNaissance"), { target: { value: "2000-01-01" } });
    fireEvent.change(screen.getByPlaceholderText("ville"), { target: { value: "Paris" } });
    fireEvent.change(screen.getByPlaceholderText("codePostal"), { target: { value: "75000" } });

    fireEvent.submit(screen.getByTestId("registration-form"));

    await waitFor(() => {
      expect(service.registerUser).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith("Erreur serveur");
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  test("affiche un message d'erreur générique si la réponse n'est pas un JSON valide", async () => {
    jest.spyOn(service, "registerUser").mockImplementationOnce(() =>
      Promise.reject(new Error("Erreur réseau"))
    );

    render(<Registration />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("nom"), { target: { value: "Dupont" } });
    fireEvent.change(screen.getByPlaceholderText("prenom"), { target: { value: "Jean" } });
    fireEvent.change(screen.getByPlaceholderText("email"), { target: { value: "jean@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("password"), { target: { value: "Test123" } });
    fireEvent.change(screen.getByPlaceholderText("dateNaissance"), { target: { value: "2000-01-01" } });
    fireEvent.change(screen.getByPlaceholderText("ville"), { target: { value: "Paris" } });
    fireEvent.change(screen.getByPlaceholderText("codePostal"), { target: { value: "75000" } });

    fireEvent.submit(screen.getByTestId("registration-form"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erreur réseau");
    });
  });
  
   test("retourne les données si l'inscription est réussie", async () => {
    const fakeResponse = { message: "Inscription réussie" };

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse,
    });

    const { registerUser } = await import("./registrationService");

    const result = await registerUser({
      nom: "Test",
      prenom: "User",
      email: "test@example.com",
      password: "Pass1234",
      dateNaissance: "1990-01-01",
      ville: "Paris",
      codePostal: "75000",
    });

    
  });
});

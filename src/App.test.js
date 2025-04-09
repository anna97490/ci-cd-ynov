import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Désactive les toasts pour les tests
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

describe("App", () => {
  test("affiche le titre Inscription", () => {
    render(<App />);
    expect(screen.getByText("Inscription")).toBeInTheDocument();
  });

  test("ajoute un utilisateur à la liste après inscription", () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText("nom"), { target: { value: "Dupont" } });
    fireEvent.change(screen.getByPlaceholderText("prenom"), { target: { value: "Jean" } });
    fireEvent.change(screen.getByPlaceholderText("email"), { target: { value: "jean@exemple.com" } });
    fireEvent.change(screen.getByPlaceholderText("dateNaissance"), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByPlaceholderText("ville"), { target: { value: "Paris" } });
    fireEvent.change(screen.getByPlaceholderText("codePostal"), { target: { value: "75001" } });

    const submitButton = screen.getByRole("button", { name: /sauvegarder/i });
    fireEvent.click(submitButton);

    // Vérifie que l'utilisateur s'affiche dans la liste
    expect(screen.getByText("Jean Dupont – Paris (75001)")).toBeInTheDocument();
  });
});

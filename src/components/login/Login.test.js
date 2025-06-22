import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { loginUser } from './loginService';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

jest.mock('./loginService', () => ({
  loginUser: jest.fn()
}));

global.fetch = jest.fn();
const mockLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  },
  ToastContainer: () => <div />,
}));

const renderComponent = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test('affiche les champs email et mot de passe', () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument();
  });

  test('affiche les erreurs de validation si le formulaire est vide', async () => {
    renderComponent();
    fireEvent.blur(screen.getByPlaceholderText(/email/i));
    fireEvent.blur(screen.getByPlaceholderText(/mot de passe/i));
    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Veuillez corriger les erreurs')
    );

    expect(await screen.findByText("L'email est requis.")).toBeInTheDocument();
    expect(await screen.findByText("Le mot de passe est requis.")).toBeInTheDocument();
  });

  test('affiche erreur email invalide', async () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'invalidemail', name: 'email' }
    });
    fireEvent.blur(screen.getByPlaceholderText(/email/i));

    await waitFor(() => {
      expect(screen.getByText(/adresse email invalide/i)).toBeInTheDocument();
    });
  });

  test('affiche erreur mot de passe faible', async () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), {
      target: { value: '123', name: 'password' }
    });
    fireEvent.blur(screen.getByPlaceholderText(/mot de passe/i));

    await waitFor(() => {
      expect(screen.getByText(/mot de passe trop faible/i)).toBeInTheDocument();
    });
  });

  test('soumet le formulaire avec des données valides', async () => {
    const fakeUser = { id: 1, email: 'admin@test.com', role: 'admin' };
    loginUser.mockResolvedValueOnce({
      user: fakeUser,
      token: 'fake-token'
    });

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'admin@test.com', name: 'email' }
    });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), {
      target: { value: 'Password123', name: 'password' }
    });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() =>
      expect(loginUser).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'Password123'
      })
    );

    expect(mockLogin).toHaveBeenCalledWith(fakeUser, 'fake-token');
    expect(toast.success).toHaveBeenCalledWith('Connexion réussie !');
    expect(mockNavigate).toHaveBeenCalledWith('/users');
  });

  test('affiche une erreur en cas de mauvais identifiants', async () => {
    loginUser.mockRejectedValueOnce(new Error('Identifiants incorrects'));

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'wrong@test.com', name: 'email' }
    });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), {
      target: { value: 'WrongPass123', name: 'password' }
    });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith('Identifiants incorrects');
  });

  test('le bouton est désactivé si le formulaire est invalide', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /se connecter/i });
    expect(button).toBeDisabled();
  });

  test('le bouton est activé si le formulaire est valide', async () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'admin@test.com', name: 'email' }
    });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), {
      target: { value: 'Password123', name: 'password' }
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /se connecter/i })).not.toBeDisabled();
    });
  });

  test('loginUser > retourne le token et user en cas de succès', async () => {
    const expectedResult = {
      token: 'token123',
      user: { id: 1, email: 'test@test.com' }
    };

    loginUser.mockResolvedValueOnce(expectedResult);

    const result = await loginUser({ email: 'test@test.com', password: 'abc' });

    expect(result).toEqual(expectedResult);
  });

  test('loginUser (réel) retourne un token et un user quand la réponse est valide', async () => {
    const fakeResponse = {
      access_token: 'realToken123',
      user: { id: 99, email: 'real@test.com' }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeResponse
    });

    // Appel direct de la vraie fonction sans mock
    const { loginUser: realLoginUser } = jest.requireActual('./loginService');

    const result = await realLoginUser({ email: 'real@test.com', password: 'Secure123!' });

    expect(result).toEqual({
      token: 'realToken123',
      user: { id: 99, email: 'real@test.com' }
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/login'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'real@test.com',
          password: 'Secure123!'
        })
      })
    );
  });

});

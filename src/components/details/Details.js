import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById, deleteUserById } from "./detailsService";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const { user } = useAuth(); // utilisateur connecté


  useEffect(() => {
    // Rediriger si l'utilisateur connecté n'est pas admin
    if (!user || user.role !== 'admin') {
      navigate("/users");
      return;
    }

    fetchUserById(id)
      .then(setUserDetails)
      .catch((err) => {
        console.error(err);
        alert("Erreur : " + err.message);
      });
  }, [id, user, navigate]);


  /**
  * Gère la suppression de l'utilisateur après confirmation.
  * - Affiche un toast de succès ou d'erreur.
  * - Redirige vers la liste des utilisateurs après suppression.
  */
  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      await deleteUserById(id);
      toast.success("Utilisateur supprimé avec succès !");
      setTimeout(() => {
        navigate("/users");
      }, 1000); // délai pour laisser le toast s'afficher
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Erreur lors de la suppression");
    }
  };

  if (!userDetails) return <p>Chargement...</p>;

  return (
    <div className="user-detail">
      <h2>Détails de l'utilisateur</h2>
      <p><strong>Nom :</strong> {userDetails.nom}</p>
      <p><strong>Prénom :</strong> {userDetails.prenom}</p>
      <p><strong>Email :</strong> {userDetails.email}</p>
      <p><strong>Ville :</strong> {userDetails.ville}</p>
      <p><strong>Code postal :</strong> {userDetails.codePostal}</p>
      <p><strong>Date de naissance :</strong> {userDetails.dateNaissance}</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>
          Supprimer cet utilisateur
        </button>
        <button onClick={() => navigate("/users")} style={{ marginLeft: "10px" }}>
          Retour à la liste
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Details;

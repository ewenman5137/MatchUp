import React from "react";
import Header from '../../../Composants/Header/page'; 

export default function ReservationConfirmation() {
  return (
    <div className="min-h-screen bg-gray-50 p-2 ">
      <Header />

      <main className="flex space-x-6 mt-20">
        {/* Sidebar - Events */}
        <div className="w-64 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Événement à venir</h3>
            <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
              <img src="/tennis_image.jpg" alt="Tennis" className="h-16 w-16 rounded-lg" />
              <div>
                <p className="text-sm text-gray-500">Dimanche 16 juillet 2025</p>
                <h4 className="font-semibold">Tennis</h4>
                <p className="text-sm text-gray-500">UQAC, Chicoutimi</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Événement passé</h3>
            <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
              <img src="/tennis_image.jpg" alt="Tennis" className="h-16 w-16 rounded-lg" />
              <div>
                <p className="text-sm text-gray-500">Samedi 15 juillet 2025</p>
                <h4 className="font-semibold">Tennis</h4>
                <p className="text-sm text-gray-500">UQAC, Chicoutimi</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Politique d'annulation</h4>
            <p className="text-sm text-gray-500">
              Vous pouvez annuler jusqu'à 24h avant sinon vous ne serez pas remboursé des frais d'inscription.
            </p>
          </div>
        </div>

        {/* Main Content - Reservations */}
        <div className="flex-1 space-y-6">
          {/* Reservation Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Lundi 17 juillet 2025</h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Confirmé</span>
            </div>
            <div className="flex items-center space-x-4">
              <img src="/tennis_image.jpg" alt="Tennis" className="h-20 w-20 rounded-lg" />
              <div>
                <h3 className="font-semibold">Tennis - Pavillon Sportif</h3>
                <p className="text-sm text-gray-500">UQAC - 555, boulevard de l'Université, Chicoutimi</p>
                <p className="text-sm text-gray-500">Réservation ref. #: 65742695</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Terrain n°1</p>
              <p className="text-sm text-gray-500">Horaire: 18h à 19h</p>
              <p className="text-sm text-gray-500">2 joueurs</p>
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Taxes</span>
                <span>Incluses</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total</span>
                <span>12€</span>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>S'y rendre</span>
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>Reporter</span>
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>Annuler</span>
              </button>
            </div>
          </div>

          {/* Another Reservation */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Mardi 18 juillet 2025</h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Confirmé</span>
            </div>
            <div className="flex items-center space-x-4">
              <img src="/tennis_image.jpg" alt="Tennis" className="h-20 w-20 rounded-lg" />
              <div>
                <h3 className="font-semibold">Tennis</h3>
                <p className="text-sm text-gray-500">UQAC - 555, boulevard de l'Université, Chicoutimi</p>
                <p className="text-sm text-gray-500">Réservation ref. #: 65742695</p>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>S'y rendre</span>
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>Reporter</span>
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>Annuler</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 

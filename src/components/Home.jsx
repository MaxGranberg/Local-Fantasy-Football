import React from 'react';

const Home = () => {
  return (
    <section className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-10 rounded-lg shadow-lg mx-auto mt-10 max-w-4xl">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Välkommen!</h2>
      <p className="text-xl text-gray-800 leading-relaxed text-center mb-4">
        Skapa & hantera ditt fantasylag under <span className="font-semibold text-blue-800">'My Team'</span>.
      </p>
      <p className="text-xl text-gray-800 leading-relaxed text-center mb-4">
        Se hur du ligger till i ligan jämfört med andra användare genom att klicka på <span className="font-semibold text-blue-800">'League Standings'</span>,
        eller spana in kommande matcher och alla lags resultat i Västra Götaland Division 5 Mellersta under <span className="font-semibold text-blue-800">'Results & Fixtures'</span>.
      </p>
      <p className="text-xl text-gray-800 leading-relaxed text-center">
        Glöm inte att uppdatera ditt lag regelbundet för att maximera dina chanser att vinna. Håll dig uppdaterad om de senaste matchresultaten och se till att ditt lag alltid är i toppform. Lycka till!
      </p>
    </section>
  );
};

export default Home;

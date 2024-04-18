import React from 'react';

const Home = () => {
  return (
    <section className="bg-gray-100 p-10 rounded-lg shadow-md mx-auto mt-10 max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Välkommen!</h2>
      <p className="text-lg text-gray-700 leading-relaxed text-center">
        Skapa & kolla in ditt lag under My Team och gör byten om du känner för det!
        Se hur du ligger till i ligan jämfört med andra användare genom att klicka på League,
        eller spana in kommande matcher i Västra Götaland Division 5 Mellersta under 'Upcoming fixtrues'
      </p>
    </section>
  );
};

export default Home;
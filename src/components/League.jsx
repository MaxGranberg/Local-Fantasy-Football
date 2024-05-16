import React, { useState, useEffect } from 'react';

function LeagueStandings() {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/leagues/standings`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch standings');
        const data = await response.json();
        setStandings(data);
      } catch (error) {
        console.error('Error fetching league standings:', error);
      }
    };

    fetchStandings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 shadow-xl rounded-lg">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">League Standings</h1>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-6">Lagnamn</th>
              <th scope="col" className="py-3 px-6">Användarnamn</th>
              <th scope="col" className="py-3 px-6">Totalpoäng</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">{team.teamName}</td>
                <td className="py-4 px-6">{team.ownerUsername}</td>
                <td className="py-4 px-6">{team.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeagueStandings;

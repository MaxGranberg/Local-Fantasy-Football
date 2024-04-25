import React, { useEffect, useState } from 'react';

function Fixtures() {
  const [teams, setTeams] = useState([]); // Teams fetched from the API
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    fetchTeams();
  })

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/teams`)
      if (!response.ok) throw new Error('Failed to fetch teams');
      const teamsData = await response.json();
      setTeams(teamsData);
    } catch (error) {
      console.error('Fetching error:', error);
    }
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  return (
    <div className="fixtures max-w-7xl mx-auto px-6 py-8 bg-gray-50 shadow-xl rounded-xl grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 mb-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">Search Upcoming Fixtures for a Team</h1>
        <select
          value={selectedTeam}
          onChange={handleTeamChange}
          className="mb-6 w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          <option value="">Select a Team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
        </select>
        <div id="fixtures-info" className="overflow-y-auto max-h-screen">
          {/* Display team-specific fixtures here based on selectedTeam */}
        </div>
      </div>
      <div className="overflow-y-auto">
      <h2 className="text-lg text-center font-semibold text-blue-800 mt-2 mb-4">Upcoming fixtures</h2>
        <iframe src="/upcoming-fixtures.html" style={{ width: '100%', height: '250px', border: 'none' }} title="Upcoming fixtures"></iframe>
        <h2 className="text-lg text-center font-semibold text-blue-800 mb-4">League Standings</h2>
        <iframe src="/league-standings.html" style={{ width: '100%', height: '500px', border: 'none' }} title="League Standings"></iframe>
      </div>
    </div>
  );
}

export default Fixtures;

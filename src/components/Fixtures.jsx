import React, { useState } from 'react';

function Fixtures() {
  const [selectedTeam, setSelectedTeam] = useState('');


  // Teams could be fetched from an API or hardcoded
  const teams = [
    { id: 'team1', name: 'Team 1' },
    { id: 'team2', name: 'Team 2' },
  ];

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
    console.log(`Selected Team ID: ${event.target.value}`);
  };

  return (
    <div className="fixtures max-w-7xl mx-auto px-6 py-8 bg-gray-50 shadow-xl rounded-xl grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 mb-8">
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">Search Upcoming Fixtures</h1>
            <select
                value={selectedTeam}
                onChange={handleTeamChange}
                className="mb-6 w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
                <option value="">Select a Team</option>
                {/* Add teams here */}
            </select>
            <div id="fixtures-info" className="overflow-y-auto max-h-screen">
                {/* Display team-specific fixtures here based on selectedTeam */}
            </div>
        </div>
        <div className="current-team overflow-y-auto max-h-screen">
            <h2 className="text-lg text-center font-semibold text-blue-800 mt-2 mb-4">League Standings</h2>
        <iframe src="/league-standings.html" style={{ width: '100%', height: '500px', border: 'none' }} title="League Standings"></iframe>
      </div>
    </div>
  );
}

export default Fixtures;

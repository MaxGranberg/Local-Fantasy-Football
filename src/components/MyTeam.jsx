import React, { useState, useEffect } from 'react';

function MyTeam() {
  const [teams, setTeams] = useState([]); // Teams fetched from the API
  const [positions, setPositions] = useState(['Goalkeeper', 'Defender', 'Midfielder', 'Forward']);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [players, setPlayers] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [myTeamId, setMyTeamId] = useState(null);
  const [userId, setUserId] = useState(''); // This should ideally come from authentication context
  const [teamName, setTeamName] = useState('');

  useEffect(() => {
    fetchTeams(); // Function to fetch teams
    fetchUsersFantasyTeam(userId); // Adjust to pass actual userId?
  }, [userId]);

  // In future maybe remove this and show all players and rank them based on their total score??
  useEffect(() => {
    if (selectedTeam || selectedPosition) {
      fetchPlayers();
    } else {
      setPlayers([]);  // Clear players list if no filters are applied
    }
  }, [selectedTeam, selectedPosition]);


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

  const fetchUsersFantasyTeam = async (userId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/fantasyTeams`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch fantasy teams');
    const fantasyTeams = await response.json();
    const userFantasyTeam = fantasyTeams.find(fantasyTeam => fantasyTeam.owner === userId);
    setMyTeam(userFantasyTeam ? userFantasyTeam.players : []);
    setTeamName(userFantasyTeam ? userFantasyTeam.teamName : ''); // Set team name if existing
  } catch (error) {
    console.error('Fetching error:', error);
  }
};

const fetchPlayers = async () => {
  let url = `${process.env.REACT_APP_API_URL}/players`; // Default URL for all players
    if (selectedTeam) {
      url = `${process.env.REACT_APP_API_URL}/teams/${selectedTeam}/players`; // URL for players by team
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      const playersData = selectedTeam ? data.players : data; // Adjust based on your API response structure
      const filteredPlayers = selectedPosition ? playersData.filter(player => player.position === selectedPosition) : playersData;
      setPlayers(filteredPlayers);
    } catch (error) {
      console.error('Fetching error:', error);
    }
  };

  const addPlayerToTeam = (player) => {
    if (myTeam.length >= 11) {
        alert("Your team is already full. You cannot add more players.");
        return;
    }

    if (myTeam.find(p => p.id === player.id)) {
        alert("This player is already in your team.");
        return;
    }

    const updatedTeam = [...myTeam, player];
    setMyTeam(updatedTeam);
};

const saveFantasyTeam = async () => {
  if (myTeam.length !== 11 || !teamName) {
      alert("You must have exactly 11 players and a team name to save your team.");
      return;
  }

  const url = myTeamId ? 
      `${process.env.REACT_APP_API_URL}/fantasyTeams/${myTeamId}` : 
      `${process.env.REACT_APP_API_URL}/fantasyTeams`;

  const method = myTeamId ? 'PATCH' : 'POST';
  const body = {
      teamName: teamName,
      owner: userId,  // Need correct user ID
      players: myTeam.map(player => player.id),
  };

  try {
      const response = await fetch(url, {
          method: method,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save fantasy team');

      if (!myTeamId) setMyTeamId(data.id); // Update state with new team ID if it's a new creation
      alert('Fantasy team saved successfully!');
  } catch (error) {
      console.error('Error saving fantasy team:', error);
      alert(error.message);
  }
};

return (
  <div className="my-team max-w-4xl mx-auto p-4 bg-white shadow rounded-lg">
    <h1 className="text-xl font-bold text-center mb-4">Pick 11 players to your fantasy team</h1>
    {!myTeamId && (
      <input
        type="text"
        placeholder="Enter your team name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        className="mb-4 w-full p-2 border rounded focus:outline-none focus:border-blue-500"
      />
    )}
    <div className="filters grid grid-cols-2 gap-4 mb-4">
      <select
        value={selectedTeam}
        onChange={e => setSelectedTeam(e.target.value)}
        className="p-2 border rounded cursor-pointer focus:outline-none focus:border-blue-500"
      >
        <option value="">Select a Team</option>
        {teams.map(team => (
          <option key={team.id} value={team.id}>{team.name}</option>
        ))}
      </select>
      <select
        value={selectedPosition}
        onChange={e => setSelectedPosition(e.target.value)}
        className="p-2 border rounded cursor-pointer focus:outline-none focus:border-blue-500"
      >
        <option value="">Select a Position</option>
        {positions.map(position => (
          <option key={position} value={position}>{position}</option>
        ))}
      </select>
    </div>
    <div className="available-players mb-4">
      <h2 className="text-lg font-semibold mb-2">Available Players:</h2>
      <ul className="list-none space-y-2">
        {players.map(player => (
          <li key={player.id} className="flex justify-between items-center">
            {player.name} - {player.position}
            <button
              onClick={() => addPlayerToTeam(player)}
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded focus:outline-none focus:shadow-outline transition-colors"
            >
              Add to My Team
            </button>
          </li>
        ))}
      </ul>
    </div>
    <div className="current-team">
      <h2 className="text-lg font-semibold mb-2">Current Team:</h2>
      <ul className="list-none space-y-2">
        {myTeam.map(player => (
          <li key={player.id}>
            {player.name} - {player.position}
          </li>
        ))}
      </ul>
      <button
        onClick={saveFantasyTeam}
        disabled={myTeam.length !== 11 || !teamName.trim()}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Save My Team
      </button>
    </div>
  </div>
);

}

export default MyTeam;
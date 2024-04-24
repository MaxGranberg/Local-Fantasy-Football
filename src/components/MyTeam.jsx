import React, { useState, useEffect } from 'react';

function MyTeam() {
  const [teams, setTeams] = useState([]); // Teams fetched from the API
  const [positions, setPositions] = useState(['Goalkeeper', 'Defender', 'Midfielder', 'Forward']);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [players, setPlayers] = useState([]);
  const [myTeam, setMyTeam] = useState([]);

  useEffect(() => {
    fetchTeams(); // Function to fetch teams
    fetchUsersFantasyTeam(); // Adjust to pass actual userId?
  }, []);

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
    if (myTeam.length < 11 && !myTeam.find(p => p.id === player.id)) {
      setMyTeam([...myTeam, player]);
      // Optionally, update the team on the backend
    } else {
      // Handle error (team full or player already added)
      alert("Team is full or player is already added");
    }
  };

  return (
    <div className="my-team">
      <h1>Pick players to your fantasy team</h1>
      <div className="filters">
        <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
          <option value="">Select a Team</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <select value={selectedPosition} onChange={e => setSelectedPosition(e.target.value)}>
          <option value="">Select a Position</option>
          {positions.map(position => (
            <option key={position} value={position}>{position}</option>
          ))}
        </select>
      </div>
      <div className="available-players">
        <h2>Available Players</h2>
        <ul>
          {players.map(player => (
            <li key={player.id}>
              {player.name} - {player.position}
              <button onClick={() => addPlayerToTeam(player)}>Add to My Team</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="current-team">
        <h2>Current Team</h2>
        <ul>
          {myTeam.map(player => (
            <li key={player.id}>
              {player.name} - {player.position}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MyTeam;
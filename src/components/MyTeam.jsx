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

  useEffect(() => {
    if (selectedTeam || selectedPosition) {
      fetchPlayers();
    }
  }, [selectedTeam, selectedPosition]); // Depend on selectedTeam and selectedPosition

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
  if (!selectedTeam) return;  // Exit if no team is selected
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/teams/${selectedTeam}/players`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch players');
    const playersData = await response.json();
    setPlayers(playersData.players); // Assuming the response structure has a 'players' field
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
        <select value={selectedTeam} onChange={e => {
          setSelectedTeam(e.target.value);
          fetchPlayers();
        }}>
          <option value="">Select a Team</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>

        <select value={selectedPosition} onChange={e => {
          setSelectedPosition(e.target.value);
          fetchPlayers();
        }}>
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
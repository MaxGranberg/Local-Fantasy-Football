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
    fetchUsersFantasyTeam(); // Function to fetch user's team
  }, []);

  const fetchTeams = async () => {
    // Fetch teams from the API
    const response = await fetch('https://fflapi-a68806964222.herokuapp.com/api/v1/teams')
    
  };

  const fetchUsersFantasyTeam = async () => {
    // Fetch the current user's team from the API
  };

  const fetchPlayers = async () => {
    // Fetch players based on selectedTeam or selectedPosition
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
      <h1>My Team</h1>
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
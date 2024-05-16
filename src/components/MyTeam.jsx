import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
import { type } from '@testing-library/user-event/dist/type';

function MyTeam() {
  const [teams, setTeams] = useState([]); // Teams fetched from the API
  const [positions, setPositions] = useState(['Goalkeeper', 'Defender', 'Midfielder', 'Forward']);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [players, setPlayers] = useState([]);
  const [fantasyTeamPlayers, setFantasyTeamPlayers] = useState([]);
  const [myFantasyTeamId, setMyFantasyTeamId] = useState(null);
  const [fantasyTeamName, setFantasyTeamName] = useState('');

  const { userId } = useContext(AuthContext)

  const sortPlayersByPosition = (players) => {
    const positionPriority = {
      'Goalkeeper': 1,
      'Defender': 2,
      'Midfielder': 3,
      'Forward': 4
    };
    return players.sort((a, b) => positionPriority[a.position] - positionPriority[b.position]);
  };

  useEffect(() => {
    fetchTeams();
    if (userId) {
      fetchUsersFantasyTeam(userId);
    }
  }, [userId]);

  // In future maybe remove this and show all players and rank them based on their total score??
  useEffect(() => {
    if (selectedTeam || selectedPosition) {
      fetchPlayers();
    } else {
      setPlayers([]);  // Clear players list if no filters are applied
    }
  }, [selectedTeam, selectedPosition]);

  useEffect(() => {
    if (myFantasyTeamId) {
      fetchUsersFantasyTeamPlayers(myFantasyTeamId);
    }
  }, [myFantasyTeamId]);


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
      setFantasyTeamPlayers(userFantasyTeam ? userFantasyTeam.players : []);
      setFantasyTeamName(userFantasyTeam ? userFantasyTeam.teamName : '');
      setMyFantasyTeamId(userFantasyTeam ? userFantasyTeam.id : null);
    } catch (error) {
      console.error('Fetching error:', error);
    }
  };

  const fetchUsersFantasyTeamPlayers = async (fantasyTeamId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/fantasyTeams/${fantasyTeamId}/players`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch fantasy teams players');
      const data = await response.json();
      const sortedPlayers = sortPlayersByPosition(data.players);
      setFantasyTeamPlayers(sortedPlayers);
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
      const playersData = selectedTeam ? data.players : data;
      const filteredPlayers = selectedPosition ? playersData.filter(player => player.position === selectedPosition) : playersData;
      setPlayers(filteredPlayers);
    } catch (error) {
      console.error('Fetching error:', error);
    }
  };

  const addPlayerToTeam = (player) => {
    if (fantasyTeamPlayers.length >= 11) {
        alert("Your team is already full. You cannot add more players.");
        return;
    }

    if (fantasyTeamPlayers.find(p => p.id === player.id)) {
        alert("This player is already in your team.");
        return;
    }

    const positionCount = fantasyTeamPlayers.reduce((count, p) => {
        count[p.position] = (count[p.position] || 0) + 1;
        return count;
    }, {});

    const newPositionCount = { ...positionCount, [player.position]: (positionCount[player.position] || 0) + 1 };

    // Define the maximum and minimum limits for each position
    const positionLimits = {
        'Goalkeeper': { max: 1, min: 1 },
        'Defender': { max: 5, min: 3 },
        'Midfielder': { max: 6, min: 3 },
        'Forward': { max: 3, min: 1 }
    };

    // Check maximum limit for the added player's position
    if (newPositionCount[player.position] > positionLimits[player.position].max) {
        alert(`You cannot have more than ${positionLimits[player.position].max} ${player.position}(s).`);
        return;
    }

    // Enhance the player object with the team name before adding it to the state
    const playerWithTeam = {
        ...player,
        teamName: teams.find(team => team.id === player.team)?.name
    };

    // Add player to the team
    const updatedTeam = [...fantasyTeamPlayers, playerWithTeam];
    const sortedUpdatedTeam = sortPlayersByPosition(updatedTeam);
    setFantasyTeamPlayers(sortedUpdatedTeam);
  };

  const removePlayerFromTeam = playerId => {
    const updatedTeam = fantasyTeamPlayers.filter(player => player.id !== playerId);
    const sortedUpdatedTeam = sortPlayersByPosition(updatedTeam);
    setFantasyTeamPlayers(sortedUpdatedTeam);
  };
  
  const saveFantasyTeam = async () => {
    if (fantasyTeamPlayers.length !== 11 || !fantasyTeamName) {
      alert("You must have exactly 11 players and a team name to save your team.");
      return;
    }

      // Count players by position in the current team
      const positionCount = fantasyTeamPlayers.reduce((count, player) => {
        count[player.position] = (count[player.position] || 0) + 1;
        return count;
      }, {});
  
      // Define the minimum limits for each position
      const positionLimits = {
          'Goalkeeper': { min: 1, max: 1 },
          'Defender': { min: 3, max: 5 },
          'Midfielder': { min: 3, max: 6 },
          'Forward': { min: 1, max: 3 }
      };
  
      // Check if all position limits are met
      for (const [position, limits] of Object.entries(positionLimits)) {
          const count = positionCount[position] || 0;
          if (count < limits.min || count > limits.max) {
              alert(`Invalid number of ${position}s. Must have between ${limits.min} and ${limits.max}.`);
              return;
          }
      }

    const url = myFantasyTeamId ? 
        `${process.env.REACT_APP_API_URL}/fantasyTeams/${myFantasyTeamId}` : 
        `${process.env.REACT_APP_API_URL}/fantasyTeams`;


    const method = myFantasyTeamId ? 'PATCH' : 'POST';
    const body = {
        teamName: fantasyTeamName,
        owner: userId,
        players: fantasyTeamPlayers.map(player => player.id),
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

        if (!myFantasyTeamId) {  // Only set the ID if it's a new creation
          setMyFantasyTeamId(data.id);
        }
        alert('Fantasy team saved successfully!');
        fetchUsersFantasyTeamPlayers(data.id || myFantasyTeamId);
    } catch (error) {
        console.error('Error saving fantasy team:', error);
        alert(error.message);
    }
  };

  return (
    <div className="my-team max-w-7xl mx-auto px-6 py-8 bg-gray-50 shadow-xl rounded-xl grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 mb-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">Välj 11 spelare till ditt fantasylag</h1>
        {(!myFantasyTeamId || !fantasyTeamName) && (
          <input
            type="text"
            placeholder="Enter your team name"
            value={fantasyTeamName}
            onChange={(e) => setFantasyTeamName(e.target.value)}
            className="mb-6 w-full p-3 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        )}
        <div className="filters grid grid-cols-2 gap-4 mb-4">
          <select
            value={selectedTeam}
            onChange={e => setSelectedTeam(e.target.value)}
            className="p-3 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Välj ett lag</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <select
            value={selectedPosition}
            onChange={e => setSelectedPosition(e.target.value)}
            className="p-3 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="">Välj en position</option>
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
        <div className="available-players overflow-y-auto max-h-screen">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Tillgängliga spelare:</h2>
          <ul className="space-y-2">
            {players.map(player => (
              <li key={player.id} className="flex justify-between items-center bg-white p-2 rounded-lg shadow">
                <div className="flex items-center">
                  <span className="font-bold">{player.name}</span>
                  <span className="mx-2">-</span>
                  <span className="italic">{player.position}</span>
                </div>
                <button
                  onClick={() => addPlayerToTeam(player)}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Lägg till i mitt lag
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="current-team overflow-y-auto max-h-screen">
        <h2 className="text-lg text-center font-semibold text-blue-800 mt-4 mb-4">Nuvarande lag: {fantasyTeamName}</h2>
        <ul className="space-y-4">
        {fantasyTeamPlayers.map(player => {
            const teamName = teams.find(team => team.id === player.team)?.name;
            return (
              <li key={player.id} className="bg-gray-100 p-2 rounded shadow flex justify-between items-center">
              <div className="flex items-center">
                  <span className="font-bold">{player.name}</span>
                  <span className="mx-2">-</span>
                  <span className="italic">{player.position}</span>
                  {teamName && (
                      <span className="ml-2 italic text-gray-600">- {teamName}</span>
                  )}
              </div>
                    <button
                        onClick={() => removePlayerFromTeam(player.id)}
                        className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                    >
                        Ta bort
                    </button>
                </li>
            );
        })}
    </ul>

        <button
          onClick={saveFantasyTeam}
          disabled={fantasyTeamPlayers.length !== 11 || !fantasyTeamName.trim()}
          className="mt-4 bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full"
        >
          Spara laget
        </button>
      </div>
    </div>
  );
  
  

}

export default MyTeam;
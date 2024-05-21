import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
import FlashMessage from './FlashMessage';

function MyTeam() {
  const [teams, setTeams] = useState([]); // Teams fetched from the API
  const [positions, setPositions] = useState(['Goalkeeper', 'Defender', 'Midfielder', 'Forward']);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [players, setPlayers] = useState([]);
  const [fantasyTeamPlayers, setFantasyTeamPlayers] = useState([]);
  const [myFantasyTeamId, setMyFantasyTeamId] = useState(null);
  const [fantasyTeamName, setFantasyTeamName] = useState('');
  const [flashMessage, setFlashMessage] = useState(null);

  // Using context to retrieve the current user's ID
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

  // Fetch players when team or position selection changes
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
      setFlashMessage({ message: 'Failed to fetch teams', type: 'error' });
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
      setFlashMessage({ message: 'Failed to fetch fantasy teams', type: 'error' });
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
      setFlashMessage({ message: 'Failed to fetch fantasy teams players', type: 'error' });
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
      setFlashMessage({ message: 'Failed to fetch players', type: 'error' });
    }
  };

  const addPlayerToTeam = (player) => {
    if (fantasyTeamPlayers.length >= 11) {
      setFlashMessage({ message: "Ditt lag är fullt. Du kan inte lägga till fler spelare.", type: 'error' });
      return;
    }

    if (fantasyTeamPlayers.find(p => p.id === player.id)) {
      setFlashMessage({ message: "Den här spelaren är redan i ditt lag.", type: 'error' });
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
      setFlashMessage({ message: `Du kan inte ha mer än ${positionLimits[player.position].max} ${player.position}(s).`, type: 'error' });
      return;
    }

    // Enhance the player object with the team name before adding it to the state
    const playerWithTeamname = {
      ...player,
      teamName: teams.find(team => team.id === player.team)?.name
    };

    // Add player to the team
    const updatedTeam = [...fantasyTeamPlayers, playerWithTeamname];
    const sortedUpdatedTeam = sortPlayersByPosition(updatedTeam);
    setFantasyTeamPlayers(sortedUpdatedTeam);
  };

  const removePlayerFromTeam = playerId => {
    const updatedTeam = fantasyTeamPlayers.filter(player => player.id !== playerId);
    const sortedUpdatedTeam = sortPlayersByPosition(updatedTeam);
    setFantasyTeamPlayers(sortedUpdatedTeam);
  };

  const saveFantasyTeam = async () => {
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
        setFlashMessage({ message: `Ogiltigt antal ${position}s. Måste ha mellan ${limits.min} och ${limits.max}.`, type: 'error' });
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

      if (!myFantasyTeamId) {  // Only set the ID if it's a new team
        setMyFantasyTeamId(data.id);
      }
      setFlashMessage({ message: 'Ditt fantasylag är sparat!', type: 'success' });
      fetchUsersFantasyTeamPlayers(data.id || myFantasyTeamId);
    } catch (error) {
      setFlashMessage({ message: error.message, type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-gray-50 shadow-xl rounded-xl mt-4 mb-8">
      {flashMessage && (
        <div className="mb-4">
          <FlashMessage
            message={flashMessage.message}
            type={flashMessage.type}
            onClose={() => setFlashMessage(null)}
          />
        </div>
      )}
      <div className="my-team grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">Välj 11 spelare till ditt fantasylag</h1>
          {(!myFantasyTeamId || !fantasyTeamName) && (
            <input
              type="text"
              placeholder="Fyll i ditt lagnamn"
              required
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
                    <span className="mx-2">-</span>
                    <span className="italic text-gray-600">{player.totalPoints} poäng totalt</span>
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
    </div>
  );
}

export default MyTeam;
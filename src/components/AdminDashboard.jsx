import React, { useState, useEffect } from 'react';

function AdminDashboard() {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/teams`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            });
            const data = await response.json();
            setTeams(data);
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTeam) {
            fetchPlayers();
        } else {
            setPlayers([]);
        }
    }, [selectedTeam]);

    const fetchPlayers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/teams/${selectedTeam}/players`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
            });
            const data = await response.json();
            setPlayers(data.players);
        } catch (error) {
            console.error('Error fetching players:', error);
        } finally {
            setLoading(false);
        }
    };

    const updatePlayerPoints = async (playerId, addedPoints) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/players/points/${playerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ addedPoints })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update player points');
            }
            alert('Points updated successfully!');
            fetchPlayers();  // Refresh the player list to show updated points
        } catch (error) {
            console.error('Error updating player points:', error);
            alert(error.message);
        }
    };

    if (loading) return <p className='text-center mt-6'>Loading...</p>;

    return (
        <div className="admin-dashboard max-w-7xl mx-auto px-6 py-8 bg-gray-50 shadow-xl rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Admin Kontrollpanel: Uppdatera spelares poäng</h1>
            <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="mb-4 p-3 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
                <option value="">Välj ett lag</option>
                {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                ))}
            </select>
            <ul>
                {players.map(player => (
                    <li key={player.id} className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-2">
                        {player.name} - {player.position} - Nuvarande poäng: {player.totalPoints}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const addedPoints = parseInt(e.target.elements.points.value);
                            updatePlayerPoints(player.id, addedPoints);
                        }}>
                            <input type="number" name="points" className="border border-gray-300 rounded p-1" placeholder="Lägg till poäng" />
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded ml-2">Uppdatera</button>
                        </form>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDashboard;

import React, {useContext, useEffect, useState} from "react";
import {Input} from "@material-tailwind/react";
import {Button} from "@material-tailwind/react";
import {useNavigate} from 'react-router-dom'
import {UserContext} from "../context/UserContext";
import GameProvider from "../providers/GameProvider";

export function Menu() {
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()
    const hasNickname = user !== ""
    const [gameID, setGameID] = useState('');

    const nicknameChanged = (event) => {
        setUser(event.target.value)
    }

    const gameIdChanged = (event) => {
        setGameID(event.target.value)
    }

    const handleCreateGame = (event) => {
        GameProvider.createGame(user).then((game) => {
                navigate(`/game/${game.gameID}`, {state: {game: game, user: user}})
        })
    }

    const handleJoinRandomGame = (event) => {
        GameProvider.connectToRandomGame(user).then((game) => {
            navigate(`/game/${game.gameID}`, {state: {game: game}})
        }).catch((error) => (console.log(error)))
    }

    const handleJoinGame = (event) => {
        GameProvider.connectToGame(gameID, user).then((game) => {
            navigate(`/game/${game.gameID}`, {state: {game: game}})
        }).catch((error) => (console.log(error)))
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="bg-orange-500 w-[20rem] rounded-xl p-2 text-white">
                <div className="font-semibold tracking-wide text-2xl ">Tic Tac Toe</div>
                <div className="mx-10 my-3">
                    <Input className="outline-0" color="white"
                           onChange={nicknameChanged}
                           variant="outlined" label="Nickname" value={user} placeholder="Nickname"/>
                </div>
                <Button className="mt-2 rounded-xl" disabled={!hasNickname} onClick={handleCreateGame}>
                    Create game
                </Button>
                <Button className="mt-2 rounded-xl" disabled={!hasNickname} onClick={handleJoinRandomGame}>
                    Join random game
                </Button>
                <div className="mx-10 my-3">
                    <Input className="outline-0" color="white"
                            onChange={gameIdChanged}
                            variant="outlined" label="Game ID" value={gameID} placeholder="Game ID"/>
                    </div>
                <Button className="mt-1 mb-3 rounded-xl" disabled={!hasNickname || gameID === ""} onClick={handleJoinGame}>
                    Join game
                </Button>
            </div>
        </div>
    )
}
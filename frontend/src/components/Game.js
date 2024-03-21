import {useLocation} from "react-router-dom";
import {useContext, useState} from "react";
import {UserContext} from "../context/UserContext";
import {StompSessionProvider, useSubscription} from "react-stomp-hooks";
import {URL} from "../providers/GameProvider";
import Board from "./Board";


export default function Game() {
    const location = useLocation()
    const gameState = useState(location.state.game)
    const [game, setGame] = gameState
    const {user} = useContext(UserContext)

    const Status = () => {
        useSubscription(`/game/${game.gameID}/status`, (message) => {
            const game = JSON.parse(message.body)
            setGame(game)
        });
        return (
            <div>
                Status: {game.status}
            </div>
        )
    }

    return (
        <StompSessionProvider url={`${URL}/websocket`}>
            <div className="m-auto">
                <Status/>
                <Board game={game}/>
                {game.gameID}
            </div>
        </StompSessionProvider>
    )
}
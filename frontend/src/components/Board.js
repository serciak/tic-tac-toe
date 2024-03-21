import {useStompClient, useSubscription} from "react-stomp-hooks";
import {useContext, useState} from "react";
import {UserContext} from "../context/UserContext";
import {body} from "@material-tailwind/react/theme/base/typography";
import GameProvider from "../providers/GameProvider";
import ResultPopup from "./ResultPopup";

export default function Board(props) {
    const game = props.game
    const stompClient = useStompClient()
    const [board, setBoard] = useState(game.board);
    const {user} = useContext(UserContext)
    const [lastUser, setLastUser] = useState(null)
    const isX = game.player1.nickname === user
    const currentUser = (() => {
        if (lastUser === null || lastUser !== game.player1.nickname) {
            return game.player1.nickname
        }
        return game.player2.nickname
    })()
    const  [gameResult, setGameResult] = useState(null)
    const handleWS = (message) => {
        const response = JSON.parse(message)

        setBoard(JSON.parse(JSON.stringify(response.body.board)))
        console.log(response.body.winner)
        if (response.body.winner !== null) {
            if (isX && response.body.winner === "X") {
                setGameResult("won")
            }
            else if (!isX && response.body.winner === "O") {
                setGameResult("won")
            }
            else {
                setGameResult("lost")
            }
        }

        setLastUser(currentUser !== game.player2.nickname ? game.player1.nickname : game.player2.nickname)
    };

    useSubscription(`/game/${game.gameID}/moves`, (message) => {
        handleWS(message.body)
    })

    const handleFieldSelect = (row, col) => {
        if (game.player2 === null || currentUser !== user) {
            console.log("Not your turn!")
            return
        }
        if (board[row][col] !== null) {
            console.log("Cell filled!")
            return
        }
        GameProvider.makeMove(stompClient, game.gameID, isX ? 'X' : 'O', row, col)
    }

    const RenderRow = (row, rowIndex) => {
        return (<div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => {
                    cell = cell === null ? "" : cell
                    return (
                        <div key={`${rowIndex}-${cellIndex}`} onClick={() => handleFieldSelect(rowIndex, cellIndex, cell)}
                             className={"w-20 h-20 border-2 border-black text-4xl flex justify-center items-center"}>
                            {cell}
                        </div>)
                }
            )}
        </div>);
    }

    const CurrentTurn = () => (
        <div>
            {game.status === "IN_PROGRESS" && `${currentUser === user ? "Your" : currentUser} turn`}
        </div>
    )
    return (
        <div>
            <CurrentTurn/>
            { gameResult !== null && (<ResultPopup gameResult={gameResult}/>) }
            <div className="relative m-auto mb-5">
                <div className="flex flex-col items-center">
                    {board.map((row, index) => RenderRow(row, index))}
                </div>
            </div>
        </div>
    )
}
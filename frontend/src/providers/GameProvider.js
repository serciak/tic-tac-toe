import axios from 'axios'

export const URL = 'http://localhost:8080'

export default class GameProvider {

    static async createGame(user) {
        return axios.post(`${URL}/games/create`, {
            nickname: user
        }).then((response) => response.data)
    }

    static async connectToGame(gameID, nickname) {
        return axios.post(`${URL}/games/connect`, {
            gameID: gameID,
            player: {
                nickname: nickname
            }
        }).then((response) => response.data)
    }

    static async connectToRandomGame(nickname) {
        return axios.post(`${URL}/games/connect/random`, {
            nickname: nickname
        }).then((response) => response.data)
    }

    static makeMove(stompClient, gameID, type, x, y) {
        stompClient.publish({
            destination: `/app/${gameID}/move`,
            body: JSON.stringify({
                type: type,
                x: x,
                y: y,
                gameID: gameID
            })
        })
    }
}
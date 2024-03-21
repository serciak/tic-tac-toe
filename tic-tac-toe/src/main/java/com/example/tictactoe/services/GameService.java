package com.example.tictactoe.services;

import com.example.tictactoe.models.Game;
import com.example.tictactoe.models.Mark;
import com.example.tictactoe.models.Move;
import com.example.tictactoe.models.Player;
import com.example.tictactoe.storage.GameStorage;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.UUID;

import static com.example.tictactoe.models.GameStatus.*;

@Service
@AllArgsConstructor
public class GameService {
    public Game createGame(Player player) {
        Game game = new Game();
        game.setBoard(new Mark[3][3]);
        game.setGameID(UUID.randomUUID().toString());
        game.setPlayer1(player);
        game.setStatus(NEW);

        GameStorage.getInstance().addGame(game);

        return game;
    }

    public Game connectToGame(String gameID, Player player2) {
        if (!GameStorage.getInstance().getGames().containsKey(gameID)) {
            throw new RuntimeException("Game not found!");
        }
        Game game = GameStorage.getInstance().getGames().get(gameID);

        if (game.getPlayer2() != null) {
            throw new RuntimeException("Game already started!");
        }

        game.setPlayer2(player2);
        game.setStatus(IN_PROGRESS);
        GameStorage.getInstance().addGame(game);

        return game;
    }

    public Game connectToRandomGame(Player player2) {
        Game game = GameStorage.getInstance().getGames()
                .values()
                .stream()
                .filter(it -> it.getStatus().equals(NEW))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No waiting games found!"));

        game.setPlayer2(player2);
        game.setStatus(IN_PROGRESS);
        GameStorage.getInstance().addGame(game);
        return game;
    }

    public Game makeMove(Move move) {
        if (!GameStorage.getInstance().getGames().containsKey(move.getGameID())) {
            throw new RuntimeException("Game not found!");
        }

        Game game = GameStorage.getInstance().getGames().get(move.getGameID());
        if (game.getStatus().equals(FINISHED)) {
            throw new RuntimeException("Game finished!");
        }

        Mark [][] board = game.getBoard();
        board[move.getX()][move.getY()] = move.getType();

        if (checkWinner(board, move.getType())) {
            game.setWinner(move.getType());
            game.setStatus(FINISHED);
        }

        GameStorage.getInstance().addGame(game);
        return game;
    }

    private Boolean checkWinner(Mark[][] board, Mark mark) {
        int[][] winCombinations = {{0, 1, 2}, {3, 4, 5}, {6, 7, 8}, {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, {0, 4, 8}, {2, 4, 6}};
        Mark[] flatBoard = Arrays.stream(board).flatMap(Arrays::stream).toArray(Mark[]::new);

        for (int[] winCombination : winCombinations) {
            int counter = 0;

            for (int i : winCombination) {
                if (flatBoard[i] == mark) {
                    counter++;
                    if (counter == 3) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}

package com.example.tictactoe.models;

import lombok.Data;

@Data
public class Game {
    private String gameID;
    private Player player1;
    private Player player2;
    private GameStatus status;
    private Mark [][] board;
    private Mark winner;
}

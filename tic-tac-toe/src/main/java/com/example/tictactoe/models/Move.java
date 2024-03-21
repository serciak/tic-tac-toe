package com.example.tictactoe.models;

import lombok.Data;

@Data
public class Move {
    private Mark type;
    private Integer x;
    private Integer y;
    private String gameID;
}

package com.example.tictactoe.controllers.dto;

import com.example.tictactoe.models.Player;
import lombok.Data;

@Data
public class ConnectRequest {
    private String gameID;
    private Player player;
}

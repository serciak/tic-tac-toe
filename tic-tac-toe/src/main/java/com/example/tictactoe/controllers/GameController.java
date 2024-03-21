package com.example.tictactoe.controllers;

import com.example.tictactoe.controllers.dto.ConnectRequest;
import com.example.tictactoe.models.Game;
import com.example.tictactoe.models.Move;
import com.example.tictactoe.models.Player;
import com.example.tictactoe.services.GameService;
import com.example.tictactoe.storage.GameStorage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@CrossOrigin
@AllArgsConstructor
@RequestMapping("/games")
public class GameController {
    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/create")
    public ResponseEntity<Game> create(@RequestBody Player player) {
        log.info("create game: {}", player);
        return ResponseEntity.ok(gameService.createGame(player));
    }

    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectRequest request) throws RuntimeException {
        log.info("connect to game: {}", request);
        Game game = gameService.connectToGame(request.getGameID(), request.getPlayer());

        simpMessagingTemplate.convertAndSend("/game/"+ game.getGameID() +"/status", game);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/connect/random")
    public ResponseEntity<Game> connectRandom(@RequestBody Player player) throws RuntimeException {
        log.info("random connect: {}", player);
        Game game = gameService.connectToRandomGame(player);

        simpMessagingTemplate.convertAndSend("/game/"+ game.getGameID() +"/status", game);
        return ResponseEntity.ok(game);
    }

    @MessageMapping("/{gameId}/move")
    @SendTo("/game/{gameId}/moves")
    public ResponseEntity<Game> makeMove(@RequestBody Move move) throws RuntimeException {
        log.info("move: {}", move);
        Game game = gameService.makeMove(move);
        log.info("after move game state: {}", game);

        simpMessagingTemplate.convertAndSend("/game/"+ game.getGameID() +"/status", game);
        return ResponseEntity.ok(game);
    }
}

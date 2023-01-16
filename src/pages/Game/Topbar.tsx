import { Room } from "colyseus.js";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    Box,
    Button,
    Divider,
    Paper,
    Typography,
    IconButton,
} from "@mui/material";
import type { GameRoomState } from "../../schema/GameRoomState";
import { useNavigate } from "react-router-dom";
import { Add, Remove } from "@mui/icons-material";
import ClientManager from "../../utils/ClientManager";
interface TopbarProps {
    gameRoom: Room<GameRoomState>;
    timer: number;
}

export default function Topbar(props: TopbarProps) {
    const { gameRoom, timer } = props;
    const navigate = useNavigate();

    const state = gameRoom.state;

    const roomTitle = () => {
        const gameState = state.state;
        if (gameState == "Waiting") {
            return `${state.roomName} (${state.players.size} / ${state.maxClients})`;
        } else if (gameState == "Night") {
            return `${state.round}번째 밤`;
        } else {
            return `${state.round}번째 낮`;
        }
    };

    const digitalTimer = useMemo(() => {
        const minute = Math.floor(timer / 60);
        const second = timer % 60;
        return `${minute.toString().padStart(2, "0")}:${second
            .toString()
            .padStart(2, "0")}`;
    }, [timer]);

    return (
        <React.Fragment>
            <Box
                sx={{
                    display: "flex",
                    overflow: "hidden",
                    alignItems: "center",
                }}
            >
                <Typography sx={{ margin: "1em" }}>{roomTitle()}</Typography>
                <div style={{ flex: "auto" }} />
                {gameRoom.sessionId == state.masterId &&
                    state.state == "Waiting" && (
                        <Button
                            variant="contained"
                            onClick={() => {
                                gameRoom.send("game.start.request");
                            }}
                        >
                            게임 시작
                        </Button>
                    )}
                <Button
                    sx={{ margin: "1em" }}
                    variant="contained"
                    onClick={() => {
                        navigate("/lobby");
                    }}
                >
                    나가기
                </Button>
            </Box>
            <Divider />
            {state.state != "Waiting" && (
                <React.Fragment>
                    <Box
                        sx={{
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {state.state == "Day" && (
                            <IconButton
                                color="primary"
                                onClick={() => {
                                    ClientManager.sendUseTimerTicket(
                                        "increase"
                                    );
                                }}
                            >
                                <Add />
                            </IconButton>
                        )}
                        <Typography>{digitalTimer}</Typography>
                        {state.state == "Day" && (
                            <IconButton
                                color="primary"
                                onClick={() => {
                                    ClientManager.sendUseTimerTicket(
                                        "decrease"
                                    );
                                }}
                            >
                                <Remove />
                            </IconButton>
                        )}
                    </Box>
                    <Divider />
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

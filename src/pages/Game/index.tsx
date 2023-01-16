import { Room } from "colyseus.js";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { ChatController, MuiChat } from "../../components/chat-ui-react";
import type { GameRoomState } from "../../schema/GameRoomState";
import ClientManager from "../../utils/ClientManager";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Topbar from "./Topbar";
import { Role } from "../../schema/Role";
import "../../styles/ChatStyle.css";

export default function Game() {
    const [searchParams] = useSearchParams();
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [chatCtl] = useState(
        new ChatController({
            showDateTime: true,
        })
    );
    const [needReload, setNeedReload] = useState(false);
    const [timer, setTimer] = useState(0);
    const [role, setRole] = useState<Role | undefined>();

    const showChatUI = () => {
        chatCtl.setActionRequest(
            {
                type: "text",
                always: true,
                placeholder: "채팅을 입력해 주세요.",
                myName:
                    ClientManager.gameRoom?.sessionId &&
                    ClientManager.gameRoom?.state.players.get(
                        ClientManager.gameRoom.sessionId
                    )?.name,
            },
            (response) => {
                ClientManager.sendChat(
                    response.value,
                    ClientManager.gameRoom!.sessionId,
                    ClientManager.gameRoom!.state.players.get(
                        ClientManager.gameRoom!.sessionId
                    )?.name
                );
            }
        );
    };

    const onJoinGame = useCallback((game: Room<GameRoomState>) => {
        window.history.replaceState(null, "", `/game/${game.id}`);
        game.onMessage("game.chat", (message) => {
            chatCtl.addMessage({
                type: "text",
                content: message.content,
                self: false,
                username:
                    message.clientId == game.state.masterId
                        ? `${message.name} (방장)`
                        : message.name,
            });
        });
        game.onMessage("game.sync.timer", (message) => {
            const timer = Math.round(
                message.timer - (Date.now() - message.serverTime) / 1000
            );
            setTimer(timer < 0 ? 0 : timer);
        });
        game.onMessage("game.event.roleAlloate", (message) => {
            const role: Role = message.role;
            setRole(role);
        });
        game.state.listen("state", onGameStateChange);
        game.onStateChange(() => {
            setNeedReload(true);
        });
    }, []);

    const onRoomStateChange = useCallback(() => {
        const state: GameRoomState = ClientManager.gameRoom!.state;
    }, []);

    const onGameStateChange = useCallback(
        (value: string, previousValue: string) => {
            if (value == "Waiting") {
                showChatUI();
            } else if (value == "Night") {
                if (role && role.team == "citizen") {
                    chatCtl.cancelActionRequest();
                } else {
                    const options: string[] = [];
                    ClientManager.gameRoom!.state.players.forEach((player) => {
                        options.push(player.name);
                    });
                    chatCtl.setActionRequest(
                        {
                            type: "text",
                            always: true,
                            placeholder: "능력을 사용할 사람을 입력해 주세요.",
                            myName:
                                ClientManager.gameRoom?.sessionId &&
                                ClientManager.gameRoom?.state.players.get(
                                    ClientManager.gameRoom.sessionId
                                )?.name,
                        },
                        (response) => {
                            ClientManager.sendChat(
                                response.value,
                                ClientManager.gameRoom!.sessionId,
                                "team",
                                ClientManager.gameRoom!.state.players.get(
                                    ClientManager.gameRoom!.sessionId
                                )?.name
                            );
                            if (options.includes(response.value)) {
                                ClientManager.sendUseSkill(response.value);
                            }
                        }
                    );
                }
            } else if (value == "Day") {
                showChatUI();
            } else if (value == "Voting") {
                const options: string[] = [];
                ClientManager.gameRoom!.state.players.forEach((player) => {
                    options.push(player.name);
                });
                chatCtl.setActionRequest(
                    {
                        type: "text",
                        always: true,
                        placeholder: "투표할 사람을 입력해 주세요.",
                        myName:
                            ClientManager.gameRoom?.sessionId &&
                            ClientManager.gameRoom?.state.players.get(
                                ClientManager.gameRoom.sessionId
                            )?.name,
                    },
                    (response) => {
                        ClientManager.sendChat(
                            response.value,
                            ClientManager.gameRoom!.sessionId,
                            ClientManager.gameRoom!.state.players.get(
                                ClientManager.gameRoom!.sessionId
                            )?.name
                        );
                        if (options.includes(response.value)) {
                            ClientManager.sendVote(response.value);
                        }
                    }
                );
            } else if (value == "Approving") {
                const options: any[] = [
                    { value: "true", text: "찬성" },
                    { value: "false", text: "반대" },
                ];
                chatCtl.setActionRequest(
                    {
                        type: "select",
                        options: options,
                    },
                    (response) => {
                        ClientManager.sendChat(
                            response.value,
                            ClientManager.gameRoom!.sessionId,
                            ClientManager.gameRoom!.state.players.get(
                                ClientManager.gameRoom!.sessionId
                            )?.name
                        );
                        ClientManager.sendApproval(Boolean(response.value));
                        showChatUI();
                    }
                );
            }
        },
        []
    );

    useEffect(() => {
        if (needReload) {
            setNeedReload(false);
            onRoomStateChange();
        }
    }, [needReload]);

    useEffect(() => {
        if (searchParams.get("mode") == "create") {
            const roomName = searchParams.get("roomName") || "$random";
            const maxClients = Number(searchParams.get("maxClients")) || 8;
            ClientManager.createGame(roomName, maxClients, "test").then(
                onJoinGame
            );
        } else if (roomId) {
            ClientManager.joinGame(roomId, "test")
                .then(onJoinGame)
                .catch((reason) => {
                    const message: string = reason.message;
                    if (message.includes("not found")) {
                        //TODO: 방 없음
                        navigate("/lobby");
                    }
                });
        }
        return () => {
            ClientManager.leaveGame();
        };
    }, []);

    if (ClientManager.gameRoom) {
        const gameRoom = ClientManager.gameRoom;
        const state = ClientManager.gameRoom.state;

        return (
            <React.Fragment>
                <Box
                    sx={{
                        height: "100%",
                        backgroundImage:
                            "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    }}
                >
                    <Paper
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            maxWidth: "640px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            bgcolor: "background.default",
                        }}
                        elevation={3}
                    >
                        <Topbar gameRoom={gameRoom} timer={timer} />
                        <Box sx={{ flex: "1 1 0%", minHeight: 0 }}>
                            <MuiChat chatController={chatCtl} />
                        </Box>
                    </Paper>
                </Box>
            </React.Fragment>
        );
    } else {
        return <React.Fragment></React.Fragment>;
    }
}

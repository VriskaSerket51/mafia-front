import {
    Box,
    Button,
    Container,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Room, RoomAvailable } from "colyseus.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { openCancelableDialog, openWaitDialog } from "../components/popup";
import ClientManager from "../utils/ClientManager";

interface RoomRowProps {
    room: RoomAvailable;
}

function RoomRow(props: RoomRowProps) {
    const { room } = props;
    return (
        <React.Fragment>
            <Link
                to={`/game/${room.roomId}`}
                style={{
                    justifyContent: "space-between",
                    textDecoration: "none",
                    fontSize: "0.9em",
                    padding: "0.4em",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        float: "left",
                        color: "black",
                    }}
                >
                    {`${room.metadata?.roomName}`}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        float: "right",
                        color: "gray",
                    }}
                >
                    {`${room.clients} / ${room.maxClients}`}
                </Box>
            </Link>
        </React.Fragment>
    );
}

function CreateRoomPanel() {
    const [errorText, setErrorText] = useState("");

    return (
        <React.Fragment>
            <Box
                sx={{
                    borderRadius: "16px",
                    width: "auto",
                    padding: "2em",
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography
                    variant="h5"
                    noWrap
                    sx={{
                        mr: 2,
                        fontWeight: 500,
                        color: "inherit",
                        textDecoration: "none",
                    }}
                >
                    방 만들기
                </Typography>
                <Box
                    component="form"
                    sx={{ mt: 1, padding: "0 30px 0" }}
                    action="/game"
                    onSubmit={(event: React.MouseEvent<HTMLFormElement>) => {
                        const data = new FormData(event.currentTarget);
                        const maxClients = Number(
                            data.get("maxClients")?.toString() || 0
                        );
                        if (maxClients < 0) {
                            event.preventDefault();
                            setErrorText("인원이 음수인가요..?");
                        }
                    }}
                >
                    <TextField
                        margin="normal"
                        fullWidth
                        id="roomName"
                        label="방 제목"
                        name="roomName"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="maxClients"
                        label="최대 인원 수"
                        type="number"
                        id="maxClients"
                        helperText={errorText}
                    />
                    <input type="hidden" name="mode" value="create" />
                    <Button type="submit" fullWidth variant="contained">
                        LOGIN
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    );
}

export default function Lobby() {
    const [rooms, setRooms] = useState<RoomAvailable[]>([]);

    const updateRooms = useCallback(() => {
        ClientManager.getAvailableRooms().then((rooms) => {
            setRooms(rooms);
        });
    }, []);

    useEffect(() => {
        updateRooms();
        const interval = setInterval(updateRooms, 5000);
        return () => clearInterval(interval);
    }, [updateRooms]);

    return (
        <React.Fragment>
            <Container
                maxWidth="md"
                sx={{
                    margin: "30px auto 50px",
                }}
            >
                <Paper>
                    <Box sx={{ padding: "50px 50px 30px 50px" }}>
                        <Stack spacing={2}>
                            {rooms.map((room) => {
                                return (
                                    <RoomRow key={room.roomId} room={room} />
                                );
                            })}
                        </Stack>
                        <Button
                            variant="contained"
                            onClick={() => {
                                openCancelableDialog("", <CreateRoomPanel />);
                            }}
                        >
                            게임 생성
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </React.Fragment>
    );
}

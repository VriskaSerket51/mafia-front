import * as Colyseus from "colyseus.js";
import { GameRoomState } from "../schema/GameRoomState";

class ClientManager {
    private client = new Colyseus.Client(
        `ws://${window.location.hostname}:${import.meta.env.VITE_API_PORT}`
    );
    public gameRoom?: Colyseus.Room<GameRoomState>;

    getAvailableRooms() {
        return this.client.getAvailableRooms(
            import.meta.env.VITE_COLYSEUS_GAME_ROOM
        );
    }

    createGame(roomName: string, maxClients: number, accessToken: string) {
        this.leaveGame();
        return this.client
            .create<GameRoomState>(import.meta.env.VITE_COLYSEUS_GAME_ROOM, {
                roomName: roomName,
                maxClients: maxClients,
                accessToken: accessToken,
            })
            .then((room) => {
                this.gameRoom = room;
                return room;
            });
    }

    joinOrCreateGame(accessToken: string) {
        this.leaveGame();
        return this.client
            .joinOrCreate<GameRoomState>(
                import.meta.env.VITE_COLYSEUS_GAME_ROOM,
                {
                    accessToken: accessToken,
                }
            )
            .then((room) => {
                this.gameRoom = room;
                return room;
            });
    }

    joinGame(roomId: string, accessToken: string) {
        this.leaveGame();
        return this.client
            .joinById<GameRoomState>(roomId, {
                accessToken: accessToken,
            })
            .then((room) => {
                this.gameRoom = room;
                return room;
            });
    }

    leaveGame() {
        if (this.gameRoom) {
            this.gameRoom.leave();
        }
    }

    sendEvent(type: string | number, message?: any) {
        if (this.gameRoom) {
            this.gameRoom.send(type, message);
        }
    }

    sendChat(
        content: string,
        clientId: string,
        type: string = "room",
        name?: string
    ) {
        this.sendEvent("game.chat", {
            content: content,
            clientId: clientId,
            type: type,
            name: name,
        });
    }

    sendUseTimerTicket(ticketType: "increase" | "decrease") {
        this.sendEvent("game.timerTicket.use.request", {
            ticketType: ticketType,
        });
    }

    sendVote(target: string) {
        this.sendEvent("game.vote.request", {
            target: target,
        });
    }

    sendApproval(approving: boolean) {
        this.sendEvent("game.approval.request", {
            approving: approving,
        });
    }

    sendUseSkill(target: string) {
        this.sendEvent("game.skill.use.request", {
            target: target,
        });
    }
}

export default new ClientManager();

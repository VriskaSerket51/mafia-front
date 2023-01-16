// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Player } from './Player'

export class GameRoomState extends Schema {
    @type("string") public roomName!: string;
    @type("number") public maxClients!: number;
    @type("string") public state!: string;
    @type("string") public masterId!: string;
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type("number") public round!: number;
}

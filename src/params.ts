import { PlayerInfo, playerRole } from "./type";

export class GameParams {
	private static _isServer: boolean = false;
	private static _operation: "nicolive" | undefined;

	public static liverId: string;
	public static get isOwner(): boolean {
		return this.liverId === g.game.selfId;
	}
	public static get isServer(): boolean {
		return GameParams._isServer;
	}
	public static playerInfo: PlayerInfo = {
		id: "",
		name: "",
		role: playerRole.none,
		accepted: false,
	};

	static init(): void {
		if (typeof window === "undefined") {
			this._isServer = true;
		} else {
			this._operation = "nicolive";
		}
	}
}

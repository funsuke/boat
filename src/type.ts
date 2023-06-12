export enum playerRole {
	entryPlayer = "選手参加者",
	player1 = "１号艇",
	player2 = "２号艇",
	player3 = "３号艇",
	player4 = "４号艇",
	player5 = "５号艇",
	player6 = "６号艇",
	gambler = "勝負師",
	none = "傍観者",
}

export interface PlayerInfo {
	id: string;
	name: string;
	role: playerRole;
}

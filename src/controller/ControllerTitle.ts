import {
	COEController, Action
} from "@akashic-extension/coe";

/**
 * タイトルシーンでの Action の種別
 */
export enum titleActionType {
	/**
	 * 選手参加
	 */
	entryPlayer = "entry_player",
	/**
	 * 選手不参加
	 */
	erasurePlayer = "erasure_player",
	/**
	 * 舟券購入
	 */
	entryGambler = "entry_gambler",
	/**
	 * 舟券非購入
	 */
	erasureGambler = "erasure_gambler",
	/**
	 * 名前取得
	 */
	// getName = "get_name",
}

/**
 * タイトルシーンでの Command の種別
 */
export enum titleCommandType {
	/**
	 * 選手人数の変更
	 */
	changePlayerNum = "change_playerNum",
	/**
	 * 勝負人数の変更
	 */
	changeGamblerNum = "change_gamblerNum",
	/**
	 * 名を与える
	 */
	// giveName = "give_name",
}

/**
 * タイトルシーンの ActionData
 */
export type TitleActionData = EntryPlayerAction | ErasurePlayerAction;

/**
 * プレイヤー参加
 */
export interface EntryPlayerAction {
	type: titleActionType;
	info: PlayerInfo;
}

/**
 * プレイヤー参加拒否
 */
export interface ErasurePlayerAction {
	type: titleActionType;
}

/**
 * タイトルシーンの Command
 */
export type TitleCommand = ChangePlayerNumCommand;

/**
 * 人数が変化した時の Command
 */
export interface ChangePlayerNumCommand {
	type: titleCommandType;
	num: number;
}


// export interface GivePlayerName {
// 	type: titleCommandType;
// 	playerInfo: PlayerInfo;
// }

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

/**
 * タイトル用 Controller
 */
export class ControllerTitle extends COEController<TitleCommand, TitleActionData> {
	private playersInfo: PlayerInfo[] = [];
	private gamblersInfo: PlayerInfo[] = [];

	/**
	 * コンストラクタ
	 */
	constructor() {
		console.log("********ControllerTitle::constructor");
		//
		super();
		// Action の受信トリガの登録
		this.onActionReceive.add(this.onActionReceived, this);
	}

	/**
	 * コントローラ破棄時処理
	 */
	destroy(): void {
		// Action の受信トリガを解除
		this.onActionReceive.remove(this.onActionReceived, this);
		super.destroy();
	}

	/**
	 * Action 受取時の処理
	 *
	 * @param action Action
	 */
	onActionReceived(action: Action<TitleActionData>): void {
		// debug
		console.log("********ControllerTitle::onActionReceived");
		// Action.dataの判定
		const data = action.data;
		if (data == null) return;
		if (action.player.id == null) return;
		// プレイヤー情報の更新
		this.updatePlayersInfo(data, action.player.id);
		// broadcast の設定
		let command: ChangePlayerNumCommand;
		switch (data.type) {
			// Actionが選手だった場合
			case titleActionType.entryPlayer:
			case titleActionType.erasurePlayer:
				//
				command = {
					type: titleCommandType.changePlayerNum,
					num: this.playersInfo.length,
				};
				break;
			// Actionが勝負参加だった場合
			case titleActionType.entryGambler:
			case titleActionType.erasureGambler:
				command = {
					type: titleCommandType.changeGamblerNum,
					num: this.gamblersInfo.length,
				};
				break;
			// その他(データが壊れてる時しか入らないか？) start?いつ
			default:
				return;
		}
		// numの調整(無いと思うが)
		// パラメータをブロードキャスト
		this.broadcast(command);
		// debug
		console.log("****ControllerTitle::updatePlayersInfo");
		console.log("player");
		for (let i = 0; i < this.playersInfo.length; i++) {
			console.log(this.playersInfo[i].name);
		}
		console.log("gambler");
		for (let i = 0; i < this.gamblersInfo.length; i++) {
			console.log(this.gamblersInfo[i].name);
		}
	}

	/**
	 * 選手情報の更新
	 * @param data TitleActionData
	 * @param id string
	 */
	private updatePlayersInfo(data: TitleActionData, id: string): void {
		console.log("ControllerTitle::updatePlayerInfo");
		switch (data.type) {
			case titleActionType.entryPlayer:
				this.playersInfo.push((data as EntryPlayerAction).info);
				break;
			case titleActionType.erasurePlayer:
				this.removePlayerInfoById(this.playersInfo, id);
				break;
			case titleActionType.entryGambler:
				this.gamblersInfo.push((data as EntryPlayerAction).info);
				break;
			case titleActionType.erasureGambler:
				this.removePlayerInfoById(this.gamblersInfo, id);
				break;
		}
	}

	/**
	 * PlayerInfo 配列から指定 ID の要素を削除
	 * @param array PlayerInfo[]
	 * @param idToRemove string
	 */
	private removePlayerInfoById(array: PlayerInfo[], idToRemove: string): void {
		for (let i = 0; i < array.length; i++) {
			if (array[i].id === idToRemove) {
				array.splice(i, 1);
				break;
			}
		}
	}

	/**
	 * プレイヤー名が無いときの選手名
	 * @param num number
	 * @returns string
	 */
	private getPlayerName(playerInfo: PlayerInfo, num: number): void {
		if (num <= 0) {
			if (playerInfo.role === playerRole.entryPlayer) {
				playerInfo.name = "名無しの選手";
			} else if (playerInfo.role === playerRole.gambler) {
				playerInfo.name = "名無しのギャンブラー";
			}
		} else {
			if (playerInfo.role === playerRole.entryPlayer) {
				playerInfo.name = "選手" + this.get26Decimal(num);
			} else if (playerInfo.role === playerRole.gambler) {
				playerInfo.name = "勝負師" + this.get26Decimal(num);
			}
		}
	}

	/**
	 * number を 26(alphabet)進数の string に変換する
	 * @param num number
	 * @returns string
	 */
	private get26Decimal(num: number): string {
		if (num <= 0) return "";
		let i: number = num - 1;
		let retStr: string = "";
		do {
			retStr = String.fromCharCode(65 + (i % 26)) + retStr;
			i = Math.floor(i / 26) - 1;
		} while (i >= 0);
		return retStr;
	}
}

import {
	COEController, Action
} from "@akashic-extension/coe";

/**
 * タイトルシーンでの Entry_Action の種別
 */
export const enum titleActionEntryType {
	/**
	 * 選手参加
	 */
	player = "entry_player",
	/**
	 * 勝負師参加
	 */
	gambler = "entry_gambler",
}

/**
 * タイトルシーンでの Erasure_Action の種別
 */
export const enum titleActionErasureType {
	/**
	 * 選手不参加
	 */
	player = "erasure_player",
	/**
	 * 勝負師不参加
	 */
	gambler = "erasure_gambler",
}

/**
 * シーン操作用の Action の種別
 */
export const enum titleActionChangeSceneType {
	nextScene = "next_scene",
}

/**
 * タイトルシーンでの Command の種別
 */
export const enum titleCommandChangePlayerType {
	/**
	 * 選手人数の変更
	 */
	changePlayerNum = "change_playerNum",
	/**
	 * 勝負師人数の変更
	 */
	changeGamblerNum = "change_gamblerNum",
}

/**
 * シーン操作用の Command の種別
 */
export const enum titleCommandChangeSceneType {
	nextScene = "next_scene",
}

/**
 * タイトルシーンの ActionData
 */
export type TitleAction = ActionEntryPlayer | ActionErasurePlayer | ActionChangeScene;

/**
 * プレイヤー参加
 */
export interface ActionEntryPlayer {
	type: titleActionEntryType;
}

/**
 * プレイヤー参加拒否
 */
export interface ActionErasurePlayer {
	type: titleActionErasureType;
}

/**
 * シーン操作
 */
export interface ActionChangeScene {
	type: titleActionChangeSceneType;
}

/**
 * タイトルシーンの Command
 */
export type TitleCommand = CommandChangePlayer | CommandChangeScene;

/**
 * 人数が変化した時の Command
 */
export interface CommandChangePlayer {
	type: titleCommandChangePlayerType;
	num: number;
}

/**
 * シーンを変更するようにする Command
 */
export interface CommandChangeScene {
	type: titleCommandChangeSceneType;
}

/**
 * タイトル用 Controller
 */
export class ControllerTitle extends COEController<TitleCommand, TitleAction> {
	private playerNum: number = 0;
	private gamblerNum: number = 0;

	/**
	 * コンストラクタ
	 */
	constructor() {
		console.log("******* controllerTitle::constructor");
		//
		super();
		// Action の受信トリガの登録
		this.onActionReceive.add(this.onActionReceived, this);
	}

	/**
	 * コントローラ破棄時処理
	 */
	destroy(): void {
		console.log("******* controllerTitle::destroy");
		// Action の受信トリガを解除
		this.onActionReceive.remove(this.onActionReceived, this);
		super.destroy();
	}

	/**
	 * Action 受取時の処理
	 *
	 * @param action Action
	 */
	onActionReceived(action: Action<TitleAction>): void {
		// debug
		console.log("******* controllerTitle::onActionReceived");
		// Action.dataの判定
		const data = action.data;
		if (data == null) return;
		if (action.player.id == null) return;
		// // プレイヤー情報の更新
		// this.updatePlayersInfo(data, action.player.id);
		// broadcast の設定
		let command: TitleCommand;
		switch (data.type) {
			// Actionが選手参加だった場合
			case titleActionEntryType.player:
				command = {
					type: titleCommandChangePlayerType.changePlayerNum,
					num: ++this.playerNum,
				};
				break;
			// Actionが選手不参加だった場合
			case titleActionErasureType.player:
				command = {
					type: titleCommandChangePlayerType.changePlayerNum,
					num: --this.playerNum,
				};
				break;
			// Actionが勝負参加だった場合
			case titleActionEntryType.gambler:
				command = {
					type: titleCommandChangePlayerType.changeGamblerNum,
					num: ++this.gamblerNum,
				};
				break;
			// Actionが勝負不参加だった場合
			case titleActionErasureType.gambler:
				command = {
					type: titleCommandChangePlayerType.changeGamblerNum,
					num: --this.gamblerNum,
				};
				break;
			// 次のシーンへ行く Action の場合
			case titleActionChangeSceneType.nextScene:
				command = {
					type: titleCommandChangeSceneType.nextScene,
				};
				break;
			// その他(データが壊れてる時しか入らないか？) start?いつ
			default:
				console.log("未知の data.type でした");
				return;
		}
		// パラメータをブロードキャスト
		this.broadcast(command);
		// debug
		console.log("******* controllerTitle::onActionReceived");
		console.log("player  : " + this.playerNum);
		console.log("gambler : " + this.gamblerNum);
	}

	/**
	 * 選手情報の更新
	 * @param data TitleActionData
	 * @param id string
	 */
	// private updatePlayersInfo(data: TitleAction, id: string): void {
	// 	console.log("********ControllerTitle::updatePlayerInfo");
	// 	switch (data.type) {
	// 		case titleActionEntryType.player:
	// 			this.playersInfo.push((data as ActionEntryPlayer).info);
	// 			break;
	// 		case titleActionErasureType.player:
	// 			this.removePlayerInfoById(this.playersInfo, id);
	// 			break;
	// 		case titleActionEntryType.gambler:
	// 			this.gamblersInfo.push((data as ActionEntryPlayer).info);
	// 			break;
	// 		case titleActionErasureType.gambler:
	// 			this.removePlayerInfoById(this.gamblersInfo, id);
	// 			break;
	// 	}
	// }

	/**
	 * PlayerInfo 配列から指定 ID の要素を削除
	 * @param array PlayerInfo[]
	 * @param idToRemove string
	 */
	// private removePlayerInfoById(array: PlayerInfo[], idToRemove: string): void {
	// 	for (let i = 0; i < array.length; i++) {
	// 		if (array[i].id === idToRemove) {
	// 			array.splice(i, 1);
	// 			break;
	// 		}
	// 	}
	// }
}

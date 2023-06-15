import { Action, COEController } from "@akashic-extension/coe";
import { MakeName } from "../makeName";
import { PlayerInfo, playerRole } from "../type";

/**
 * タイトルシーンでの GetName_Action の種別
 */
export const enum selectActionGetNameType {
	/**
	 * 名前(ななし)の取得
	 */
	getName = "get_name",
}

export const enum selectActionTerminalType {
	terminal = "terminal",
}

/**
 * 名前を与える
 */
export const enum selectCommandGiveNameType {
	giveName = "give_name",
}

/**
 * ターミナル
 */
export const enum selectCommandTerminalType {
	terminal = "terminal",
}

export type SelectAction = ActionGetName | ActionTerminal;

/**
 * 名前(ななし)の取得する Action
 */
export interface ActionGetName {
	type: selectActionGetNameType;
	info: PlayerInfo;
}

/**
 * ターミナル Action
 */
export interface ActionTerminal {
	type: selectActionTerminalType;
}

export type SelectCommand = CommandGiveName | CommandTerminal;

/**
 * 名前を与えるときの Command
 */
export interface CommandGiveName {
	type: selectCommandGiveNameType;
	info: PlayerInfo;
}

export interface CommandTerminal {
	type: selectCommandTerminalType;
	info: null;
}

export class ControllerSelect extends COEController<SelectCommand, SelectAction> {
	private noNamePlayerNum: number = 0;
	private noNameGamblerNum: number = 0;
	/**
	 * コンストラクタ
	 */
	constructor() {
		console.log("******* controllerSelect::constructor");
		//
		super();
		// Action の受信トリガの登録
		this.onActionReceive.add(this.onActionReceived, this);
	}
	/**
	 * コントローラ破棄時処理
	 */
	destroy(): void {
		console.log("******* controllerSelect::destroy");
		// Action の受信トリガを解除
		this.onActionReceive.remove(this.onActionReceived, this);
		super.destroy();
	}
	/**
	 * Action 受取時の処理
	 *
	 * @param action Action
	 */
	onActionReceived(action: Action<SelectAction>): void {
		// debug
		console.log("******* controllerSelect::onActionReceived");
		console.log(`id   : ${action.player.id}`);
		console.log(`name : ${action.player.name}`);
		// Action.dataの判定
		const data = action.data;
		if (data == null) return;
		if (action.player.id == null) return;
		// broadcast の設定
		let command: SelectCommand;
		switch (data.type) {
			/**
			 * 名前を取得する
			 */
			case selectActionGetNameType.getName:
				if (data.info.role === playerRole.entryPlayer) {
					data.info.name = MakeName.get(data.info.role, this.noNamePlayerNum);
					this.noNamePlayerNum++;
				} else if (data.info.role === playerRole.gambler) {
					data.info.name = MakeName.get(data.info.role, this.noNameGamblerNum);
					this.noNameGamblerNum++;
				} else {
					return;
				}
				command = {
					type: selectCommandGiveNameType.giveName,
					info: data.info,
				};
				break;
			case selectActionTerminalType.terminal:
				this.broadcast({ type: selectCommandTerminalType.terminal, info: null });
				return;
			default:
				console.log("未知の Action.data.type です");
				return;
		}
		// パラメータをブロードキャスト
		this.broadcast(command);
	}
}

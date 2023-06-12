import { Action, COEController } from "@akashic-extension/coe";

export type SelectAction = {};

export type SelectCommand = {};

export class ControllerSelect extends COEController<SelectCommand, SelectAction> {
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
	 * @param action Action
	 */
	private onActionReceived(action: Action<SelectAction>): void {
		;
	}
}

import { Label } from "@akashic-extension/akashic-label";
import { Scene, initialize } from "@akashic-extension/coe";
import {
	ControllerSelect,
	SelectAction, SelectCommand,
	selectActionGetNameType, selectActionTerminalType, selectCommandGiveNameType
} from "../controller/controllerSelect";
import { EntitiesTitleScene, createMinimumDynamicFont } from "../createEntity";
import { GameParams } from "../params";
import { playerRole } from "../type";

const game: g.Game = g.game;

export class SceneSelect extends Scene<SelectCommand, SelectAction> {
	private sceneParam: g.SceneParameterObject;
	private args: g.GameMainParameterObject;
	private font: g.Font;
	private lblName: g.Label;
	private lblDebug: Label;
	constructor(sceneParam: g.SceneParameterObject, args: g.GameMainParameterObject) {
		// debug
		console.log("******* sceneSelect::constructor");
		// -----------------------------
		// COEフレームワーク
		// -----------------------------
		// 初期化
		initialize({ game, args });
		// コントローラ
		const controller = new ControllerSelect();
		// -----------------------------
		// (COE)Scene
		// -----------------------------
		super({
			game,
			controller,
			assetIds: sceneParam.assetIds,
		});
		this.sceneParam = sceneParam;
		this.args = args;
		// -----------------------------
		// エンティティ
		// -----------------------------
		// フォント
		this.font = createMinimumDynamicFont();
		// ラベル
		this.lblName = EntitiesTitleScene.createLblPlayer(this, this.font);
		// デバッグラベル
		this.lblDebug = new Label({
			scene: this,
			font: this.font,
			text: "",
			width: g.game.width,
			height: g.game.height,
			y: 80,
		});
		this.lblDebug.onUpdate.add(ev => {
			this.lblDebug.text = "myPlayer:\n";
			this.lblDebug.text += `id   : ${GameParams.playerInfo.id}\n`;
			this.lblDebug.text += `name : ${GameParams.playerInfo.name}\n`;
			this.lblDebug.text += `role : ${GameParams.playerInfo.role}\n`;
			this.lblDebug.text += `acpt : ${GameParams.playerInfo.accepted}\n`;
			this.lblDebug.invalidate();
		});
		// -----------------------------
		// メソッド登録
		// -----------------------------
		this.onLoad.addOnce(this.onLoaded, this);
		this.commandReceived.add(this.onCommandReceived, this);
	}
	private onLoaded(): void {
		console.log("******* sceneSelect::onLoaded");
		// -----------------------------
		// エンティティ
		// -----------------------------
		let playerInfo = GameParams.playerInfo;
		// タイトル
		let sprTitle: g.Sprite;
		if (playerInfo.role === playerRole.entryPlayer) {
			sprTitle = EntitiesTitleScene.createSprTitlePlayer(this);
		} else if (playerInfo.role === playerRole.gambler) {
			sprTitle = EntitiesTitleScene.createSprTitleGambler(this);
		} else {
			sprTitle = EntitiesTitleScene.createSprTitle(this);
		}
		this.append(sprTitle);
		// ラベル
		this.append(this.lblDebug);
		// 名前取得してない場合、ランダム名を controller から取得
		if (playerInfo.role === playerRole.entryPlayer || playerInfo.role === playerRole.gambler) {
			if (!playerInfo.accepted) {
				this.send({ type: selectActionGetNameType.getName, info: GameParams.playerInfo });
				console.log(`${GameParams.playerInfo.id} が send しました`);
			}
		}
	}
	private onCommandReceived(command: SelectCommand): void {
		// debug
		console.log("******* sceneSelect::onCommandReceived");
		console.log("command.type = " + command.type);
		if (command.info != null) {
			console.log("playerId : " + command.info.id);
		}
		// コマンドの種類の判定
		if (command.type === selectCommandGiveNameType.giveName) {
			if (command.info?.id === GameParams.playerInfo.id) {
				// ディープコピーした方が良さそうだけど...
				GameParams.playerInfo.name = command.info.name;
				console.log("name : " + GameParams.playerInfo.name);
			}
		} else {
			console.log("未知の command.type でした");
			return;
		}
		// 2秒後に1回send... もっと良い解決策あるような気がする...
		if (GameParams.liverId = GameParams.playerInfo.id) {
			this.setTimeout(() => {
				this.send({ type: selectActionTerminalType.terminal });
			}, 2000);
		}
	}
}

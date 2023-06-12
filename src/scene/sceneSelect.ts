import { Label } from "@akashic-extension/akashic-label";
import { Scene, initialize } from "@akashic-extension/coe";
import { ControllerSelect, SelectAction, SelectCommand } from "../controller/controllerSelect";
import { EntitiesTitleScene, createMinimumDynamicFont } from "../createEntity";
import { GameParams } from "../params";
import { playerRole } from "../type";

const game: g.Game = g.game;

export class SceneSelect extends Scene<SelectCommand, SelectAction> {
	private sceneParam: g.SceneParameterObject;
	private args: g.GameMainParameterObject;
	private font: g.Font;
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
		// デバッグラベル
		this.lblDebug = new Label({
			scene: this,
			font: this.font,
			text: "",
			width: g.game.width,
			height: g.game.height,
		});
		this.lblDebug.onUpdate.add(ev => {
			this.lblDebug.text = "myPlayer:\n";
			this.lblDebug.text += `id   : ${GameParams.playerInfo.id}\n`;
			this.lblDebug.text += `name : ${GameParams.playerInfo.name}\n`;
			this.lblDebug.text += `role : ${GameParams.playerInfo.role}\n`;
			this.lblDebug.invalidate();
		});
		// -----------------------------
		// メソッド登録
		// -----------------------------
		this.onLoad.addOnce(this.onLoaded, this);
	}
	private onLoaded(): void {
		// -----------------------------
		// エンティティ
		// -----------------------------
		// タイトル
		let sprTitle: g.Sprite;
		if (GameParams.playerInfo.role === playerRole.entryPlayer) {
			sprTitle = EntitiesTitleScene.createSprTitlePlayer(this);
		} else if (GameParams.playerInfo.role === playerRole.gambler) {
			sprTitle = EntitiesTitleScene.createSprTitleGambler(this);
		} else {
			sprTitle = EntitiesTitleScene.createSprTitle(this);
		}
		this.append(sprTitle);
		// ラベル
		this.append(this.lblDebug);
	}
}

import { Scene, initialize } from "@akashic-extension/coe";
import {
	ChangePlayerNumCommand,
	ControllerTitle,
	PlayerInfo,
	TitleActionData, TitleCommand, playerRole, titleActionType, titleCommandType
} from "./controller/ControllerTitle";

const game = g.game;

export class SceneEntry extends Scene<TitleCommand, TitleActionData> {
	private font: g.Font;
	private lblPlayerNum: g.Label;
	private lblGamblerNum: g.Label;
	private lblDebug: g.Label;
	private playerInfo: PlayerInfo;

	/**
	 * コンストラクタ
	 * @param scene シーン
	 * @param playerInfo プレイヤー情報
	 * @param param ゲームパラメータ
	 */
	constructor(playerInfo: PlayerInfo, args: g.GameMainParameterObject) {
		// -----------------------------
		// COEフレームワーク
		// -----------------------------
		// 初期化
		initialize({ game, args });
		// コントローラ
		const controller = new ControllerTitle();
		// -----------------------------
		// (COE)Scene
		// -----------------------------
		super({
			game,
			controller,
			assetIds: ["title", "button"],
		});
		// -----------------------------
		// プロパティ
		// -----------------------------
		// フォント
		this.font = new g.DynamicFont({
			game,
			fontFamily: "monospace",
			size: 24,
		});
		// ラベル
		// ※恐らくこの時点でg.SceneのonLoadイベントがfireされてないので、onLoadedでappend等する
		this.lblPlayerNum = new g.Label({
			scene: this,
			font: this.font,
			fontSize: 40,
			text: "0人参加",
			x: 200,
			y: 600,
		});
		this.lblGamblerNum = new g.Label({
			scene: this,
			font: this.font,
			fontSize: 40,
			text: "0人参加",
			x: 700,
			y: 600,
		});
		this.lblDebug = new g.Label({
			scene: this,
			font: this.font,
			fontSize: 40,
			text: "",
			x: 0,
			y: 0,
		});
		// プレイヤー情報
		this.playerInfo = playerInfo;
		// メソッド登録
		this.onLoad.addOnce(this.onLoaded, this);
		this.commandReceived.add(this.onCommandReceived, this);
	}

	/**
	 * 読み込み時処理
	 */
	private onLoaded(): void {
		// -----------------------------
		// アセット
		// -----------------------------
		// タイトル
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("title"),
			parent: this,
		});
		// エントリーボタン
		const btnName = new g.FrameSprite({
			scene: this,
			src: this.asset.getImageById("button"),
			width: 400,
			height: 80,
			x: 200,
			y: 500 - 160,
			frames: [8, 9],
			frameNumber: 1,
			touchable: true,
			local: true,
			parent: this,
		});
		btnName.onPointDown.add(ev => {
			g.game.popScene();
		});
		// プレイヤー名
		const lblName = new g.Label({
			scene: this,
			font: this.font,
			fontSize: 40,
			text: "",
			x: 700,
			y: btnName.y + 10,
			parent: this,
		});
		lblName.onUpdate.add(() => {
			if (this.playerInfo.name !== "") {
				lblName.text = this.playerInfo.name;
				lblName.invalidate();
			}
		});

		// 選手参加ボタン
		const btnPlayer = new g.FrameSprite({
			scene: this,
			src: this.asset.getImageById("button"),
			width: 400,
			height: 80,
			x: 200,
			y: 500,
			frames: [4, 5],
			frameNumber: 0,
			touchable: true,
			local: true,
			parent: this,
		});
		// 選手参加ボタン押下時イベント
		btnPlayer.onPointDown.add((ev) => {
			if (ev.player == null) return;
			if (ev.player.id == null) return;
			if (btnPlayer.frameNumber === 0) {
				// プレイヤー情報の取得
				// this.playerInfo.name = playerName;
				this.playerInfo.role = playerRole.entryPlayer;
				// コントローラーに ActionData を送る
				console.log("send_entryPlayer");
				this.send({
					type: titleActionType.entryPlayer,
					info: this.playerInfo,
				});
				btnPlayer.frameNumber = 1;
				btnGambler.touchable = false;
			} else {
				this.playerInfo.role = playerRole.none;
				// コントローラーに ActionData を送る
				console.log("send_erasurePlayer");
				this.send({
					type: titleActionType.erasurePlayer,
				});
				btnPlayer.frameNumber = 0;
				btnGambler.touchable = true;
			}
			btnPlayer.modified();
		});
		// -----------------------------
		// ギャンブラー参加ボタン
		// -----------------------------
		const btnGambler = new g.FrameSprite({
			scene: this,
			src: this.asset.getImageById("button"),
			width: 400,
			height: 80,
			x: 700,
			y: 500,
			frames: [6, 7],
			frameNumber: 0,
			touchable: true,
			local: true,
			parent: this,
		});
		// ギャンブラー参加ボタン押下時イベント
		btnGambler.onPointDown.add((ev) => {
			if (ev.player == null) return;
			if (ev.player.id == null) return;
			if (btnGambler.frameNumber === 0) {
				// プレイヤー情報の取得
				this.playerInfo.role = playerRole.gambler;
				// コントローラーに ActionData を送る
				console.log("send_entryGambler");
				this.send({
					type: titleActionType.entryGambler,
					info: this.playerInfo,
				});
				btnGambler.frameNumber = 1;
				btnPlayer.touchable = false;
			} else {
				// プレイヤー情報の抹消
				// this.playerInfo = {
				// 	id: ev.player?.id,
				// 	role: playerRole.none,
				// 	name: "",
				// };
				this.playerInfo.role = playerRole.none;
				// コントローラーに ActionData を送る
				console.log("send_erasureGambler");
				this.send({
					type: titleActionType.erasureGambler,
				});
				btnGambler.frameNumber = 0;
				btnPlayer.touchable = true;
			}
			btnGambler.modified();
		});
		// -----------------------------
		// ラベル
		// -----------------------------
		this.append(this.lblPlayerNum);
		this.append(this.lblGamblerNum);
		this.append(this.lblDebug);
	}

	/**
	 * Controller から Command を受信した際の処理
	 * @param command Command
	 */
	private onCommandReceived(command: TitleCommand): void {
		// debug
		console.log("********SceneEntry::onCommandReceived");
		console.log(`${(command as ChangePlayerNumCommand).num}人参加中`);
		//
		let label: g.Label;
		// コマンドの種類の判定
		if (command.type === titleCommandType.changePlayerNum) {
			label = this.lblPlayerNum;
		} else if (command.type === titleCommandType.changeGamblerNum) {
			label = this.lblGamblerNum;
		} else {
			return;
		}
		// 名前が無い場合、名前を取得
		// if (this.playerInfo.name === "") {
		// 	this.getPlayerName(command.num - 1);
		// }
		// 人数の変更
		label.text = `${command.num}人参加中`;
		label.invalidate();
	}

}

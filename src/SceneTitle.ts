import {
	Scene, SceneParameters, initialize
} from "@akashic-extension/coe";
import { PlayerInfo as GetPlayerInfo, resolvePlayerInfo } from "@akashic-extension/resolve-player-info";
import {
	TitleActionData, TitleCommand, ControllerTitle, titleActionType, titleCommandType
} from "./controller/ControllerTitle";

export interface TitleSceneParameter extends SceneParameters<TitleCommand, TitleActionData> {
	//
}

enum playerRole {
	player = "選手",
	gambler = "勝負師",
	none = "傍観者",
}

interface PlayerInfo {
	role: playerRole;
	name: string;
}

const game: g.Game = g.game;

/**
 * タイトルシーン (COE でいう View でもある)
 */
export class SceneTitle extends Scene<TitleCommand, TitleActionData> {
	private font: g.Font;
	private lblPlayerNum: g.Label;
	private lblGamblerNum: g.Label;
	private playerInfo: PlayerInfo = { role: playerRole.none, name: "" };
	/**
	 * コンストラクタ
	 * @param param ゲームパラメータ
	 */
	constructor(param: g.GameMainParameterObject) {
		// -----------------------------
		// COEフレームワーク
		// -----------------------------
		// 初期化
		initialize({ game, args: param });
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
			game: g.game,
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
		// メソッド登録
		this.onLoad.addOnce(this.onLoaded, this);
		this.commandReceived.add(this.onCommandReceived, this);
	}
	/**
	 * Scene 読み込み時処理
	 */
	private onLoaded(): void {
		const version: string = "ver. 0.01";
		// -----------------------------
		// タイトル
		// -----------------------------
		new g.Sprite({
			scene: this,
			src: this.asset.getImageById("title"),
			parent: this,
		});
		// -----------------------------
		// バージョン情報
		// -----------------------------
		new g.Label({
			scene: this,
			font: this.font,
			fontSize: 24,
			text: version,
			textColor: "black",
			parent: this,
		});
		// -----------------------------
		// 選手参加ボタン
		// -----------------------------
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
			parent: this,
		});
		btnPlayer.onPointDown.add((ev) => {
			if (btnPlayer.frameNumber === 0) {
				// プレイヤー情報の取得
				this.playerInfo.role = playerRole.player;
				resolvePlayerInfo({ raises: false }, this.setPlayerName);
				// コントローラーに ActionData を送る
				this.send({
					type: titleActionType.entryPlayer,
					name: this.playerInfo.name,
				});
				btnPlayer.frameNumber = 1;
				btnGambler.touchable = false;
			} else {
				// プレイヤー情報の抹消
				this.playerInfo = {
					role: playerRole.none,
					name: "",
				};
				// コントローラーに ActionData を送る
				this.send({
					type: titleActionType.erasurePlayer,
					name: this.playerInfo.name,
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
			parent: this,
		});
		btnGambler.onPointDown.add((ev) => {
			if (btnGambler.frameNumber === 0) {
				// プレイヤー情報の取得
				this.playerInfo.role = playerRole.gambler;
				resolvePlayerInfo({ raises: false }, this.setPlayerName);
				// コントローラーに ActionData を送る
				this.send({
					type: titleActionType.entryGambler,
					name: this.playerInfo.name,
				});
				btnGambler.frameNumber = 1;
				btnPlayer.touchable = false;
			} else {
				// プレイヤー情報の抹消
				this.playerInfo = {
					role: playerRole.none,
					name: "",
				};
				// コントローラーに ActionData を送る
				this.send({
					type: titleActionType.erasureGambler,
					name: this.playerInfo.name,
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
	}
	/**
	 * Controller から Command を受信した際の処理
	 * @param command Command
	 */
	private onCommandReceived(command: TitleCommand): void {
		console.log("********TitleScene::onCommandReceived_in");
		console.log("command.type = " + command.type);
		console.log("command.num  = " + command.num);
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
		if (this.playerInfo.name === "") {
			this.getPlayerName(command.num - 1);
		}
		// 人数の変更
		label.text = `${command.num}人参加中`;
		label.invalidate();
	}

	/**
	 * 効果音を先生する
	 * @param name 再生するアセットID
	 */
	private playSound(name: string): void {
		(this.asset.getAudioById(name) as g.AudioAsset).play().changeVolume(0.8);
	}

	/**
	 * プレイヤー名ダイアログ応答時処理
	 */
	private setPlayerName(err: Error | null, playerInfo: GetPlayerInfo | undefined): void {
		if (err != null) return;
		if (playerInfo == null) return;
		if (playerInfo.userData.accepted && playerInfo.name != null) {
			this.playerInfo.name = playerInfo.name;
		}
	}

	/**
	 * プレイヤー名が無いときの選手名
	 * @param num number
	 * @returns string
	 */
	private getPlayerName(num: number): void {
		if (num <= 0) {
			if (this.playerInfo.role === playerRole.player) {
				this.playerInfo.name = "名無しの選手";
			} else if (this.playerInfo.role === playerRole.gambler) {
				this.playerInfo.name = "名無しのギャンブラー";
			}
		} else {
			if (this.playerInfo.role === playerRole.player) {
				this.playerInfo.name = "選手" + this.get26Decimal(num);
			} else if (this.playerInfo.role === playerRole.gambler) {
				this.playerInfo.name = "勝負師" + this.get26Decimal(num);
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

/**
 * プレイヤーダイアログ応答時
 */
// g.game

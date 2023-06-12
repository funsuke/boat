import al = require("@akashic-extension/akashic-label");
import { Scene, initialize } from "@akashic-extension/coe";
// import { resolvePlayerInfo, PlayerInfo as GetPlayerInfo } from "@akashic-extension/resolve-player-info";
import { resolvePlayerInfo } from "@akashic-extension/resolve-player-info";
import {
	ControllerTitle,
	TitleAction, TitleCommand,
	titleActionChangeSceneType,
	titleActionEntryType, titleActionErasureType, titleCommandChangePlayerType, titleCommandChangeSceneType
} from "../controller/controllerTitle";
import { EntitiesTitleScene, createMinimumDynamicFont } from "../createEntity";
import { Button } from "../entityButton";
import { MakeName } from "../makeName";
import { GameParams } from "../params";
import { PlayerInfo, playerRole } from "../type";
import { SceneSelect } from "./sceneSelect";

interface PlayerInfos {
	[id: string]:
	{
		name: string;
		role: string;
	};
};

const game: g.Game = g.game;
/**
 * タイトルシーン
 */
export class SceneEntry extends Scene<TitleCommand, TitleAction> {
	private sceneParam: g.SceneParameterObject;
	private args: g.GameMainParameterObject;
	private font: g.DynamicFont;
	private lblPlayerNum: g.Label;
	private lblGamblerNum: g.Label;
	// private lblName: g.Label;
	private lblDebug: al.Label;
	private myInfo: PlayerInfo;
	private playerInfos: PlayerInfos = {};
	private playerNum: number = 0;
	private gamblerNum: number = 0;
	private pushPlayerId: string = "";
	private timerIdentifer: g.TimerIdentifier | undefined;
	private timeClosing: number = 0;
	/**
	 * コンストラクタ
	 * @param scene シーン
	 * @param playerInfo プレイヤー情報
	 * @param param ゲームパラメータ
	 */
	// constructor(sceneParam: g.SceneParameterObject, args: g.GameMainParameterObject) {
	constructor(sceneParam: g.SceneParameterObject, args: g.GameMainParameterObject) {
		// debug
		console.log("******* sceneEntry2::constructor");
		console.log("GameParams.liverId : " + GameParams.liverId);
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
			assetIds: sceneParam.assetIds,
		});
		this.sceneParam = sceneParam;
		this.args = args;
		// -----------------------------
		// プロパティの初期化など
		// -----------------------------
		// フォント
		this.font = createMinimumDynamicFont();
		// ラベル
		// ※恐らくこの時点でg.SceneのonLoadイベントがfireされてないので、onLoadedでappend等する
		this.lblPlayerNum = EntitiesTitleScene.createLblPlayer(this, this.font);
		this.lblGamblerNum = EntitiesTitleScene.createLblGambler(this, this.font);
		// this.lblName = EntitiesTitleScene.createLblName(this, this.font);
		// this.lblName.onPointDown.add(ev => {
		// 	this.lblName.text = `\"${this.myInfo.name}\"として参加しています`;
		// 	this.lblName.invalidate();
		// });
		// debug
		this.lblDebug = new al.Label({
			scene: this,
			font: this.font,
			fontSize: 40,
			text: "",
			x: 0,
			y: 20,
			width: 700,
			height: 700,
		});
		this.lblDebug.onUpdate.add((ev) => {
			this.lblDebug.text = "";
			this.lblDebug.text += "myInfo:\n";
			this.lblDebug.text += `${this.myInfo.id}, ${this.myInfo.name}, ${this.myInfo.role}\n`;
			this.lblDebug.text += "playerInfos:\n";
			Object.keys(this.playerInfos).forEach(key => {
				this.lblDebug.text += "[" + key + "]: ";
				this.lblDebug.text += this.playerInfos[key].name + ", ";
				this.lblDebug.text += this.playerInfos[key].role + "\n";
			});
			this.lblDebug.invalidate();
		});
		// プレイヤー情報
		this.myInfo = {
			id: "",
			name: "",
			role: playerRole.none,
		};
		// -----------------------------
		// 名前取得ダイアログ
		// -----------------------------
		game.onPlayerInfo.add((ev) => {
			// debug
			console.log("******* sceneEntry::onPlayerInfo");
			console.log("myInfo.id     : " + this.myInfo.id);
			console.log("pushPlayer.id : " + this.pushPlayerId);
			console.log("ev.player.id  : " + ev.player.id);
			//
			const player = ev.player;
			if (player == null) return;
			if (player.id == null) return;
			// 連想配列に追加する(配信者のみ)
			// this.addPlayerInfo(this.myInfo);
			if (player.id !== this.pushPlayerId) {
				console.log("IDが違います player.id = pushPlayerId");
				console.log(`['${player.id}' = '${this.pushPlayerId}']`);
				return;
			}
			// this.myInfo.name = player.name || "";
			// this.playerInfos[player.id] = { name: this.myInfo.name, role: this.myInfo.role };
			// プレイヤー情報の設定
			this.myInfo.id = player.id;
			if (player.userData.accepted) {
				this.myInfo.name = player.name || "";
			} else {
				const num: number
					= (this.myInfo.role === playerRole.entryPlayer) ? this.playerNum : this.gamblerNum;
				this.myInfo.name = MakeName.get(this.myInfo.role, num - 1);
			}
			// // tickを進める
			// game.raiseTick();
		});
		// メソッド登録
		this.onLoad.addOnce(this.onLoaded, this);
		this.commandReceived.add(this.onCommandReceived, this);
	}

	/**
	 * シーン読み込み時処理
	 */
	private onLoaded(): void {
		// -----------------------------
		// エンティティ
		// -----------------------------
		// タイトル
		const sprTitle = EntitiesTitleScene.createSprTitle(this);
		this.append(sprTitle);
		// バージョン情報
		const lblVersion = EntitiesTitleScene.createLblVersion(this, this.font, "ver. 0.01");
		this.append(lblVersion);
		// 参加ボタン
		const btn: Button[] = new Array<Button>(2);
		for (let i = 0; i < btn.length; i++) {
			btn[i] = EntitiesTitleScene.createBtnEntry(this, i);
			this.append(btn[i]);
		}
		this.btnEntryOnPointDown(btn[0], btn[1]);
		this.btnEntryOnPointDown(btn[1], btn[0]);
		// 締め切りボタン
		if (game.selfId === GameParams.liverId) {
			const btnClosing = EntitiesTitleScene.createBtnClosing(this);
			this.btnClosingOnPointDown(btnClosing);
			this.append(btnClosing);
			const lblSecond = EntitiesTitleScene.createLblSecond(this, this.font);
			this.append(lblSecond);
			lblSecond.onUpdate.add((ev) => {
				if (this.timeClosing <= 0) {
					lblSecond.text = "";
					lblSecond.invalidate();
					return;
				}
				lblSecond.text = (this.timeClosing / 1000).toString();
				lblSecond.invalidate();
				this.timeClosing -= 33;
			});
		}
		// プロパティのラベル
		this.append(this.lblPlayerNum);
		this.append(this.lblGamblerNum);
		// this.append(this.lblName);
		this.append(this.lblDebug);
	}

	/**
	 * Controller から Command を受け取る
	 * @param command コマンド
	 */
	private onCommandReceived(command: TitleCommand): void {
		// debug
		console.log("******* SceneEntry2::onCommandReceived");
		console.log("command.type = " + command.type);
		// コマンドの種類の判定
		if (command.type === titleCommandChangePlayerType.changePlayerNum) {
			this.playerNum = Number(command.num);
			this.lblPlayerNum.text = `${command.num}人参加中`;
			this.lblPlayerNum.invalidate();
		} else if (command.type === titleCommandChangePlayerType.changeGamblerNum) {
			this.gamblerNum = Number(command.num);
			this.lblGamblerNum.text = `${command.num}人参加中`;
			this.lblGamblerNum.invalidate();
		} else if (command.type === titleCommandChangeSceneType.nextScene) {
			this.pushScene();
		} else {
			console.log("未知の command.type でした");
			return;
		}
	}

	/**
	 * プレイヤーボタンの作成
	 * @param btnGambler ギャンブラーボタン
	 * @returns フレームスプライト
	 */
	private btnEntryOnPointDown(btn1: Button, btn2: Button): void {
		// 選手参加ボタン押下時イベント
		btn1.onPointDown.add((ev) => {
			// debug
			console.log("******* sceneEntry::btnOnPointDown");
			console.log("btn1.tag = " + btn1.tag);
			console.log(this.myInfo);
			//
			const player = ev.player;
			if (player == null) return;
			if (player.id == null) return;
			// idの設定
			this.pushPlayerId = player.id;
			if (btn1.frameNumber === 0) {
				// プレイヤー情報の設定
				if (btn1.tag === "btnPlayer") {
					this.myInfo.role = playerRole.entryPlayer;
					// Controller に ActionData を送る
					this.send({ type: titleActionEntryType.player });
				} else if (btn1.tag === "btnGambler") {
					this.myInfo.role = playerRole.gambler;
					// Controller に ActionData を送る
					this.send({ type: titleActionEntryType.gambler });
				} else {
					console.log("未知の btn1.tag でした");
					return;
				}
				// プレイヤー情報の追加
				resolvePlayerInfo({ raises: true });
				// resolvePlayerInfo({ raises: false }, this.getPlayerName);
				// ボタンの状態を変更
				btn1.frameNumber = 1;
				btn2.touchable = false;
			} else {
				// Controller に ActionData を送る
				if (btn1.tag === "btnPlayer") {
					this.send({ type: titleActionErasureType.player });
				} else if (btn1.tag === "btnGambler") {
					this.send({ type: titleActionErasureType.gambler });
				} else {
					console.log("未知の btn1.tag でした");
					return;
				}
				// プレイヤー情報の削除
				// this.delPlayerInfo();
				// プレイヤー情報の設定
				this.myInfo.role = playerRole.none;
				// ボタンの状態を変更
				btn1.frameNumber = 0;
				btn2.touchable = true;
			}
			btn1.modified();
		});
	}
	private btnClosingOnPointDown(btnClosing: Button): void {
		btnClosing.onPointDown.add(ev => {
			//
			const player = ev.player;
			if (player == null) return;
			if (player.id == null) return;
			//
			if (btnClosing.frameNumber === 0) {
				this.timeClosing = 10000;
				btnClosing.frameNumber = 1;
				this.timerIdentifer = this.setTimeout(() => {
					this.send({ type: titleActionChangeSceneType.nextScene });
				}, 10000, this);
			} else {
				this.timeClosing = 0;
				if (this.timerIdentifer == null) return;
				this.clearTimeout(this.timerIdentifer);
				btnClosing.frameNumber = 0;
			}
			btnClosing.modified();
		});
	}

	private pushScene(): void {
		GameParams.playerInfo = this.myInfo;
		game.pushScene(new SceneSelect(this.sceneParam, this.args));
	}

	// private getPlayerName(err: Error | null, playerInfo: GetPlayerInfo): void {
	// 	// debug
	// 	console.log("******* sceneEntry::onPlayerInfo");
	// 	console.log("myInfo.id     : " + this.myInfo.id);
	// 	console.log("pushPlayer.id : " + this.pushPlayerId);
	// 	console.log("ev.player.id  : " + ev.player.i);
	// 	//
	// 	const player = ev.player;
	// 	if (player == null) return;
	// 	if (player.id == null) return;
	// 	// 連想配列に追加する(配信者のみ)
	// 	// this.addPlayerInfo(this.myInfo);
	// 	if (player.id !== this.pushPlayerId) {
	// 		console.log("IDが違います player.id = pushPlayerId");
	// 		console.log(`['${player.id}' = '${this.pushPlayerId}']`);
	// 		return;
	// 	}
	// 	// this.myInfo.name = player.name || "";
	// 	// this.playerInfos[player.id] = { name: this.myInfo.name, role: this.myInfo.role };
	// 	// プレイヤー情報の設定
	// 	this.myInfo.id = player.id;
	// 	if (player.userData.accepted) {
	// 		this.myInfo.name = player.name || "";
	// 	} else {
	// 		const num: number
	// 			= (this.myInfo.role === playerRole.entryPlayer) ? this.playerNum : this.gamblerNum;
	// 		this.myInfo.name = MakeName.get(this.myInfo.role, num - 1);
	// 	}
	// 	// プレイヤー名表示
	// 	this.lblName.text = this.myInfo.name + "として参加しました！";
	// 	this.lblName.invalidate();
	// }

	/**
	 * プレイヤー情報連想配列に追加する
	 */
	private addPlayerInfo(myInfo: PlayerInfo): void {
		// debug
		console.log("******* sceneEntry::addPlayerInfo");
		console.log(myInfo);
		// プレイヤー情報配列に保存
		if (myInfo.role === playerRole.entryPlayer) {
			this.playerInfos[myInfo.id] = {
				name: myInfo.name,
				role: myInfo.role,
			};
		} else if (myInfo.role === playerRole.gambler) {
			this.playerInfos[myInfo.id] = {
				name: myInfo.name,
				role: myInfo.role,
			};
		} else {
			console.log("未知の myInfo.role でした");
			return;
		};
	}

	/**
	 * プレイヤー情報連想配列から削除する
	 */
	private delPlayerInfo(): void {
		// debug
		console.log("******* sceneEntry::delPlayerInfo");
		console.log(this.myInfo);
		//
		if (this.myInfo.role === playerRole.entryPlayer) {
			;
		} else if (this.myInfo.role === playerRole.gambler) {
			;
		} else {
			console.log("未知の myInfo.role でした");
			return;
		}
		delete this.playerInfos[this.myInfo.id];
	}
}

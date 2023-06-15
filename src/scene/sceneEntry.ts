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
// import { MakeName } from "../makeName";
import { GameParams } from "../params";
import { playerRole } from "../type";
import { SceneSelect } from "./sceneSelect";

// interface PlayerInfos {
// 	[id: string]:
// 	{
// 		name: string;
// 		role: string;
// 	};
// };

// interface PlayerNumbers {
// 	[id: string]: number;
// }

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
	// private myInfo: PlayerInfo;
	// private playerInfos: PlayerInfos = {};
	// private playerNum: number = 0;
	// private gamblerNum: number = 0;
	private pushPlayerId: string = "";
	private timerIdentifer: g.TimerIdentifier | undefined;
	private timeClosing: number = 0;
	// private playerNumbers: PlayerNumbers = {};
	// private gamblerNumbers: PlayerNumbers = {};
	/**
	 * コンストラクタ
	 * @param scene シーン
	 * @param playerInfo プレイヤー情報
	 * @param param ゲームパラメータ
	 */
	// constructor(sceneParam: g.SceneParameterObject, args: g.GameMainParameterObject) {
	constructor(sceneParam: g.SceneParameterObject, args: g.GameMainParameterObject) {
		// debug
		console.log("******* sceneEntry::constructor");
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
			this.lblDebug.text += "GameParams.playerInfo:\n";
			this.lblDebug.text += `${GameParams.playerInfo.id}, `
				+ `${GameParams.playerInfo.name}, `
				+ `${GameParams.playerInfo.role}, `
				+ `${GameParams.playerInfo.accepted} \n`;
			this.lblDebug.text += "playerNumbers:\n";
			// Object.keys(this.playerNumbers).forEach((id) => {
			// 	this.lblDebug.text += "[" + id + "]: ";
			// 	this.lblDebug.text += this.playerNumbers[id] + "\n";
			// });
			// this.lblDebug.text += "gamblerNumbers:\n";
			// Object.keys(this.gamblerNumbers).forEach((id) => {
			// 	this.lblDebug.text += "[" + id + "]: ";
			// 	this.lblDebug.text += this.gamblerNumbers[id] + "\n";
			// });
			// this.lblDebug.invalidate();
		});
		// プレイヤー情報
		// this.myInfo = {
		// 	id: "",
		// 	name: "",
		// 	role: playerRole.none,
		// 	accepted: false,
		// };
		// -----------------------------
		// 名前取得ダイアログ
		// -----------------------------
		game.onPlayerInfo.add((ev) => {
			// debug
			console.log("******* sceneEntry::onPlayerInfo");
			console.log("playerInfo.id     : " + GameParams.playerInfo.id);
			console.log("pushPlayer.id : " + this.pushPlayerId);
			console.log("ev.player.id  : " + ev.player.id);
			//
			const player: g.Player = ev.player;
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
			// プレイヤー個人情報の設定
			if (player.id === this.pushPlayerId) {
				// this.myInfo.id = player.id;
				// this.myInfo.accepted = player.userData.accepted;
				GameParams.playerInfo.id = player.id;
				GameParams.playerInfo.accepted = player.userData.accepted;
				if (player.userData.accepted) {
					// this.myInfo.name = player.name || "";
					GameParams.playerInfo.name = player.name || "";
					// } else {
					// 	// const num: number
					// 	// 	= (this.myInfo.role === playerRole.entryPlayer) ? this.playerNum : this.gamblerNum;
					// 	// this.myInfo.name = MakeName.get(this.myInfo.role, num - 1);
					// 	this.myInfo.name = MakeName.get(this.myInfo.role, this.getPlayerNum());
				}
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
			// カウントダウンラベル
			const lblSecond = EntitiesTitleScene.createLblSecond(this, this.font);
			this.append(lblSecond);
			lblSecond.onUpdate.add((ev) => {
				if (this.timeClosing <= 0) {
					if (lblSecond.text !== "") {
						lblSecond.text = "";
						lblSecond.invalidate();
					}
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
		console.log("******* sceneEntry::onCommandReceived");
		console.log("command.type = " + command.type);
		// コマンドの種類の判定
		if (command.type === titleCommandChangePlayerType.changePlayerNum) {
			// this.playerNum = Number(command.num);
			this.lblPlayerNum.text = `${command.num}人参加中`;
			this.lblPlayerNum.invalidate();
		} else if (command.type === titleCommandChangePlayerType.changeGamblerNum) {
			// this.gamblerNum = Number(command.num);
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
			// console.log(this.myInfo);
			console.log(GameParams.playerInfo);
			//
			const player = ev.player;
			if (player == null) return;
			if (player.id == null) return;
			// idの設定
			this.pushPlayerId = player.id;
			if (btn1.frameNumber === 0) {
				// プレイヤー情報の設定
				if (btn1.tag === "btnPlayer") {
					// this.myInfo.role = playerRole.entryPlayer;
					GameParams.playerInfo.role = playerRole.entryPlayer;
					// Controller に ActionData を送る
					this.send({ type: titleActionEntryType.player });
				} else if (btn1.tag === "btnGambler") {
					// this.myInfo.role = playerRole.gambler;
					GameParams.playerInfo.role = playerRole.gambler;
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
				// this.delPlayerNum();
				// プレイヤー情報の設定
				// this.myInfo.role = playerRole.none;
				GameParams.playerInfo.role = playerRole.none;
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
		// GameParams.playerInfo = this.myInfo;
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
	// private addPlayerInfo(myInfo: PlayerInfo): void {
	// 	// debug
	// 	console.log("******* sceneEntry::addPlayerInfo");
	// 	console.log(myInfo);
	// 	// プレイヤー情報配列に保存
	// 	if (myInfo.role === playerRole.entryPlayer) {
	// 		this.playerInfos[myInfo.id] = {
	// 			name: myInfo.name,
	// 			role: myInfo.role,
	// 		};
	// 	} else if (myInfo.role === playerRole.gambler) {
	// 		this.playerInfos[myInfo.id] = {
	// 			name: myInfo.name,
	// 			role: myInfo.role,
	// 		};
	// 	} else {
	// 		console.log("未知の myInfo.role でした");
	// 		return;
	// 	};
	// }

	/**
	 * プレイヤー情報連想配列から削除する
	 */
	// private delPlayerInfo(): void {
	// 	// debug
	// 	console.log("******* sceneEntry::delPlayerInfo");
	// 	console.log(this.myInfo);
	// 	//
	// 	if (this.myInfo.role === playerRole.entryPlayer) {
	// 		;
	// 	} else if (this.myInfo.role === playerRole.gambler) {
	// 		;
	// 	} else {
	// 		console.log("未知の myInfo.role でした");
	// 		return;
	// 	}
	// 	delete this.playerInfos[this.myInfo.id];
	// }
	/**
	 * (名前を取得しなかったプレイヤー向け)一意の番号を取得する
	 * @return number
	 */
	// private getPlayerNum(): number {
	// 	console.log("******* sceneEntry::getPlayerNum");
	// 	// 連想配列の選択
	// 	let hash: PlayerNumbers = {};
	// 	if (GameParams.playerInfo.role === playerRole.entryPlayer) {
	// 		hash = this.playerNumbers;
	// 	} else if (GameParams.playerInfo.role === playerRole.gambler) {
	// 		hash = this.gamblerNumbers;
	// 	} else {
	// 		console.log("未知の PlayerRole でした");
	// 		return -1;
	// 	}
	// 	// 戻り値の設定
	// 	for (let i = 0; i <= Number.MAX_VALUE; i++) {
	// 		// 連想配列の要素を検索し、無かった場合使ってない値
	// 		const result = Object.keys(hash).some((id) => hash[id] === i);
	// 		if (!result) {
	// 			// 連想配列([id]:num)に登録して番号を返す
	// 			hash[GameParams.playerInfo.id] = i;
	// 			return i;
	// 		}
	// 	}
	// 	// 世界中の人が参加しても大丈夫なはず...
	// 	console.log("最大限まで検索しました");
	// 	return -1;
	// }
	/**
	 * プレイヤー番号連想配列から削除
	 */
	// private delPlayerNum(): void {
	// 	console.log("******* sceneEntry::delPlayerNum");
	// 	if (GameParams.playerInfo.role === playerRole.entryPlayer) {
	// 		delete this.playerNumbers[GameParams.playerInfo.id];
	// 	} else if (GameParams.playerInfo.role === playerRole.gambler) {
	// 		delete this.gamblerNumbers[GameParams.playerInfo.id];
	// 	} else {
	// 		console.log("未知の PlayerRole でした");
	// 	}
	// }
}

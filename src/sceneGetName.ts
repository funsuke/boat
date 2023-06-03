import { resolvePlayerInfo } from "@akashic-extension/resolve-player-info";
import {
	PlayerInfo, playerRole,
} from "./controller/ControllerTitle";
import { SceneEntry } from "./SceneEntry";

/**
 * タイトルシーン (COE でいう View でもある)
 */
export class SceneGetName extends g.Scene {
	private font: g.Font;
	private playerInfo: PlayerInfo;
	private btnEntry: g.FrameSprite;
	private args: g.GameMainParameterObject;
	/**
	 * コンストラクタ
	 * @param param ゲームパラメータ
	 */
	constructor(param: g.SceneParameterObject, args: g.GameMainParameterObject) {
		// g.Scene
		super(param);
		this.args = args;
		// ボタン
		this.btnEntry = new g.FrameSprite({
			scene: this,
			src: this.asset.getImageById("button"),
			width: 400,
			height: 80,
			x: 200,
			y: 500 - 160,
			frames: [8, 9],
			frameNumber: 0,
			touchable: true,
			local: true,
		});
		// フォント
		this.font = new g.DynamicFont({
			game: g.game,
			fontFamily: "monospace",
			size: 24,
		});
		// プレイヤー情報
		this.playerInfo = {
			id: "",
			name: "",
			role: playerRole.none,
		};
		// -----------------------------
		// 名前取得ダイアログ
		// -----------------------------
		// g.game.onPlayerInfo.add(this.setName);
		g.game.onPlayerInfo.add((ev) => {
			this.playerInfo.name = ev.player.name || "";
		});
		// -----------------------------
		// メソッド登録
		// -----------------------------
		this.onLoad.addOnce(this.onLoaded, this);
	}

	/**
	 * Scene 読み込み時処理
	 */
	private onLoaded(): void {
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
		const version: string = "ver. 0.01";
		new g.Label({
			scene: this,
			font: this.font,
			fontSize: 24,
			text: version,
			textColor: "black",
			parent: this,
		});
		// -----------------------------
		// 参加ボタン
		// -----------------------------
		const btn = this.btnEntry;
		this.append(btn);
		btn.onPointDown.add((ev) => {
			if (ev.player == null) return;
			if (ev.player.id == null) return;
			// プレイヤー情報の登録
			this.playerInfo.id = ev.player.id;
			resolvePlayerInfo({ raises: true });
			// 次シーンへ移動
			g.game.pushScene(new SceneEntry(this.playerInfo, this.args));
		});
	}
	// /**
	//  * 効果音を先生する
	//  * @param name 再生するアセットID
	//  */
	// private playSound(name: string): void {
	// 	(this.asset.getAudioById(name) as g.AudioAsset).play().changeVolume(0.8);
	// }

	// /**
	//  * プレイヤー名ダイアログ応答時処理
	//  */
	// private setPlayerName(err: Error | null, playerInfo: GetPlayerInfo | undefined): void {
	// 	if (err != null) return;
	// 	if (playerInfo == null) return;
	// 	if (playerInfo.name == null) return;
	// 	// 名前の設定
	// 	this.playerInfo.name = playerInfo.name;
	// }

	// /**
	//  * 勝負師名ダイアログ応答時処理
	//  */
	// private setGamblerName(err: Error | null, playerInfo: GetPlayerInfo | undefined): void {
	// 	if (err != null) return;
	// 	if (playerInfo == null) return;
	// 	if (playerInfo.name == null) return;
	// 	// 名前の設定
	// 	this.playerInfo.name = playerInfo.name;
	// }

	// /**
	//  * 名前取得ダイアログ
	//  */
	// private setName(ev: PlayerInfoEvent): void {
	// 	console.log("********SceneTitle::setName");
	// 	this.playerInfo.name = ev.player.name || "";
	// };
}

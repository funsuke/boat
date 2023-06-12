import { Button } from "./entityButton";

/**
 * 最小限のビットマップフォント
 * @returns g.DynamicFont
 */
export function createMinimumDynamicFont(): g.DynamicFont {
	return new g.DynamicFont({ game: g.game, fontFamily: "monospace", size: 24 });
}

/**
 * 最小限のテキスト描画エンティティ
 * @param scene g.Scene
 * @param font g.DynamicFont
 * @returns g.Label
 */
export function createMinimumLabel(scene: g.Scene, font: g.Font): g.Label {
	return new g.Label({ scene, font, text: "" });
}

/**
 * 最小限の画像エンティティ
 * @param scene g.Scene
 * @param src g.Surface | g.ImageAsset
 * @returns g.Sprite
 */
export function createMinimumSprite(scene: g.Scene, src: g.Surface | g.ImageAsset): g.Sprite {
	return new g.Sprite({ scene, src });
}

/**
 * 最小限のフレーム画像エンティティ
 * @param scene g.Scene
 * @param src g.Surface | g.ImageAsset
 * @returns g.FrameSprite
 */
export function createMinimumFrmSprite(scene: g.Scene, src: g.Surface | g.ImageAsset, width: number, height: number): g.FrameSprite {
	return new g.FrameSprite({ scene, src, width, height });
}

/**
 * タイトルシーン用のエンティティ
 */
export class EntitiesTitleScene {
	/**
	 * 人数を表示するラベル
	 * @param scene g.Scene
	 * @param font g.Font
	 * @param x number
	 * @param y number
	 * @return g.Label
	 */
	private static createLblNum(scene: g.Scene, font: g.Font, x: number, y: number): g.Label {
		const lbl = createMinimumLabel(scene, font);
		lbl.fontSize = 40;
		lbl.text = "0人参加中";
		lbl.textColor = "red";
		lbl.x = x;
		lbl.y = y;
		// lbl.parent = scene;	// onLoad で append
		lbl.invalidate();
		return lbl;
	}
	/**
	 * 選手人数を表示するラベル
	 * @param scene g.Scene
	 * @param font g.Font
	 * @returns g.Label
	 */
	public static createLblPlayer(scene: g.Scene, font: g.Font): g.Label {
		return this.createLblNum(scene, font, 200, 400);
	}
	/**
	 * 勝負師人数を表示するラベル
	 * @param scene g.Scene
	 * @param font g.Font
	 * @returns g.Label
	 */
	public static createLblGambler(scene: g.Scene, font: g.Font): g.Label {
		return this.createLblNum(scene, font, 700, 400);
	}
	/**
	 * プレイヤー名を表示するラベル
	 * @param scene g.Scene
	 * @param font g.Font
	 * @returns g.Label
	 */
	public static createLblName(scene: g.Scene, font: g.Font): g.Label {
		const lbl = createMinimumLabel(scene, font);
		lbl.fontSize = 40;
		lbl.text = "ここを押して名称を更新してください。";
		lbl.textColor = "black";
		lbl.x = 200;
		lbl.y = 480;
		lbl.touchable = true;
		lbl.invalidate();
		return lbl;
	}
	/**
	 * タイトル画像を表示するスプライト
	 * @param scene g.Scene
	 * @returns g.Sprite
	 */
	public static createSprTitle(scene: g.Scene): g.Sprite {
		return createMinimumSprite(scene, scene.assets.title as g.ImageAsset);
	}
	/**
	 * 選手用タイトル画像を表示するスプライト
	 * @param scene g.Scene
	 * @returns g.Sprite
	 */
	public static createSprTitlePlayer(scene: g.Scene): g.Sprite {
		return createMinimumSprite(scene, scene.assets.titlePlayer as g.ImageAsset);
	}
	/**
	 * 勝負師用タイトル画像を表示するスプライト
	 * @param scene g.Scene
	 * @returns g.Sprite
	 */
	public static createSprTitleGambler(scene: g.Scene): g.Sprite {
		return createMinimumSprite(scene, scene.assets.titleGambler as g.ImageAsset);
	}
	/**
	 * バージョンを表示するラベル
	 * @param scene g.Scene
	 * @param font g.Font
	 * @param ver string
	 * @returns g.Label
	 */
	public static createLblVersion(scene: g.Scene, font: g.Font, ver: string): g.Label {
		const lbl = createMinimumLabel(scene, font);
		lbl.fontSize = 24;
		lbl.text = ver;
		lbl.textColor = "black";
		lbl.invalidate();
		return lbl;
	}
	/**
	 * 参加ボタン
	 * @param scene g.Scene
	 * @param i 0:entryPlayer, 1:entryGambler
	 * @returns g.FrameSprite
	 */
	public static createSprEntry(scene: g.Scene, i: number): g.FrameSprite {
		const spr = createMinimumFrmSprite(scene, scene.assets.button as g.ImageAsset, 400, 800);
		spr.frames = [4 + 2 * i, 5 + 2 * i];
		spr.frameNumber = 0;
		spr.touchable = true;
		spr.x = 200 + 500 * i;
		spr.y = (g.game.height - 80) / 2;
		// spr.parent = scene;
		spr.modified();
		return spr;
	}
	public static createBtnEntry(scene: g.Scene, i: number): Button {
		const btn = new Button(scene, scene.assets.button as g.ImageAsset, 400, 80);
		btn.frames = [4 + 2 * i, 5 + 2 * i];
		btn.frameNumber = 0;
		btn.x = 200 + 500 * i;
		btn.y = (g.game.height - 80) / 2;
		// btn.parent = scene;
		// タグ
		btn.tag = (i === 0) ? "btnPlayer" : "btnGambler";
		btn.modified();
		return btn;
	}
	/**
	 * 締め切りボタン
	 * @param scene g.Scene
	 * @returns Button
	 */
	public static createBtnClosing(scene: g.Scene): Button {
		const btn = new Button(scene, scene.assets.button as g.ImageAsset, 400, 80);
		btn.frames = [10, 11];
		btn.frameNumber = 0;
		btn.x = g.game.width - 20 - 400;
		btn.y = g.game.height - 10 - 80;
		btn.parent = scene;
		btn.modified();
		return btn;
	}
	public static createLblSecond(scene: g.Scene, font: g.Font): g.Label {
		const lbl = createMinimumLabel(scene, font);
		lbl.fontSize = 40;
		lbl.text = "";
		lbl.textColor = "black";
		lbl.width = 100;
		lbl.height = 80;
		lbl.x = g.game.width - 20 - 100;
		lbl.y = g.game.height - 10 - 160;
		lbl.textAlign = "right";
		lbl.invalidate();
		return lbl;
	}
};

export class Button extends g.FrameSprite {
	/**
	 * コンストラクタ
	 * @param scene シーン
	 * @param s 表示文字列
	 * @param x 表示X位置
	 * @param y 表示Y位置
	 * @param w 表示幅
	 * @param h 表示高さ
	 */
	constructor(scene: g.Scene, src: g.Surface | g.ImageAsset, width: number, height: number) {
		// -----------------------------
		// 親クラス(ボタン周りの線の色：黒)
		// -----------------------------
		super({
			scene,
			src,
			width,
			height,
			touchable: true,
		});
		// =============================
		// ポイントダウンイベント
		// =============================
		// this.onPointDown.add((ev) => {
		// });
		// =============================
		// ポイントアップイベント
		// =============================
		// this.onPointUp.add((ev) => {
		// });
	}
}

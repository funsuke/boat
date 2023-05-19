// JoinとLeaveとニコ生の話
// https://akashic-games.github.io/shin-ichiba/column-join-leave.html
// https://github.com/akashic-contents/with-game-master/blob/master/src/main.ts#L17
/*
npm install -DE @akashic/akashic-engine
akashic init -t javascript-shin-ichiba-ranking
akashic-sandbox
akashic scan asset
bmpfont-generator --chars '0123456789' --height 48 --fill #000000 --stroke #ffffff rounded-x-mplus-1c-black.ttf bitmap.png --margin 8
ffmpeg -ss 0.0 -to 1.5 -i se.mp3 -af volume=-5dB se.ogg
ffmpeg -i input1.mp3 -i input2.mp3 -filter_complex "concat=n=2:v=0:a=1" output.mp3
akashic export html -f --output file.zip --atsumaru
akashic export html --bundle --minify --magnify --atsumaru -o game.zip
*/
/*
scene.onUpdate.add(function() {
});

function createRect() {
}

scene.setTimeout(function() {
}, 3000);

scene.setInterval(function() {
}, 500);

g.game.random.generate();

rect.onPointDown.add(function(ev) {
	let x = ev.point.x;
	let y = ev.point.y;
});
rect.onPointUp.add(function(ev) {
	rect.x += ev.startDelta.x;
	rect.y += ev.startDelta.y;
});
rect.onPointMove.add(function(ev) {
		rect.x += ev.prevDelta.x;
		rect.y += ev.prevDelta.y;
});
scene.onPointDownCapture.add(function(ev) {
});

if (soundState) scene.assets["se_start"].play().changeVolume(1);

let sprite  = new g.Sprite({
		scene: scene, src: scene.assets["tutorial"], parent: buttonLayer,
		x: g.game.width/2, y: g.game.height/2,
		anchorX: 0.5, anchorY: 0.5, opacity: 1,
});
let fSprite = new g.FrameSprite({
	scene: scene, src: scene.assets[""], parent: touchLayer,
	x: g.game.width/2, y: g.game.height, scaleX: 1, scaleY: 1,
	width: 200, height: 200, srcWidth: 200, srcHeight: 200, frames: [0, 1], interval: 150, loop: true,
	anchorX: 0.5, anchorY: 0.5, opacity: 1, touchable: false,
});

let font = new g.DynamicFont({
	game: g.game,
	fontFamily: "sans-serif",
	// "sans-serif": サンセリフ体・ゴシック体のフォント。
	// "serif": セリフ体・明朝体のフォント。
	// "monospace": 等幅フォント。
	fontWeight: "bold",	// "normal"　または　"bold"
	size: 96, fontColor: "black", strokeWidth: 8, strokeColor: "white",
});

let glyph = JSON.parse(scene.assets["font_round_glyphs"].data);
let font = new g.BitmapFont({
		src: scene.assets["font_round"],
		map: glyph,
		defaultGlyphWidth: 96,
		defaultGlyphHeight: 96,
});

let syncRandom = param.random;	//	g.game.random

*/

import { SceneTitle } from "./SceneTitle";


// 縦75m以上×横440m以上
// スタートラインから150m離れた競走水面上には、赤と白の蛍光塗料が塗られた[9]2つのブイ（ターンマーク）が浮かんでいる
//     ＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
//   ／                                  ＼
//  /                                      \
// |          20                            |
// |       2▲----               ----▲1      |
// |             150    |  150              |
//  \                                      /
//   ＼＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿／
// *100くらい？
// さらに第2ターンマークとセンターポールとの間の4箇所（スタートラインから5m、45m、80m、100mの位置）にポール（標識ポール）が浮かんでいる[12]。
// さらにスタートラインから5m、45m、80-85mを示す空中線が張られている[13]

// ・エンジンなど
// ロングストロークは低回転高トルク型、ショートストロークは高回転高出力型エンジン
// 排気量 = π × (ボア)2 × 1/4 ×(ストローク) × (気筒数)
// ボアよりもストロークが長いとロングストロークエンジン、ボアよりもストロークが短いとショートストロークエンジン、またボアとストロークがほぼ同じ場合はスクエアエンジンと呼ばれます。
// 瞬発力でなくトルク重視の長距離走行を目的とした大排気量のツアラータイプなど一部のモデルには、ロングストロークエンジンが採用されています。また、独特の鼓動感で有名なハーレーは、ロングストロークで有名です。
// 自動車は、燃費重視でロングストロークエンジンが、バイクは高出力重視でショートストロークエンジンが主流です。
// ・競艇のエンジン
// 時速60~80km程度
// 水冷式縦型直列２気筒２サイクルのガソリンエンジン
// 23.5kW(31PS)で排気量は396.9cc
// 最大出力6600rpm、31馬力
// 1PS=0.7355kw
// https://www.youtube.com/watch?v=ZEwhpvhQxlw&list=PLjbYXvfdWr8L5gjRH6eqJubpCG5tLjH8U
// 34m 800回転 座位 30秒くらい 時速4km(歩く速度)ぐらいが初速か？
// 100mくらいで最高速になるとのこと
// 秒速22.500000m = 時速81.0km / 30 = 0.7500000000m/f 1px=1cmなので 75.3333333px/f
// 秒速22.000000m = 時速79.2km / 30 = 0.7333333333m/f 1px=1cmなので 73.3333333px/f
// 秒速21.000000m = 時速75.6km / 30 = 0.7000000000m/f 1px=1cmなので 70.0000000px/f
// 時速75km = 秒速20.83333333m / 30 = 0.6944444444m/f 1px=1cmなので 69.4444444px/f
// 時速70km = 秒速19.44444444m / 30 = 0.6481481481m/f 1px=1cmなので 64.8481481px/f
// 時速 4km = 秒速 1.11111111m / 30 = 0.0370370370m/f 1px=1cmなので  3.7037037px/f
// 秒速 1.000000m = 時速 3.6km / 30 = 0.0333333333m/f 1px=1cmなので  3.3333333px/f
// 平均時速 (76+4)/2=平均40.0km
//            秒速11.11111111m 100mは約9秒
// 9秒だと加速度 max-min(m/s)/9(s) = 2.22222222m/s^2
// 73.333333px-3.333333px / (30frame*12s) = 0.1944444444px/f

// 旋回(復原力無し)
// Θ=方位角(yawing or turning angle)

function main(param: g.GameMainParameterObject): void {
	g.game.pushScene(new SceneTitle(param));
};

export = main;

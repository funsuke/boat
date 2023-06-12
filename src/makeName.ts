import { playerRole } from "./type";

export class MakeName {
	/**
	 * 名前を取得する
	 * @param role ロール
	 */
	public static get(role: playerRole, num: number): string {
		let name: string = "";
		if (role === playerRole.entryPlayer) {
			if (num === 0) {
				name = "孤高のレーサー";
			} else {
				name = "選手" + this.get26Decimal(num);
			}
		} else if (role === playerRole.gambler) {
			if (num === 0) {
				name = "孤高のギャンブラー";
			} else {
				name = "勝負師" + this.get26Decimal(num);
			}
		} else {
			console.log("******* MakeName::get");
			console.log("未定義の playerRole です");
			return "";
		}
		return name;
	}
	/**
	 * number を 26(alphabet)進数の string に変換する
	 * @param num number
	 * @returns string
	 */
	private static get26Decimal(num: number): string {
		if (num <= 0) return "";
		let i: number = num - 1;
		let retStr: string = "";
		do {
			retStr = String.fromCharCode(65 + (i % 26)) + retStr;
			i = Math.floor(i / 26) - 1;
		} while (i >= 0);
		return retStr;
	}
};

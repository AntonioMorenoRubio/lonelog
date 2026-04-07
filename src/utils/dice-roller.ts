/**
 * Dice Roller Utility
 * Handles parsing and rolling of standard RPG dice notation (ndm + mod)
 */

export interface RollResult {
	notation: string;
	total: number;
	rolls: number[];
	modifier: number;
	sides: number;
}

export class DiceRoller {
	/**
	 * Parse and roll a dice notation string
	 * Example: "2d6 + 4", "1d10 - 1", "d20"
	 */
	static roll(notation: string): RollResult | null {
		// Clean notation
		const clean = notation.replace(/\s+/g, "").toLowerCase();
		
		// Regex to match dice groups: (number)?d(sides)
		const diceRegex = /(\d*)d(\d+)/g;
		const rolls: number[] = [];
		let total = 0;
		let lastIndex = 0;
		let match;
		let firstSides = 6;

		// Extract all dice rolls
		while ((match = diceRegex.exec(clean)) !== null) {
			const countStr = match[1];
			const sidesStr = match[2];
			if (!sidesStr) continue;

			const count = countStr ? parseInt(countStr) : 1;
			const sides = parseInt(sidesStr);
			if (rolls.length === 0) firstSides = sides;

			for (let i = 0; i < count; i++) {
				const r = Math.floor(DiceRoller.getRandom() * sides) + 1;
				rolls.push(r);
				total += r;
			}
			lastIndex = diceRegex.lastIndex;
		}

		// Look for modifier after dice (e.g., +4, -2)
		const remaining = clean.substring(lastIndex);
		const modMatch = /([+-]\d+)/.exec(remaining);
		const modifier = modMatch && modMatch[1] ? parseInt(modMatch[1]) : 0;
		
		total += modifier;

		return {
			notation,
			total,
			rolls,
			modifier,
			sides: firstSides
		};
	}

	/**
	 * Extracts a dice notation from a string starting with "d:"
	 * Example: "d: 2d6 + 4 -> 10" returns "2d6+4"
	 */
	static extractNotation(line: string): string | null {
		// Find the part after d: but before -> or end of line
		const match = /d:\s*([^->\n]+)/i.exec(line);
		return (match && match[1]) ? match[1].trim() : null;
	}

	/**
	 * Cryptographically stronger random number generation if available
	 */
	private static getRandom(): number {
		if (typeof window !== "undefined" && window.crypto && typeof window.crypto.getRandomValues === "function") {
			const array = new Uint32Array(1);
			window.crypto.getRandomValues(array);
			const val = array[0];
			if (val !== undefined) {
				return val / (0xffffffff + 1);
			}
		}
		return Math.random();
	}
}

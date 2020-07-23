let score = 0;

const ScoringCalculatorSercice = {
	WHACKED_POINT_VALUE: 1,
	getScore() {
		return score;
	},
	addWhackedPoint() {
		score += this.WHACKED_POINT_VALUE;
	},
	reset() {
		score = 0;
	},
};

module.exports = ScoringCalculatorSercice;

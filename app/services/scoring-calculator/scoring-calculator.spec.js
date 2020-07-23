const ScoringCalculatorSercice = require('./scoring-calculator');

describe('ScoringCalculatorService', () => {
	beforeEach(() => {
		ScoringCalculatorSercice.reset();
	});

	it('should score to 0 by default', () => {
		expect(ScoringCalculatorSercice.getScore()).toEqual(0);
	});

	it('should add 1 point to the score when asking to addWhackedPoint', () => {
		ScoringCalculatorSercice.addWhackedPoint();
		expect(ScoringCalculatorSercice.getScore()).toEqual(ScoringCalculatorSercice.WHACKED_POINT_VALUE);
	});

	it('should reset the score to zero', () => {
		ScoringCalculatorSercice.addWhackedPoint();
		ScoringCalculatorSercice.reset();
		expect(ScoringCalculatorSercice.getScore()).toEqual(0);
	});
});

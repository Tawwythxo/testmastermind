const colors = require('./colors')
const hints = require('./hints')
const gameProgress = require('./gameProgress')


const { pickColor, generateCode, checkCode, scrumble, runden, inputPlayer, gamePlay, mastermindGameResult, arraysAreIdentical } = require('./mastermind');

describe('mastermind', () => {

	describe('pickColor', () => {

		it('take a random number and return color based on that', () => {
			expect(pickColor(() => 0.1)).toEqual(colors.RED)
			expect(pickColor(() => 0.5)).toEqual(colors.PURPLE)

		});

		[
			{ valueRange: 0.125, color: colors.RED },
			{ valueRange: 0.25, color: colors.GREEN },
			{ valueRange: 0.375, color: colors.YELLOW },
			{ valueRange: 0.5, color: colors.BLUE },
			{ valueRange: 0.625, color: colors.PURPLE },
			{ valueRange: 0.75, color: colors.ORANGE },
			{ valueRange: 0.875, color: colors.PINK },
			{ valueRange: 1.00, color: colors.BROWN }

		].forEach(({ valueRange, color }) => {

			it(`should return ${color} for value in Range of ${valueRange}`, () => {
				expect(pickColor(() => { return valueRange - 0.001 })).toEqual(color)
			})

		})


		it('should prevent Exceptions if the value is >= 1.0 and return the color fitting to the last digits', () => {
			expect(pickColor(() => 1.000)).toEqual(colors.RED)
			expect(pickColor(() => 100.3258)).toEqual(colors.YELLOW)
			expect(pickColor(() => 4.485)).toEqual(colors.BLUE)
			expect(pickColor(() => 15.56)).toEqual(colors.PURPLE)

		});

	}),


		describe('generateCode', () => {
			it('should return 4 colors', () => {
				expect(generateCode().length).toEqual(4);
			});


			it('should return 4 colors based on the random function', () => {
				expect(generateCode()).not.toEqual(generateCode());
			});


			it('should generate a random CODE and if it fullfills the condition it is replaced by a fakeCode', () => {
				let fakeCode = generateCode()
				if (fakeCode.length === 4) {
					fakeCode = [colors.RED, colors.GREEN, colors.YELLOW, colors.BLUE];
				}
				expect(fakeCode).toEqual([colors.RED, colors.GREEN, colors.YELLOW, colors.BLUE]);
			});

		});



	describe('checkCode', () => {
		it('should turn code and guess into hints when all diverge', () => {
			expect(checkCode(
				[colors.RED, colors.GREEN, colors.YELLOW, colors.BLUE],
				[colors.PURPLE, colors.ORANGE, colors.PINK, colors.BROWN]
			)).toEqual([hints.WRONG, hints.WRONG, hints.WRONG, hints.WRONG])
		})

		it('should turn code and guess into hints when all colors are equal', () => {
			expect(checkCode(
				[colors.RED, colors.GREEN, colors.YELLOW, colors.BLUE],
				[colors.RED, colors.GREEN, colors.YELLOW, colors.BLUE]
			)).toEqual([hints.FITS, hints.FITS, hints.FITS, hints.FITS])
		})

		it('should turn code and guess into hints when the colors are not correctly placed', () => {
			expect(checkCode(
				[colors.RED, colors.GREEN, colors.YELLOW, colors.BLUE],
				[colors.GREEN, colors.RED, colors.BLUE, colors.YELLOW]
			)).toEqual([hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY])
		})

		it('should turn code and guess into hints when the colors are not correctly placed', () => {
			expect(checkCode(
				[colors.RED, colors.GREEN, colors.YELLOW, colors.BLUE],
				[colors.GREEN, colors.YELLOW, colors.BROWN, colors.BLUE]
			)).toEqual([hints.PARTIALLY, hints.PARTIALLY, hints.WRONG, hints.FITS])
		})

		it('should turn code and guess into hints when the colors are not correctly placed', () => {
			expect(checkCode(
				[colors.YELLOW, colors.GREEN, colors.RED, colors.PINK],
				[colors.YELLOW, colors.GREEN, colors.BROWN, colors.RED]
			)).toEqual([hints.FITS, hints.FITS, hints.WRONG, hints.PARTIALLY])
		})

		it('should turn code and guess into hints when the colors are not correctly placed', () => {
			expect(checkCode(
				[colors.YELLOW, colors.GREEN, colors.PURPLE, colors.BLUE],
				[colors.BROWN, colors.GREEN, colors.YELLOW, colors.BLUE]
			)).toEqual([hints.WRONG, hints.FITS, hints.PARTIALLY, hints.FITS])
		})

	});



	describe('scrumble', () => {

		it('should shuffle the array', () => {
			expect(scrumble(
				[colors.RED, colors.GREEN, colors.YELLOW, colors.BLUE],
				[colors.GREEN, colors.YELLOW, colors.BROWN, colors.BLUE]
			)).not.toEqual([hints.PARTIALLY, hints.PARTIALLY, hints.WRONG, hints.FITS])
		})

		it('should shuffle the array', () => {
			expect(scrumble(
				[colors.YELLOW, colors.GREEN, colors.RED, colors.PINK],
				[colors.YELLOW, colors.GREEN, colors.BROWN, colors.RED]
			)).not.toEqual([hints.FITS, hints.FITS, hints.WRONG, hints.PARTIALLY])
		})
	});



	describe('mastermindGame', () => {


		describe('inputPlayer', () => {
			[
				{ guess: "RRRR", converted: [colors.RED, colors.RED, colors.RED, colors.RED] },
				{ guess: "RSPO", converted: [colors.RED, colors.BROWN, colors.PINK, colors.ORANGE] },
				{ guess: "RGYL", converted: [colors.RED, colors.GREEN, colors.YELLOW, colors.PURPLE] },
				{ guess: "YSPO", converted: [colors.YELLOW, colors.BROWN, colors.PINK, colors.ORANGE] },
				{ guess: "BLOP", converted: [colors.BLUE, colors.PURPLE, colors.ORANGE, colors.PINK] },
				{ guess: "SGYB", converted: [colors.BROWN, colors.GREEN, colors.YELLOW, colors.BLUE] },
				{ guess: "RSPL", converted: [colors.RED, colors.BROWN, colors.PINK, colors.PURPLE] },

			].forEach(({ converted, guess }) => {

				it(`should return ${converted} for the player guess ${guess}`, () => {
					expect(inputPlayer(guess)).toEqual(converted)
				})

			})
		});



		describe('gamePlay', () => {
			it('gameplay', () => {
				expect(gamePlay(inputPlayer([colors.RED, colors.BROWN, colors.PINK, colors.PURPLE])))
					.not.toEqual([hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY]);
			})

		});

		describe('mastermindGameResult', () => {
			it('should return LOST after 12 rounds not guessing the correct code', () => {
				expect(mastermindGameResult(runden(12),
					inputPlayer([hints.WRONG, hints.WRONG, hints.WRONG, hints.WRONG],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY])
				)).toEqual(gameProgress.LOST);
			})

			it('should return PENDING midround while still guessing the correct code', () => {
				expect(mastermindGameResult(runden(5),
					inputPlayer([hints.WRONG, hints.WRONG, hints.WRONG, hints.WRONG],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.FITS, hints.FITS, hints.FITS, hints.FITS]))
				).toEqual(gameProgress.PENDING);
			})

			it('should return WON after guessing the correct code', () => {
				expect(mastermindGameResult(runden(11),
					inputPlayer([hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY, hints.PARTIALLY],
						[hints.FITS, hints.FITS, hints.FITS, hints.FITS]))
				).toEqual(gameProgress.WON);

			})
		});


	});



});
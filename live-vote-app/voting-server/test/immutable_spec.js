import { expect } from "chai";

describe("immutability", function () {
	describe("a number", function () {
		function increment(currentState) {
			return currentState + 1;
		}

		it("is immutable", () => {
			let state = 42;
			let nextState = increment(state);

			expect(nextState).to.be.equal(43);
			expect(state).to.be.equal(42);
		});
	});

	describe("A List", () => {
		function addMovie(currentState, movie) {
			return currentState.push(movie);
		}

		it("is immutable", () => {
			let state = List.of("Trainspotting", "28 Days later");
			let nextState = addMovie(state, "Sunshine");

			expect(nextState).to.equal(
				List.of("Trainspotting", "28 Days Later", "Sunshine")
			);

			expect(state).to.equal(List.of("Trainspotting", "28 Days Later"));
		});
	});

	describe("A tree", () => {
		function addMovie(currentState, movie) {
			return currentState.set(
				"movies",
				currentState.get("movies").push(movie)
			);
		}

		it("is immutable", () => {
			let state = Map({
				movies: List.of("Trainspotting", "28 Days Later"),
			});
			let nextState = addMovie(state, "Sunshine");

			expect(nextState).to.equal(
				Map({
					movies: List.of(
						"Trainspotting",
						"28 Days Later",
						"Sunshine"
					),
				})
			);

			expect(state).to.equal(
				Map({
					movies: List.of("Trainspotting", "28 Days Later"),
				})
			);
		});
	});
});

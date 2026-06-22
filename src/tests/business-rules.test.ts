import {
  describe,
  expect,
  test,
} from "vitest";

function validateLoseWeightGoal(
  currentWeight: number,
  targetWeight: number
) {
  return targetWeight < currentWeight;
}

describe(
  "goal validation",
  () => {

    test(
      "lose weight target should be lower",
      () => {

        expect(
          validateLoseWeightGoal(
            78,
            70
          )
        ).toBe(true);
      }
    );

    test(
      "lose weight target cannot be higher",
      () => {

        expect(
          validateLoseWeightGoal(
            78,
            85
          )
        ).toBe(false);
      }
    );

    test(
      "lose weight target cannot be equal",
      () => {

        expect(
          validateLoseWeightGoal(
            78,
            78
          )
        ).toBe(false);
      }
    );
  }
);
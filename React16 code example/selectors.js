import { selectors as entities } from "@lusk/redux-entities-reducer";
import { createSelector } from "reselect";
import R from "ramda";

export const selectTactic = entities.getEntity;

export const selectTacticsOrderType = (state) =>
  state.tacticsOrderType;

export const selectOrderedTactics = createSelector(
  state => selectTactics(state.entities),
  selectTacticsOrderType,
  (tactics, orderType) => {
    switch (orderType) {
      case "name":
        return R.sortBy(R.compose(R.toLower, R.prop("name")), tactics);
      case "profit6M":
        return R.sortBy(R.prop("profit6M"), tactics);
      default:
        return tactics;
    }
  },
);
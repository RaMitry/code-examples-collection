export const tacticsOrderType = (initial = "profit6M", { type, order }) => {
  switch (type) {
    case "SET_TACTICS_ORDER_TYPE":
      return order;
    case "CLEAR_STATE":
      return "profit6M";
    default:
      return initial;
  }
};

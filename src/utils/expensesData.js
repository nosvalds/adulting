const _ = require("lodash");

const categoryTotals = (data, month) => {
  let objectTotals = _.reduce(
    data.expenses,
    (acc, expense) => {
      const expMonth = new Date(expense.date);
      if (month !== expMonth.getMonth()) return acc;
      const cost = Number(expense.cost);
      const category = expense.category.name;
      if (acc[category]) {
        acc[category] += cost;
      } else {
        acc[category] = cost;
      }
      return acc;
    },
    {}
  );
  return _.map(objectTotals, (spend, category) => {
    spend = spend.toFixed(2);
    let budget;
    let id;
    switch (category) {
      case "Entertainment - Other":
        budget = 100;
        id = 23;
        break;
      case "Groceries":
        budget = 300;
        id = 12;
        break;
      case "Dining out":
        budget = 125;
        id = 13;
        break;
      case "Liquor":
        budget = 125;
        id = 38;
        break;
      case "Food and drink - Other":
        budget = 15;
        id = 26;
        break;
      default:
        break;
    }
    return {
      id,
      category,
      spend,
      budget,
      remaining: (budget - spend).toFixed(2),
    };
  });
};

export default categoryTotals;

// "category": {
//   "id": 23,
//   "name": "Entertainment - Other"
// }
//  "category": {
//   "id": 12,
//   "name": "Groceries"
// }
// "category": {
//   "id": 13,
//   "name": "Dining out"
// }
// "category": {
//   "id": 38,
//   "name": "Liquor"
// }

/**
 * Create a juicing + quern recipe for fruit/vegetable
 * @param {Internal.RecipesEventJS} event  Recipes event
 * @param {"fruit" | "vegetable"} type  type of mash resulting from quern
 * @param {string} ingredient  What fruit/vegetable is juiced
 * @param {string} fluid  Resulting fluid
 * @param {number} amount  Amount of resulting fluid
 */

function create_juicing_recipe(event, type, ingredient, fluid, amount) {
  event.custom({
    type: "artisanal:juicing",
    ingredient: {
      type: "tfc:not_rotten",
      ingredient: {
        item: ingredient,
      },
    },
    result: {
      fluid: fluid,
      amount: amount,
    },
  });

  event.custom({
    type: "tfc:quern",
    ingredient: {
      type: "tfc:not_rotten",
      ingredient: {
        item: ingredient,
      },
    },
    result: {
      item:
        type == "fruit"
          ? "artisanal:food/fruit_mash"
          : "artisanal:food/vegetable_mash",
      count: 1,
    },
  });
}

// Create juicing recipes for all juices
ServerEvents.recipes((event) => {
  Object.keys(global["wizzys_hardrock_additions:juices"]).forEach((v) => {
    let data = global["wizzys_hardrock_additions:juices"][v];
    create_juicing_recipe(event, data[3], data[4], data[0], 100);
  });
});

// Make all juices drinkable
ServerEvents.highPriorityData((event) => {
  Object.keys(global["wizzys_hardrock_additions:juices"]).forEach((v) => {
    let data = global["wizzys_hardrock_additions:juices"][v];
    event.addJson(`tfc:drinkables/${v}.json`, {
      ingredient: data[0],
      thirst: 10,
      food: {
        hunger: 0,
        saturation: 0,
        fruit: data[3] == "fruit" ? 0.7 : 0,
        vegetable: data[3] == "vegetable" ? 0.7 : 0,
      },
    });
  });
});

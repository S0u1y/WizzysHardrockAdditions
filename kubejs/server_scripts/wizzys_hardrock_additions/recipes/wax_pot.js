function potting_recipe(event, sealing_ingredient) {
  let base_ingredients = [
    {
      item: "artisanal:ceramic/small_pot",
    },
    {
      item: sealing_ingredient,
    },
    {
      item: "tfc:powder/saltpeter",
    },
  ];
  for (let i = 1; i <= 6; i++) {
    base_ingredients.push({
      type: "tfc:not_rotten",
      ingredient: {
        tag: "artisanal:foods/can_be_potted",
      },
    });

    event.custom({
      type: "tfc:advanced_shapeless_crafting",
      ingredients: base_ingredients,
      result: {
        stack: {
          item: "artisanal:ceramic/closed_small_pot",
        },
        modifiers: [
          {
            type: "tfc:meal",
            food: {
              decay_modifier: 4.5,
            },
            portions: [
              {
                ingredient: {
                  tag: "artisanal:foods/can_be_canned",
                },
                nutrient_modifier: 0,
                water_modifier: 0,
                saturation_modifier: 0,
              },
            ],
          },
          {
            type: "artisanal:inherit_decay",
            decay_multiplier: 0.33,
          },
          "artisanal:homogenous_ingredients",
          "tfc:copy_oldest_food",
        ],
      },
      primary_ingredient: {
        tag: "artisanal:foods/can_be_potted",
      },
    });
  }
}

ServerEvents.recipes((event) => {
  potting_recipe(event, "firmalife:beeswax");
});

function safe_call(callback) {
  try {
    return callback();
  } catch (error) {
    console.error(error);
    return Item.of("minecraft:stick");
  }
}

let leather_armors = [
  Item.of("minecraft:leather_helmet"),
  Item.of("minecraft:leather_chestplate"),
  Item.of("minecraft:leather_leggings"),
  Item.of("minecraft:leather_boots"),
  Item.of("textile:crocodile_hat"),
  Item.of("textile:crocodile_shirt"),
  Item.of("textile:crocodile_pants"),
  Item.of("textile:crocodile_boots"),
  Item.of("tfchotornot:mittens"),
].concat(Ingredient.of("#textile:fur_clothes").stacks.toArray());

let wool_armors = [
  Item.of("textile:wool_hat"),
  Item.of("textile:wool_shirt"),
  Item.of("textile:wool_pants"),
  Item.of("cold_sweat:goat_fur_helmet"),
  Item.of("cold_sweat:goat_fur_chestplate"),
  Item.of("cold_sweat:goat_fur_leggings"),
  Item.of("cold_sweat:goat_fur_boots"),
];

let burlap_armors = [
  Item.of("textile:burlap_hat"),
  Item.of("textile:burlap_shirt"),
  Item.of("textile:burlap_pants"),
  Item.of("tfchotornot:burlap_potholder"),

  Item.of("firmalife:beekeeper_helmet"),
  Item.of("firmalife:beekeeper_chestplate"),
  Item.of("firmalife:beekeeper_leggings"),
  Item.of("firmalife:beekeeper_boots"),
];

let silk_armors = [
  Item.of("tfchotornot:silk_potholder"),
  Item.of("textile:silk_hat"),
  Item.of("textile:silk_shirt"),
  Item.of("textile:silk_pants"),
];

let cotton_armor = [
  Item.of("textile:cotton_hat"),
  Item.of("textile:cotton_shirt"),
  Item.of("textile:cotton_pants"),
];

let needles = Ingredient.of([
  //or "#sewingkit:needles/wood_or_higher"
  "sewingkit:bone_sewing_needle",
  "sewingkit:wood_sewing_needle",
  "sewingkit:iron_sewing_needle",
  "sewingkit:diamond_sewing_needle",
  "tfc:bone_needle",
]);

ServerEvents.recipes((event) => {
  const repairing = (_ingredient, _items) => {
    _items.forEach((_item) => {
      event
        .shapeless(_item, [needles, _ingredient, _item.ignoreNBT()])
        .damageIngredient(needles)
        .modifyResult((grid, result) => {
          try {
            let item = grid.find(_item.ignoreNBT());
            if (!item) return result;

            item.setDamageValue(0);
            return item;
          } catch (error) {
            console.error(error);

            return Item.of("minecraft:stick"); //something went wrong!
          }
        })
        .id("htfc4_repairs:repair_" + _item.id.split(":")[1]);
    });
  };

  repairing("minecraft:leather", leather_armors);
  repairing("tfc:wool", wool_armors);
  repairing("tfc:burlap_cloth", burlap_armors);
  repairing("tfc:silk_cloth", silk_armors);
  repairing("textile:cotton_cloth", cotton_armor);

  // const bronzeArmor = [
  //   "tfc:armor/bronze_helmet",
  //   "tfc:armor/bronze_chestplate",
  //   "tfc:armor/bronze_leggings",
  //   "tfc:armor/bronze_boots",
  // ];

  // event.recipes.tfc
  //   .welding(
  //     Item.of("tfc:metal/chestplate/wrought_iron"),
  //     "#forge:double_sheets/wrought_iron",
  //     Item.of("tfc:metal/chestplate/wrought_iron").ignoreNBT(),
  //   )
  //   .modifyResult((grid, stack) => {
  //     try {
  //       let item = grid.find(
  //         Item.of("tfc:metal/chestplate/wrought_iron").ignoreNBT(),
  //       );
  //       if (!item) return stack;

  //       item.setDamageValue(0);
  //       return item;
  //     } catch (error) {
  //       console.error(error);

  //       return Item.of("minecraft:stick"); //something went wrong!
  //     }
  //   })
  // .id("htfc4_repairs:repair_wrought_iron_chestplate")
  // ;
});

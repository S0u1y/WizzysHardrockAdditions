"use strict";
// Table of juices used globally to create fluids, add tags, register as drinkable and make recipes
global["wizzys_hardrock_additions:juices"] = {
  cherry_juice: [
    "wizzys_hardrock_additions:cherry_juice", //id
    0x930d14, //Fluid color
    "Cherry Juice", //Display name
    "fruit", //Type
    "tfc:food/cherry", //Item to juice
  ],
  blueberry_juice: [
    "wizzys_hardrock_additions:blueberry_juice",
    0x444983, // Dusty Indigo/Blue
    "Blueberry Juice",
    "fruit",
    "tfc:food/blueberry",
  ],
  blackberry_juice: [
    "wizzys_hardrock_additions:blackberry_juice",
    0x2e132d, // Very Dark Purple/Black
    "Blackberry Juice",
    "fruit",
    "tfc:food/blackberry",
  ],
  raspberry_juice: [
    "wizzys_hardrock_additions:raspberry_juice",
    0xe12643, // Vibrant Pinkish Red
    "Raspberry Juice",
    "fruit",
    "tfc:food/raspberry",
  ],
  elderberry_juice: [
    "wizzys_hardrock_additions:elderberry_juice",
    0x40142a, // Dark Wine/Maroon
    "Elderberry Juice",
    "fruit",
    "tfc:food/elderberry",
  ],
  cranberry_juice: [
    "wizzys_hardrock_additions:cranberry_juice",
    0xbf0f2e, // Bright, Tart Red
    "Cranberry Juice",
    "fruit",
    "tfc:food/cranberry",
  ],
  strawberry_juice: [
    "wizzys_hardrock_additions:strawberry_juice",
    0xf2323e, // Lighter, Sweet Red
    "Strawberry Juice",
    "fruit",
    "tfc:food/strawberry",
  ],
};

global["wizzys_hardrock_additions:fluid_tags"] = {
  "tfc:drinkables": [],
  // "tfc:mixables": [],
  "tfc:usable_in_barrel": [],
  "tfc:usable_in_jug": [],
  "tfc:usable_in_wooden_bucket": [],
};

/**
 *
 * @param {Registry.Fluid} event Fluid Registry Event
 * @param {string} id id of fluid
 * @param {Color_} color Color of fluid
 * @param {string} name Display name
 */
function create_juice(event, id, color, name) {
  event
    .create(id)
    .thinTexture(color)
    .bucketColor(color)
    .displayName(name)
    .noBlock();

  Object.keys(global["wizzys_hardrock_additions:fluid_tags"]).forEach(
    (value, idx) => {
      global["wizzys_hardrock_additions:fluid_tags"][value].push(id);
    },
  );
}

StartupEvents.registry("fluid", (event) => {
  function create_juice2(id, color, name) {
    create_juice(event, id, color, name);
  }
  Object.keys(global["wizzys_hardrock_additions:juices"]).forEach((v) => {
    console.log("registering juice: " + v);
    let l = global["wizzys_hardrock_additions:juices"][v];
    create_juice2(l[0], l[1], l[2]);
  });
});

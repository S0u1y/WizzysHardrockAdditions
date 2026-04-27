"use strict";

ServerEvents.tags("fluid", (event) => {
  Object.keys(global["wizzys_hardrock_additions:fluid_tags"]).forEach(
    (tag_id, idx) => {
      event.add(tag_id, global["wizzys_hardrock_additions:fluid_tags"][tag_id]);
    },
  );
});

ServerEvents.tags("item", (event) => {
  // Fix raw mutton cannot be hung
  event.add("firmalife:can_be_hung", "minecraft:mutton");
  event.add("firmalife:can_be_hung", "forge:raw_meats");
});

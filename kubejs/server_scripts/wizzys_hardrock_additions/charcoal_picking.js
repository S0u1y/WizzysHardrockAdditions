const $InteractionHand = Java.loadClass("net.minecraft.world.InteractionHand");

/**
 *
 * @param {Internal.BlockRightClickedEventJS} event
 */
global["getCharcoalBlock"] = (event) => {
  const hand = event.getHand();
  const block = event.getBlock();
  const player = event.getPlayer();

  // Only run on the main hand to prevent double-firing (main hand + offhand)
  if (hand !== $InteractionHand.MAIN_HAND) return;

  // Check if the block right-clicked is a TFC charcoal pile

  if (block.id === "tfc:charcoal_pile") {
    if (!player.isCrouching()) {
      if (event.getItem() !== "air") return;
      // Give the player 1 charcoal
      player.give("minecraft:charcoal");

      player.playSound("minecraft:block.wood.break", 0.5, 1.0);

      block.blockState.onDestroyedByPlayer(
        event.level,
        block.pos,
        player,
        true,
        event.level.getFluidState(block.pos),
      );

      player.swing();

      // Cancel the default right-click behavior so GUI/placement doesn't happen
      event.success()
    }
  }
//   Can't do much with shift being held, because tfc injects itself into that event forcefully :(
};

BlockEvents.rightClicked((event) => {
  global["getCharcoalBlock"](event);
});

// @ ts-check

const $CROP_BLOCK = Java.loadClass(
  "net.dries007.tfc.common.blocks.crop.CropBlock",
);
let $CROP_BLOCK_TEXTILE;
let textilePresent = Platform.isLoaded("textile");
if (textilePresent) {
  $CROP_BLOCK_TEXTILE = Java.loadClass(
    "net.atobaazul.textile.crop.TextileCropBlock",
  );
}

const fertilizerNames = {
  NITROGEN: "tfg.tooltip.fertilizer.nitrogen",
  POTASSIUM: "tfg.tooltip.fertilizer.potassium",
  PHOSPHOROUS: "tfg.tooltip.fertilizer.phosphorus",
};

const $Month = Java.loadClass("net.dries007.tfc.util.calendar.Month");
const $Climate = Java.loadClass("net.dries007.tfc.util.climate.Climate");
const $ICalendar = Java.loadClass("net.dries007.tfc.util.calendar.ICalendar");
const $Calendars = Java.loadClass("net.dries007.tfc.util.calendar.Calendars");
const $ChunkData = Java.loadClass("net.dries007.tfc.world.chunkdata.ChunkData");

const $ClimateRenderCache = Java.loadClass(
  "net.dries007.tfc.client.ClimateRenderCache",
);
const $ClimateModels = Java.loadClass(
  "net.dries007.tfc.util.climate.ClimateModels",
);
const overworldModel = $ClimateModels.OVERWORLD.get().factory().get();
const $OverWorldClimateModel = Java.loadClass(
  "net.dries007.tfc.util.climate.OverworldClimateModel",
);

const calendar = $Calendars.get();

/**
 * Get Starte and end ticks of a month based on the current calendar ticks/day
 * @param {net.dries007.tfc.util.calendar.Month} month
 * @returns {[number, number]} start and end ticks of the month
 */
function getMonthStartAndEndTicks(month) {
  let dayOfMonth = calendar.getDayOfMonth(
    calendar.getCalendarTicks(),
    calendar.getCalendarDaysInMonth(),
  );
  let monthIdx = month.ordinal();
  let monthDifference = monthIdx - calendar.getCalendarMonthOfYear().ordinal();
  let startingMonthDay =
    1 - dayOfMonth + monthDifference * calendar.getCalendarDaysInMonth();
  let endingMonthDay = startingMonthDay + calendar.getCalendarDaysInMonth() - 1;
  let currentTicks = calendar.getCalendarTicks();
  let startTicks = currentTicks + startingMonthDay * $ICalendar.TICKS_IN_DAY;
  let endTicks = currentTicks + endingMonthDay * $ICalendar.TICKS_IN_DAY;
  return [startTicks, endTicks];
}

/**
 * Get the average temperature for a given
 * @param {Internal.LocalPlayer} player
 * @param {net.dries007.tfc.util.calendar.Month} month
 * @returns {number} average temperature of the month
 */
function getMonthAverageTemperature(player, month) {
  let [startTicks, endTicks] = getMonthStartAndEndTicks(month);
  let startOfMonthTemp = $Climate.getTemperature(
    player.level,
    player.blockPosition(),
    startTicks,
    calendar.getCalendarDaysInMonth(),
  );
  let endOfMonthTemp = $Climate.getTemperature(
    player.level,
    player.blockPosition(),
    endTicks,
    calendar.getCalendarDaysInMonth(),
  );
  return (startOfMonthTemp + endOfMonthTemp) / 2;
}

/**
 * @param {Internal.LocalPlayer} player
 *
 */

global["getAverageMonthlyTemperature"] = (player) => {
  if (!player) return;
  let mothTemperatures = {};

  $Month.values().forEach((month) => {
    // const tempModifier = month.getTemperatureModifier();

    let monthlyTemp = getMonthAverageTemperature(player, month);

    mothTemperatures[month.name()] = monthlyTemp;
  });

  return mothTemperatures;
};

const $Crop = Java.loadClass("net.dries007.tfc.common.blocks.crop.Crop");
const allCrops = $Crop.values();
ItemEvents.tooltip((event) => {
  for (let i = 0; i < allCrops.length; i++) {
    let tfcCrop = allCrops[i];
    let name = tfcCrop.getSerializedName();
    let seedId = `tfc:seeds/${name}`;

    let nutrient = tfcCrop.getPrimaryNutrient().name();
    let resolvedNutrient = fertilizerNames[nutrient] || undefined; //For translations

    if (nutrient == "POTASSIUM") {
      event.add(
        seedId,
        Text.of(["Nutrient: ", Text.of("Potassium").withStyle("light_purple")]),
      );
    } else if (nutrient == "NITROGEN") {
      event.add(
        seedId,
        Text.of(["Nutrient: ", Text.of("Nitrogen").withStyle("blue")]),
      );
    } else if (nutrient == "PHOSPHOROUS") {
      event.add(
        seedId,
        Text.of(["Nutrient: ", Text.of("Phosphorus").withStyle("yellow")]),
      );
    }
    let climateRange = tfcCrop.getClimateRange().get();

    let minTemp = climateRange.getMinTemperature(false);
    let maxTemp = climateRange.getMaxTemperature(false);
    event.add(
      seedId,
      Text.of([
        "Temperature Range: ",
        Text.of(`${minTemp}°C - ${maxTemp}°C`).withStyle("red"),
      ]),
    );

    event.addAdvanced(seedId, (itemStack, isAdvanced, lines) => {
      let averageMonthlyTemps = global["getAverageMonthlyTemperature"](
        Client.player,
      );
      let currentMonth = calendar.getCalendarMonthOfYear();
      let currentTemp = $Climate.getTemperature(
        Client.player.level,
        Client.player.blockPosition(),
      );

      if (
        averageMonthlyTemps[currentMonth.name()] < minTemp ||
        averageMonthlyTemps[currentMonth.name()] > maxTemp
      ) {
        lines.add(Text.of(["Does not grow this month."]).withStyle("dark_red"));
      } else {
        lines.add(Text.of(["Grows now!"]).withStyle("green"));
      }

      if (currentTemp < minTemp || currentTemp > maxTemp) {
        lines.set(
          lines.length - 1,
          Text.of(["Does not grow this month."]).withStyle("dark_red"),
        );
      } else {
        lines.set(lines.length - 1, Text.of(["Grows now!"]).withStyle("green"));
      }

      if (event.shift) {
        let availableMonths = [];
        Object.keys(averageMonthlyTemps).forEach((month) => {
          let temp = averageMonthlyTemps[month];
          if (temp >= minTemp && temp <= maxTemp) {
            availableMonths.push(
              Text.ofString(month.substring(0, 3).toLowerCase()).withStyle(
                "green",
              ),
            );
          } else if (month == currentMonth) {
            availableMonths.push(
              Text.ofString(month.substring(0, 3).toLowerCase()).withStyle(
                "red",
              ),
            );
          }
        });

        let index = 1;
        while (true) {
          if (index + 1 >= availableMonths.length) break;
          let previous = availableMonths[index - 1];
          let current = availableMonths[index];
          let next = availableMonths[index + 1];

          if (
            previous.style.color.toString() == "green" &&
            next.style.color.toString() == "green" &&
            current.style.color.toString() == "green"
          ) {
            availableMonths[index] = Text.of("-").withStyle("green");
            if (previous.string == "-") {
              availableMonths.splice(index - 1, 1);
              continue;
            }
          }
          if (current.style.color.toString() == "red") {
            availableMonths[index] = Text.of([", ", current, ", "]);
            index++;
          }

          index++;
        }
        lines.add(Text.of(availableMonths));
      } else {
        lines.add(
          Text.of([
            "Hold ",
            Text.of("Shift").withStyle("italic"),
            " to see available months.",
          ]).withStyle("gray"),
        );
      }
    });
  }
});

// Tell Jade to add nutrient tooltip to crop blocks
/**
 * @param {Internal.ITooltipWrapper} tag
 * @param {Internal.BlockAccessor} accessor
 * @param {Internal.IPluginConfig} pluginConfig
 * @returns {void}
 */
global["JadeCropBlocksClientCallback"] = (tooltip, accessor, pluginConfig) => {
  let nutrient;
  if (accessor.block.getPrimaryNutrient !== undefined) {
    nutrient = accessor.block.getPrimaryNutrient().toString().toLowerCase();
  } else {
    console.log(
      `Block ${accessor.block} does not have getPrimaryNutrient method!`,
    );
  }

  if (!nutrient) return;

  if (nutrient == "potassium") {
    tooltip.add(
      Text.of(["Nutrient: ", Text.of("Potassium").withStyle("light_purple")]),
    );
  } else if (nutrient == "nitrogen") {
    tooltip.add(Text.of(["Nutrient: ", Text.of("Nitrogen").withStyle("blue")]));
  } else if (nutrient == "phosphorus" || nutrient == "phosphorous") {
    tooltip.add(
      Text.of(["Nutrient: ", Text.of("Phosphorus").withStyle("yellow")]),
    );
  } else {
    console.log(
      `Crop block ${accessor.block} has unknown nutrient: ${nutrient}`,
    );
  }
};

JadeEvents.onClientRegistration((event) => {
  event
    .block("htfc4:crop_block", $CROP_BLOCK)
    .tooltip((tooltip, accessor, pluginConfig) => {
      global["JadeCropBlocksClientCallback"](tooltip, accessor, pluginConfig);
    });
  if (textilePresent && $CROP_BLOCK_TEXTILE) {
    event
      .block("htfc4:crop_block", $CROP_BLOCK_TEXTILE)
      .tooltip((tooltip, accessor, pluginConfig) => {
        global["JadeCropBlocksClientCallback"](tooltip, accessor, pluginConfig);
      });
  }
});

var character = null;
var races = null;
var base_classes = null;
var backgrounds = null;

// load all the json
var character_promise = $.getJSON("character.json", function(data) {
  character = data;
});

var races_promise = $.getJSON("races.json", function(data) {
  races = data;
});

var base_classes_promise = $.getJSON("base_classes.json", function(data) {
  base_classes = data;
});

var backgrounds_promise = $.getJSON("backgrounds.json", function(data) {
  backgrounds = data;
});

/* returns a random number between the min and max values (inclusive) */
function random_range(min, max) {
  return Math.floor(min + Math.random() * max);
}


/* rolls dice with the conventional dice rolling notation as input
 *   dice_string is a string with the format XdY
 *     X is the number of dice to be rolled
 *     Y is the number of faces on the dice that you're rolling
 *   drop_lowest, if set to true, will drop the lowest value that was rolled, 
 *     and return the sum of the rest
 * example: roll_dice("4d6") will roll 4 dice with 6 faces, 
 *          returning a value between 4 and 24
 * example: roll_dice("4d6", true) might roll: 3, 4, 5, 3,
 *          which would drop a 3, and return 12
 */
function roll_dice(dice_string, drop_lowest=false) {
  var split_notation = dice_string.split("d");
  var num_rolls = split_notation[0];
  var num_faces = split_notation[1];

  var roll;
  var lowest = Number.MAX_SAFE_INTEGER;
  var total = 0;

  for (var i = 0; i < num_rolls; ++i) {
    var roll = random_range(1, num_faces);
    total += roll;
    if (drop_lowest) {
      if (lowest > roll) {
        lowest = roll;
      }
    }
  }

  if (drop_lowest) {
    total -= lowest;
  }

  return total;
}

/* Returns the ability modifier for the ability value you put in there */
function get_ability_mod(ability_value) {
  return Math.floor((ability_value - 10)/2);
}

// Source: https://stackoverflow.com/a/19270021
/* Gets n items from an array without any duplicates */
function get_items_in_array(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

/* Returns the data for the race in the races variable corresponding to the input name
 *   This is pretty much just for being able to draw extra data on the screen
 *   that's not being stored in the character
 */
function get_race_data(race_name) {
  for (var i in races) {
    if (races[i].name == race_name) {
        return races[i];
    }
  }
  console.log("ERROR: Couldn't find " + race_name);
  return null;
}

/* Applies a random race to the character */
function random_race() {
  var num_races = races.length;

  var race = races[random_range(0, num_races)];
  // apply name
  character.race = race.name;

  // Half-Elf gets two random ability scores +1
  if (race.name == "Half-Elf") {
    var ability_idxs = get_items_in_array([0, 1, 2, 3, 4, 5], 2);
    for (var i in ability_idxs) {
      switch (ability_idxs[i]) {
        case 0:
          ++race.ability_scores.str;
          break;
        case 1:
          ++race.ability_scores.dex;
          break;
        case 2:
          ++race.ability_scores.con;
          break;
        case 3:
          ++race.ability_scores.int;
          break;
        case 4:
          ++race.ability_scores.wis;
          break;
        case 5:
          ++race.ability_scores.cha;
          break;
      }
    }
  }
  // apply ability scores
  character.ability_scores.str += race.ability_scores.str;
  character.ability_scores.dex += race.ability_scores.dex;
  character.ability_scores.con += race.ability_scores.con;
  character.ability_scores.int += race.ability_scores.int;
  character.ability_scores.wis += race.ability_scores.wis;
  character.ability_scores.cha += race.ability_scores.cha;


  // apply physical attributes
  character.age = random_range(race.age[0], race.age[1]);
  character.height = race.base_height + roll_dice(race.height_modifier);
  character.weight = race.base_weight * roll_dice(race.weight_modifier);

  // apply racial trait(s), if any exist
  if (race.trait !== null) {
    character.racial_trait = [];
    // push a random trait from each choice the race has
    for (var i in race.trait) {
      var num_traits = race.trait[i].length
      character.racial_trait.push(race.trait[i][random_range(0, num_traits)]);
    }
  }

  // apply proficiencies
  if (race.armor_proficiencies !== null) {
    for (var i in race.armor_proficiencies) {
      if (typeof race.armor_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(race.armor_proficiencies[i].slice(1), race.armor_proficiencies[i][0]);
        for (var j in items) {
          if (!character.armor_proficiencies.includes(items[j])) {
            character.armor_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.armor_proficiencies.includes(race.armor_proficiencies[i])) {
          character.armor_proficiencies.push(race.armor_proficiencies[i]);
        }
      }
    }
  }

  if (race.weapon_proficiencies !== null) {
    for (var i in race.weapon_proficiencies) {
      if (typeof race.weapon_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(race.weapon_proficiencies[i].slice(1), race.weapon_proficiencies[i][0]);
        for (var j in items) {
          if (!character.weapon_proficiencies.includes(items[j])) {
            character.weapon_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.weapon_proficiencies.includes(race.weapon_proficiencies[i])) {
          character.weapon_proficiencies.push(race.weapon_proficiencies[i]);
        }
      }
    }
  }

  if (race.tool_proficiencies !== null) {
    for (var i in race.tool_proficiencies) {
      if (typeof race.tool_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(race.tool_proficiencies[i].slice(1), race.tool_proficiencies[i][0]);
        for (var j in items) {
          if (!character.tool_proficiencies.includes(items[j])) {
            character.tool_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.tool_proficiencies.includes(race.tool_proficiencies[i])) {
          character.tool_proficiencies.push(race.tool_proficiencies[i]);
        }
      }
    }
  }

  if (race.saving_throw_proficiencies !== null) {
    for (var i in race.saving_throw_proficiencies) {
      if (typeof race.saving_throw_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(race.saving_throw_proficiencies[i].slice(1), race.saving_throw_proficiencies[i][0]);
        for (var j in items) {
          if (!character.saving_throw_proficiencies.includes(items[j])) {
            character.saving_throw_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.saving_throw_proficiencies.includes(race.saving_throw_proficiencies[i])) {
          character.saving_throw_proficiencies.push(race.saving_throw_proficiencies[i]);
        }
      }
    }
  }

  if (race.skill_proficiencies !== null) {
    for (var i in race.skill_proficiencies) {
      if (typeof race.skill_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(race.skill_proficiencies[i].slice(1), race.skill_proficiencies[i][0]);
        for (var j in items) {
          if (!character.skill_proficiencies.includes(items[j])) {
            character.skill_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.skill_proficiencies.includes(race.skill_proficiencies[i])) {
          character.skill_proficiencies.push(race.skill_proficiencies[i]);
        }
      }
    }
  }

  if (race.languages !== null) {
    for (var i in race.languages) {
      if (typeof race.languages[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(race.languages[i].slice(1), race.languages[i][0]);
        for (var j in items) {
          if (!character.languages.includes(items[j])) {
            character.languages.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.languages.includes(race.languages[i])) {
          character.languages.push(race.languages[i]);
        }
      }
    }
  }
}

/* Applies a random base class to the character */
function random_base_class() {
  var num_classes = base_classes.length;

  var base_class = base_classes[random_range(0, base_classes.length)];
  // apply class name
  character.class.push(base_class.name);

  // add hit points
  var new_hit_points = roll_dice(base_class.hit_die) + get_ability_mod(character.ability_scores.con);
  // if character is a Hill Dwarf, they get an extra hit point per level
  if (character.race == "Hill Dwarf") {
    ++new_hit_points;
  }
  if (new_hit_points < 1) {
    new_hit_points = 1;
  }
  character.hit_points += new_hit_points;

  // apply proficiencies
  if (base_class.armor_proficiencies !== null) {
    for (var i in base_class.armor_proficiencies) {
      if (typeof base_class.armor_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(base_class.armor_proficiencies[i].slice(1), base_class.armor_proficiencies[i][0]);
        for (var j in items) {
          if (!character.armor_proficiencies.includes(items[j])) {
            character.armor_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.armor_proficiencies.includes(base_class.armor_proficiencies[i])) {
          character.armor_proficiencies.push(base_class.armor_proficiencies[i]);
        }
      }
    }
  }

  if (base_class.weapon_proficiencies !== null) {
    for (var i in base_class.weapon_proficiencies) {
      if (typeof base_class.weapon_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(base_class.weapon_proficiencies[i].slice(1), base_class.weapon_proficiencies[i][0]);
        for (var j in items) {
          if (!character.weapon_proficiencies.includes(items[j])) {
            character.weapon_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.weapon_proficiencies.includes(base_class.weapon_proficiencies[i])) {
          character.weapon_proficiencies.push(base_class.weapon_proficiencies[i]);
        }
      }
    }
  }

  if (base_class.tool_proficiencies !== null) {
    for (var i in base_class.tool_proficiencies) {
      if (typeof base_class.tool_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(base_class.tool_proficiencies[i].slice(1), base_class.tool_proficiencies[i][0]);
        for (var j in items) {
          if (!character.tool_proficiencies.includes(items[j])) {
            character.tool_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.tool_proficiencies.includes(base_class.tool_proficiencies[i])) {
          character.tool_proficiencies.push(base_class.tool_proficiencies[i]);
        }
      }
    }
  }

  if (base_class.saving_throw_proficiencies !== null) {
    for (var i in base_class.saving_throw_proficiencies) {
      if (typeof base_class.saving_throw_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(base_class.saving_throw_proficiencies[i].slice(1), base_class.saving_throw_proficiencies[i][0]);
        for (var j in items) {
          if (!character.saving_throw_proficiencies.includes(items[j])) {
            character.saving_throw_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.saving_throw_proficiencies.includes(base_class.saving_throw_proficiencies[i])) {
          character.saving_throw_proficiencies.push(base_class.saving_throw_proficiencies[i]);
        }
      }
    }
  }

  if (base_class.skill_proficiencies !== null) {
    for (var i in base_class.skill_proficiencies) {
      if (typeof base_class.skill_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(base_class.skill_proficiencies[i].slice(1), base_class.skill_proficiencies[i][0]);
        for (var j in items) {
          if (!character.skill_proficiencies.includes(items[j])) {
            character.skill_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.skill_proficiencies.includes(base_class.skill_proficiencies[i])) {
          character.skill_proficiencies.push(base_class.skill_proficiencies[i]);
        }
      }
    }
  }

  // sort out equipment
  if (base_class.equipment !== null) {
    for (var i in base_class.equipment) {
      if (typeof base_class.equipment[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(base_class.equipment[i].slice(1), base_class.equipment[i][0]);
        for (var j in items) {
          character.equipment.push(items[j]);
        }
      } else {
        // append to list
        character.equipment.push(base_class.equipment[i]);
      }
    }
  }
}

/* Applies a random background to the character */
function random_background() {
  var num_backgrounds = backgrounds.length;

  var background = backgrounds[random_range(0, backgrounds.length)];
  // apply background name
  character.background = background.name;

  // apply proficiencies
  if (background.skill_proficiencies !== null) {
    for (var i in background.skill_proficiencies) {
      if (typeof background.skill_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(background.skill_proficiencies[i].slice(1), background.skill_proficiencies[i][0]);
        for (var j in items) {
          if (!character.skill_proficiencies.includes(items[j])) {
            character.skill_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.skill_proficiencies.includes(background.skill_proficiencies[i])) {
          character.skill_proficiencies.push(background.skill_proficiencies[i]);
        }
      }
    }
  }

  if (background.tool_proficiencies !== null) {
    for (var i in background.tool_proficiencies) {
      if (typeof background.tool_proficiencies[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(background.tool_proficiencies[i].slice(1), background.tool_proficiencies[i][0]);
        for (var j in items) {
          if (!character.tool_proficiencies.includes(items[j])) {
            character.tool_proficiencies.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.tool_proficiencies.includes(background.tool_proficiencies[i])) {
          character.tool_proficiencies.push(background.tool_proficiencies[i]);
        }
      }
    }
  }

  if (background.languages !== null) {
    for (var i in background.languages) {
      if (typeof background.languages[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(background.languages[i].slice(1), background.languages[i][0]);
        for (var j in items) {
          if (!character.languages.includes(items[j])) {
            character.languages.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.languages.includes(background.languages[i])) {
          character.languages.push(background.languages[i]);
        }
      }
    }
  }

  // sort out equipment
  if (background.equipment !== null) {
    for (var i in background.equipment) {
      if (typeof background.equipment[i][0] == "number") {
        // choose number of items in list
        var items = get_items_in_array(background.equipment[i].slice(1), background.equipment[i][0]);
        for (var j in items) {
          character.equipment.push(items[j]);
        }
      } else {
        // append to list
        character.equipment.push(background.equipment[i]);
      }
    }
  }

  // give money
  character.money += background.money;
}

/* Adds the character information to the HTML */
function fill_page() {
  var race = get_race_data(character.race);

  // draw race
  $("#race").text(character.race);

  // draw background
  $("#background").text(character.background);

  // draw ability scores
  $("#str").text(character.ability_scores.str);
  $("#str_mod").text((get_ability_mod(character.ability_scores.str) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.str));
  $("#str_detailed").text("(" + (character.ability_scores.str - race.ability_scores.str) + " + " + (race.ability_scores.str) + ")");
  $("#dex").text(character.ability_scores.dex);
  $("#dex_mod").text((get_ability_mod(character.ability_scores.dex) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.dex));
  $("#dex_detailed").text("(" + (character.ability_scores.dex - race.ability_scores.dex) + " + " + (race.ability_scores.dex) + ")");
  $("#con").text(character.ability_scores.con);
  $("#con_mod").text((get_ability_mod(character.ability_scores.con) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.con));
  $("#con_detailed").text("(" + (character.ability_scores.con - race.ability_scores.con) + " + " + (race.ability_scores.con) + ")");
  $("#int").text(character.ability_scores.int);
  $("#int_mod").text((get_ability_mod(character.ability_scores.int) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.int));
  $("#int_detailed").text("(" + (character.ability_scores.int - race.ability_scores.int) + " + " + (race.ability_scores.int) + ")");
  $("#wis").text(character.ability_scores.wis);
  $("#wis_mod").text((get_ability_mod(character.ability_scores.wis) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.wis));
  $("#wis_detailed").text("(" + (character.ability_scores.wis - race.ability_scores.wis) + " + " + (race.ability_scores.wis) + ")");
  $("#cha").text(character.ability_scores.cha);
  $("#cha_mod").text((get_ability_mod(character.ability_scores.cha) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.cha));
  $("#cha_detailed").text("(" + (character.ability_scores.cha - race.ability_scores.cha) + " + " + (race.ability_scores.cha) + ")");

  // draw base class
  for (var i in character.class) {
    $("#class").text(character.class[i]);
  }

  // draw HP
  $("#hp").text(character.hit_points);

  // draw skills
  if (character.skill_proficiencies.includes("Acrobatics")) {
    $("#acrobatics_proficient").text("●");
  } else {
    $("#acrobatics_proficient").text("○");
  }
  $("#acrobatics").text((get_ability_mod(character.ability_scores.dex) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.dex));

  if (character.skill_proficiencies.includes("Animal Handling")) {
    $("#animal_handling_proficient").text("●");
  } else {
    $("#animal_handling_proficient").text("○");
  }
  $("#animal_handling").text((get_ability_mod(character.ability_scores.wis) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.wis));

  if (character.skill_proficiencies.includes("Arcana")) {
    $("#arcana_proficient").text("●");
  } else {
    $("#arcana_proficient").text("○");
  }
  $("#arcana").text((get_ability_mod(character.ability_scores.int) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.int));

  if (character.skill_proficiencies.includes("Athletics")) {
    $("#athletics_proficient").text("●");
  } else {
    $("#athletics_proficient").text("○");
  }
  $("#athletics").text((get_ability_mod(character.ability_scores.str) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.str));

  if (character.skill_proficiencies.includes("Deception")) {
    $("#deception_proficient").text("●");
  } else {
    $("#deception_proficient").text("○");
  }
  $("#deception").text((get_ability_mod(character.ability_scores.cha) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.cha));

  if (character.skill_proficiencies.includes("History")) {
    $("#history_proficient").text("●");
  } else {
    $("#history_proficient").text("○");
  }
  $("#history").text((get_ability_mod(character.ability_scores.int) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.int));

  if (character.skill_proficiencies.includes("Insight")) {
    $("#insight_proficient").text("●");
  } else {
    $("#insight_proficient").text("○");
  }
  $("#insight").text((get_ability_mod(character.ability_scores.wis) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.wis));

  if (character.skill_proficiencies.includes("Intimidation")) {
    $("#intimidation_proficient").text("●");
  } else {
    $("#intimidation_proficient").text("○");
  }
  $("#intimidation").text((get_ability_mod(character.ability_scores.cha) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.cha));

  if (character.skill_proficiencies.includes("Investigation")) {
    $("#investigation_proficient").text("●");
  } else {
    $("#investigation_proficient").text("○");
  }
  $("#investigation").text((get_ability_mod(character.ability_scores.int) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.int));

  if (character.skill_proficiencies.includes("Medicine")) {
    $("#medicine_proficient").text("●");
  } else {
    $("#medicine_proficient").text("○");
  }
  $("#medicine").text((get_ability_mod(character.ability_scores.wis) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.wis));

  if (character.skill_proficiencies.includes("Nature")) {
    $("#nature_proficient").text("●");
  } else {
    $("#nature_proficient").text("○");
  }
  $("#nature").text((get_ability_mod(character.ability_scores.int) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.int));

  if (character.skill_proficiencies.includes("Perception")) {
    $("#perception_proficient").text("●");
  } else {
    $("#perception_proficient").text("○");
  }
  $("#perception").text((get_ability_mod(character.ability_scores.wis) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.wis));

  if (character.skill_proficiencies.includes("Performance")) {
    $("#performance_proficient").text("●");
  } else {
    $("#performance_proficient").text("○");
  }
  $("#performance").text((get_ability_mod(character.ability_scores.cha) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.cha));

  if (character.skill_proficiencies.includes("Persuasion")) {
    $("#persuasion_proficient").text("●");
  } else {
    $("#persuasion_proficient").text("○");
  }
  $("#persuasion").text((get_ability_mod(character.ability_scores.cha) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.cha));

  if (character.skill_proficiencies.includes("Religion")) {
    $("#religion_proficient").text("●");
  } else {
    $("#religion_proficient").text("○");
  }
  $("#religion").text((get_ability_mod(character.ability_scores.int) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.int));

  if (character.skill_proficiencies.includes("Sleight of Hand")) {
    $("#sleight_of_hand_proficient").text("●");
  } else {
    $("#sleight_of_hand_proficient").text("○");
  }
  $("#sleight_of_hand").text((get_ability_mod(character.ability_scores.dex) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.dex));

  if (character.skill_proficiencies.includes("Stealth")) {
    $("#stealth_proficient").text("●");
  } else {
    $("#stealth_proficient").text("○");
  }
  $("#stealth").text((get_ability_mod(character.ability_scores.dex) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.dex));

  if (character.skill_proficiencies.includes("Survival")) {
    $("#survival_proficient").text("●");
  } else {
    $("#survival_proficient").text("○");
  }
  $("#survival").text((get_ability_mod(character.ability_scores.wis) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.wis));

  // draw saving throws
  // main ability throws
  if (character.saving_throw_proficiencies.includes("Strength")) {
    $("#str_throw_proficient").text("●");
  } else {
    $("#str_throw_proficient").text("○");
  }
  $("#str_throw").text((get_ability_mod(character.ability_scores.str) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.str));

  if (character.saving_throw_proficiencies.includes("Dexterity")) {
    $("#dex_throw_proficient").text("●");
  } else {
    $("#dex_throw_proficient").text("○");
  }
  $("#dex_throw").text((get_ability_mod(character.ability_scores.dex) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.dex));

  if (character.saving_throw_proficiencies.includes("Constitution")) {
    $("#con_throw_proficient").text("●");
  } else {
    $("#con_throw_proficient").text("○");
  }
  $("#con_throw").text((get_ability_mod(character.ability_scores.con) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.con));

  if (character.saving_throw_proficiencies.includes("Intelligence")) {
    $("#int_throw_proficient").text("●");
  } else {
    $("#int_throw_proficient").text("○");
  }
  $("#int_throw").text((get_ability_mod(character.ability_scores.int) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.int));

  if (character.saving_throw_proficiencies.includes("Wisdom")) {
    $("#wis_throw_proficient").text("●");
  } else {
    $("#wis_throw_proficient").text("○");
  }
  $("#wis_throw").text((get_ability_mod(character.ability_scores.wis) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.wis));

  if (character.saving_throw_proficiencies.includes("Charisma")) {
    $("#cha_throw_proficient").text("●");
  } else {
    $("#cha_throw_proficient").text("○");
  }
  $("#cha_throw").text((get_ability_mod(character.ability_scores.cha) > 0 ? "+" : "") + get_ability_mod(character.ability_scores.cha));

  // extra saving throws
  // make copy of saving throws without the base ones
  var saving_throw_copy = character.saving_throw_proficiencies.slice().filter(function(entry) {
    if (entry !== "Strength" && 
        entry !== "Dexterity" && 
        entry !== "Constitution" && 
        entry !== "Intelligence" && 
        entry !== "Wisdom" && 
        entry !== "Charisma") {
      return entry;
    }
  });
  for (var i in saving_throw_copy) {
    $(".saving_throws tr:last").after("<tr><td></td><td class=\"throw_label\">● " + saving_throw_copy[i] + "</td></tr>");
  }
}

$.when(character_promise, races_promise, base_classes_promise, backgrounds_promise).done(function() {
  // random ability scores
  character.ability_scores.str = roll_dice("4d6", true);
  character.ability_scores.dex = roll_dice("4d6", true);
  character.ability_scores.con = roll_dice("4d6", true);
  character.ability_scores.int = roll_dice("4d6", true);
  character.ability_scores.wis = roll_dice("4d6", true);
  character.ability_scores.cha = roll_dice("4d6", true);

  // random race
  random_race();

  // random class for each level
  random_base_class();

  // random background
  random_background()

  // put the information on the page
  fill_page();
});
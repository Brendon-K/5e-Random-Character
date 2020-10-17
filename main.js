let character = null;
let races = null;
let base_classes = null;
let backgrounds = null;
let spells = null;
let skills = null;

// load all the json
const character_promise = $.getJSON("character.json", function(data) {
  character = data;
});

const races_promise = $.getJSON("races.json", function(data) {
  races = data;
});

const base_classes_promise = $.getJSON("base_classes.json", function(data) {
  base_classes = data;
});

const backgrounds_promise = $.getJSON("backgrounds.json", function(data) {
  backgrounds = data;
});

const weapon_categories_promise = $.getJSON("weapon_categories.json", function(data) {
  weapon_categories = data;
});

const spells_promise = $.getJSON("spells.json", function(data) {
  spells = data;
});

const skills_promise = $.getJSON("skills.json", function(data) {
  skills = data;
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
  const split_notation = dice_string.split("d");
  const num_rolls = split_notation[0];
  const num_faces = split_notation[1];

  let lowest = Number.MAX_SAFE_INTEGER;
  let total = 0;

  for (let i = 0; i < num_rolls; ++i) {
    const roll = random_range(1, num_faces);
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
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("get_items_in_array: more elements taken than available");
  while (n--) {
    const x = Math.floor(Math.random() * len);
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
  for (let i in races) {
    if (races[i].name == race_name) {
        return races[i];
    }
  }
  console.log("ERROR: Couldn't find " + race_name);
  return null;
}

/* Removes "duplicates" in weapon proficiencies. 
 * For example, if already proficient in "Martial Weapons", and "Shortsword",
 * then "Shortsword" will be removed, as well as any other martial weapons.
 *
 * Also sorts.
 */
function neaten_weapon_proficiencies() {
  const temp_weapon_proficiencies = character.weapon_proficiencies.slice();
  if (temp_weapon_proficiencies.includes("Simple Weapons")) {
    for (let i in temp_weapon_proficiencies) {
      if (weapon_categories.simple_weapons.includes(temp_weapon_proficiencies[i])) {
        character.weapon_proficiencies = character.weapon_proficiencies.filter(entry => entry !== temp_weapon_proficiencies[i]);
      }
    }
  }
  if (temp_weapon_proficiencies.includes("Martial Weapons")) {
    for (let i in temp_weapon_proficiencies) {
      if (weapon_categories.martial_weapons.includes(temp_weapon_proficiencies[i])) {
        character.weapon_proficiencies = character.weapon_proficiencies.filter(entry => entry !== temp_weapon_proficiencies[i]);
      }
    }
  }

  // sort the proficiencies
  function get_value(weapon_name) {
    switch (weapon_name) {
      case "Simple Weapons":
        return 0;
        break;
      case "Martial Weapons":
        return 1;
        break;
      case "Club":
        return 2;
        break;
      case "Dagger":
        return 3;
        break;
      case "Greatclub":
        return 4;
        break;
      case "Handaxe":
        return 5;
        break;
      case "Javelin":
        return 6;
        break;
      case "Light Hammer":
        return 7;
        break;
      case "Mace":
        return 8;
        break;
      case "Quarterstaff":
        return 9;
        break;
      case "Sickle":
        return 10;
        break;
      case "Spear":
        return 11;
        break;
      case "Light Crossbow":
        return 12;
        break;
      case "Dart":
        return 13;
        break;
      case "Shortbow":
        return 14;
        break;
      case "Sling":
        return 15;
        break;
      case "Battleaxe":
        return 16;
        break;
      case "Flail":
        return 17;
        break;
      case "Glaive":
        return 18;
        break;
      case "Greataxe":
        return 19;
        break;
      case "Greatsword":
        return 20;
        break;
      case "Halberd":
        return 21;
        break;
      case "Lance":
        return 22;
        break;
      case "Longsword":
        return 23;
        break;
      case "Maul":
        return 24;
        break;
      case "Morningstar":
        return 25;
        break;
      case "Pike":
        return 26;
        break;
      case "Rapier":
        return 27;
        break;
      case "Scimitar":
        return 28;
        break;
      case "Shortsword":
        return 29;
        break;
      case "Trident":
        return 30;
        break;
      case "War Pick":
        return 31;
        break;
      case "Warhammer":
        return 32;
        break;
      case "Whip":
        return 33;
        break;
      case "Blowgun":
        return 34;
        break;
      case "Hand Crossbow":
        return 35;
        break;
      case "Heavy Crossbow":
        return 36;
        break;
      case "Longbow":
        return 37;
        break;
      case "Net":
        return 38;
        break;
    };
  }

  character.weapon_proficiencies.sort(function(a, b) {
    return get_value(a) - get_value(b);
  });
}

/* Assigns random ability scores using the point buy system
 *   Instead of rolling dice, this uses a pool of points
 *   that you spend to increase your ability scores
 */
function random_point_buy(points=27) {
  let ability_short = ["str", "dex", "con", "int", "wis", "cha"];
  const costs = new Map();
  costs[8] = 1;
  costs[9] = 1;
  costs[10] = 1;
  costs[11] = 1;
  costs[12] = 1;
  costs[13] = 2;
  costs[14] = 2;

  // all stats start at 8
  for (let i in ability_short) {
    character.ability_scores[ability_short[i]] = 8;
  }

  while (points > 0) {
    // choose a random ability to 
    const ability = get_items_in_array(ability_short, 1);
    // check if there are enough points to raise the ability
    if (points >= costs[character.ability_scores[ability[0]]] && character.ability_scores[ability[0]] < 15) {
      // subtract cost
      points -= costs[character.ability_scores[ability[0]]];
      // increment ability
      ++character.ability_scores[ability[0]];
    } else {
      // if not enough points, then remove from list so it doesn't come up again
      ability_short = ability_short.filter(entry => entry !== ability[0]);
      // if ability_short is empty, it's impossible to continue
      if (ability_short.length == 0) {
        break;
      }
    }
  }
}

/* Applies a random race to the character */
function random_race() {
  const num_races = races.length;

  const race = races[random_range(0, num_races)];
  // apply name
  character.race = race.name;

  // Half-Elf gets two random ability scores +1
  if (race.name == "Half-Elf") {
    const ability_idxs = get_items_in_array([0, 1, 2, 3, 4, 5], 2);
    for (let i in ability_idxs) {
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
    for (let i in race.trait) {
      const num_traits = race.trait[i].length
      character.racial_trait.push(race.trait[i][random_range(0, num_traits)]);
    }
  }

  // add various racial attributes
  const things = ["armor_proficiencies", 
                "weapon_proficiencies", 
                "tool_proficiencies", 
                "saving_throw_proficiencies", 
                "skill_proficiencies", 
                "languages"];
  for (let i in things) {
    if (race[things[i]] !== null) {
      for (let j in race[things[i]]) {
        if (typeof race[things[i]][j][0] == "number") {
          // choose number of items in list
          const items = get_items_in_array(race[things[i]][j].slice(1), race[things[i]][j][0]);
          for (let k in items) {
            if (!character[things[i]].includes(items[k])) {
              character[things[i]].push(items[k])
            }
          }
        } else {
          // append to list
          if (!character[things[i]].includes(race[things[i]][j])) {
            character[things[i]].push(race[things[i]][j]);
          }
        }
      }
    }
  }
}

/* Applies a random base class to the character */
function random_base_class() {
  const num_classes = base_classes.length;

  const base_class = base_classes[random_range(0, base_classes.length)];
  // apply class name
  character.class.push(base_class.name);

  // add hit points
  let new_hit_points = roll_dice(base_class.hit_die) + get_ability_mod(character.ability_scores.con);
  // if character is a Hill Dwarf, they get an extra hit point per level
  if (character.race == "Hill Dwarf") {
    ++new_hit_points;
  }
  // Hit points can't be less than one
  if (new_hit_points < 1) {
    new_hit_points = 1;
  }
  character.hit_points += new_hit_points;

  // apply various class attributes
  const things = ["armor_proficiencies",
                "weapon_proficiencies",
                "tool_proficiencies",
                "saving_throw_proficiencies",
                "skill_proficiencies"];
  for (let i in things) {
    if (base_class[things[i]] !== null) {
      for (let j in base_class[things[i]]) {
        if (typeof base_class[things[i]][j][0] == "number") {
          // choose number of items in list
          const items = get_items_in_array(base_class[things[i]][j].slice(1), base_class[things[i]][j][0]);
          for (let k in items) {
            if (!character[things[i]].includes(items[k])) {
              character[things[i]].push(items[k])
            }
          }
        } else {
          // append to list
          if (!character[things[i]].includes(base_class[things[i]][j])) {
            character[things[i]].push(base_class[things[i]][j]);
          }
        }
      }
    }
  }

  // sort out equipment
  if (base_class.equipment !== null) {
    for (let i in base_class.equipment) {
      if (typeof base_class.equipment[i][0] == "number") {
        // choose number of items in list
        const items = get_items_in_array(base_class.equipment[i].slice(1), base_class.equipment[i][0]);
        for (let j in items) {
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
  const num_backgrounds = backgrounds.length;

  const background = backgrounds[random_range(0, backgrounds.length)];
  // apply background name
  character.background = background.name;

  // apply various attributes
  const things = ["skill_proficiencies",
                "tool_proficiencies",
                "languages"];
  for (let i in things) {
    if (background[things[i]] !== null) {
      for (let j in background[things[i]]) {
        if (typeof background[things[i]][j][0] == "number") {
          // choose number of items in list
          const items = get_items_in_array(background[things[i]][j].slice(1), background[things[i]][j][0]);
          for (let k in items) {
            if (!character[things[i]].includes(items[k])) {
              character[things[i]].push(items[k])
            }
          }
        } else {
          // append to list
          if (!character[things[i]].includes(background[things[i]][j])) {
            character[things[i]].push(background[things[i]][j]);
          }
        }
      }
    }
  }

  // sort out equipment
  if (background.equipment !== null) {
    for (let i in background.equipment) {
      if (typeof background.equipment[i][0] == "number") {
        // choose number of items in list
        const items = get_items_in_array(background.equipment[i].slice(1), background.equipment[i][0]);
        for (let j in items) {
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

/* Gives the character random spells that are appropriate for them */
function random_spells() {
  // deal with weird race things first
  if (character.level == 1) {
    switch (character.race) {
      case "High Elf":
        // High Elves get a Wizard cantrip
        const new_spell = get_items_in_array(spells.wizard.cantrips, 1);
        character.spells.cantrips.push(new_spell);
        // remove the cantrip so it's not possible to get duplicates
        spells.wizard.cantrips = spells.wizard.cantrips.filter(entry => entry !== new_spell);
        break;
      case "Dark Elf (Drow)":
        // Drow get Dancing Lights cantrip at level 1
        character.spells.cantrips.push("Dancing Lights");
        // remove dancing lights from the spell list so no duplicates
        spells.bard.cantrips = spells.bard.cantrips.filter(entry => entry !== "Dancing Lights");
        spells.sorcerer.cantrips = spells.sorcerer.cantrips.filter(entry => entry !== "Dancing Lights");
        spells.wizard.cantrips = spells.wizard.cantrips.filter(entry => entry !== "Dancing Lights");
        break;
      case "Forest Gnome":
        // Forest Gnomes get Minor Illusion cantrip
        character.spells.cantrips.push("Minor Illusion");
        // remove minor illusion from the spell list so no duplicates
        spells.bard.cantrips = spells.bard.cantrips.filter(entry => entry !== "Minor Illusion");
        spells.sorcerer.cantrips = spells.sorcerer.cantrips.filter(entry => entry !== "Minor Illusion");
        spells.warlock.cantrips = spells.warlock.cantrips.filter(entry => entry !== "Minor Illusion");
        spells.wizard.cantrips = spells.wizard.cantrips.filter(entry => entry !== "Minor Illusion");
        break;
      case "Tiefling":
        // Tieflings get Thaumaturgy cantrip at level 1
        character.spells.cantrips.push("Thaumaturgy");
        // remove minor illusion from the spell list so no duplicates
        spells.cleric.cantrips = spells.cleric.cantrips.filter(entry => entry !== "Thaumaturgy");
        break;
    }
  }

  // now do class spells
  let new_cantrips = [];
  let new_first_level_spells = [];

  switch (character.class[0]) {
    case "Bard":
      // 2 cantrips
      new_cantrips = get_items_in_array(spells.bard.cantrips, 2);
      // 2 first level spells
      new_first_level_spells = get_items_in_array(spells.bard.first_level, 2);
      break;
    case "Cleric":
      // 3 cantrips
      new_cantrips = get_items_in_array(spells.cleric.cantrips, 3);
      // 2 spells
      new_first_level_spells = get_items_in_array(spells.cleric.first_level, 2);
      break;
    case "Druid":
      // 2 cantrips
      new_cantrips = get_items_in_array(spells.druid.cantrips, 2);
      // 2 first level spells
      new_first_level_spells = get_items_in_array(spells.druid.first_level, 2);
      break;
    case "Sorcerer":
      // 4 cantrips
      new_cantrips = get_items_in_array(spells.sorcerer.cantrips, 4);
      // 2 first level spells
      new_first_level_spells = get_items_in_array(spells.sorcerer.first_level, 2);
      break;
    case "Warlock":
      // 2 cantrips
      new_cantrips = get_items_in_array(spells.warlock.cantrips, 2);
      // 2 first level spells
      new_first_level_spells = get_items_in_array(spells.warlock.first_level, 2);
      break;
    case "Wizard":
      // 3 cantrips
      new_cantrips = get_items_in_array(spells.wizard.cantrips, 3);
      // 2 spells
      new_first_level_spells = get_items_in_array(spells.wizard.first_level, 2);
      break;
  }
  
  for (let i in new_cantrips) {
    character.spells.cantrips.push(new_cantrips[i]);
  }
  for (let i in new_first_level_spells) {
    character.spells.first_level.push(new_first_level_spells[i]);
  }
}


/* Adds the character information to the HTML */
function fill_page() {
  const race = get_race_data(character.race);

  // draw race
  $("#race").text(character.race);
  // add additional information if the race has it (e.g. dragon type for Dragonborn)
  if (character.racial_trait !== null) {
    $("#race").after("<br /><span id=\"racial_trait\">" + 
                     character.racial_trait + "</span>");
  }

  // draw background
  $("#background").text(character.background);

  // draw physical attributes
  $("#age_value").text(character.age + " yrs");
  $("#weight_value").text(character.weight + " lbs");
  // convert to feet and inches
  const feet = Math.floor(character.height / 12);
  const inches = character.height % 12;
  $("#height_value").text(feet + "' " + inches + "\"");

  // draw ability scores
  const ability_short = ["str", "dex", "con", "int", "wis", "cha"];
  for (let i in ability_short) {
    $("#" + ability_short[i]).text(character.ability_scores[ability_short[i]]);
    $("#" + ability_short[i] + "_mod").text((get_ability_mod(character.ability_scores[ability_short[i]]) > 0 ? "+" : "") + get_ability_mod(character.ability_scores[ability_short[i]]));
    $("#" + ability_short[i] + "_detailed").text("(" + (character.ability_scores[ability_short[i]] - race.ability_scores[ability_short[i]]) + " + " + (race.ability_scores[ability_short[i]]) + ")");
  }

  // draw base class
  for (let i in character.class) {
    $("#class").text(character.class[i]);
  }

  // draw HP
  $("#hp").text(character.hit_points);

  // draw skills
  for (let i in skills) {
    if (character.skill_proficiencies.includes(i)) {
      $("#" + skills[i]["lower"] + "_proficient").html("&#9899");
    } else {
      $("#" + skills[i]["lower"] + "_proficient").html("&#9898");
    }
    $("#" + skills[i]["lower"]).text((get_ability_mod(character.ability_scores[skills[i]["ability"]]) > 0 ? "+" : "") + get_ability_mod(character.ability_scores[skills[i]["ability"]]));
  }

  // draw saving throws
  // main ability throws
  const ability_long = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
  for (let i in ability_long) {
      if (character.saving_throw_proficiencies.includes(ability_long[i])) {
      $("#" + ability_short[i] + "_throw_proficient").html("&#9899");
    } else {
      $("#" + ability_short[i] + "_throw_proficient").html("&#9898");
    }
    $("#" + ability_short[i] + "_throw").text((get_ability_mod(character.ability_scores[ability_short[i]]) > 0 ? "+" : "") + get_ability_mod(character.ability_scores[ability_short[i]]));
  }

  // extra saving throws
  // make copy of saving throws without the base ones
  const saving_throw_copy = character.saving_throw_proficiencies.slice().filter(entry => !ability_long.includes(entry));
  for (let i in saving_throw_copy) {
    $("#saving_throws tr:last").after("<tr><td></td><td class=\"throw_label\"><span class=\"proficient\">&#9899</span> " + saving_throw_copy[i] + "</td></tr>");
  }

  // add languages
  for (let i in character.languages) {
    $("#languages tr:last").after("<tr><td class=\"language_label\"><span class=\"proficient\">&#9899</span> " + character.languages[i] + "</td></tr>");
  }

  // add other things
  const things = ["armor_proficiencies",
                "weapon_proficiencies",
                "tool_proficiencies",
                "equipment"];
  for (let i in things) {
    for (let j in character[things[i]]) {
      $("#" + things[i] + " tr:last").after("<tr><td>" + character[things[i]][j] + "</td></tr>");
    }
  }

  // add spells
  if (character.spells.cantrips.length == 0 && character.spells.first_level.length == 0) {
    // Hide spell table if the character has no spells
    $("#spells").hide();
  } else {
    for (let i in character.spells.cantrips) {
      $("#cantrips tr:last").after("<tr><td>" + character.spells.cantrips[i] + "</td></tr>");
    }
    for (let i in character.spells.first_level) {
      $("#first_level tr:last").after("<tr><td>" + character.spells.first_level[i] + "</td></tr>");
    }
  }
}

$.when(character_promise, 
       races_promise, 
       base_classes_promise, 
       backgrounds_promise, 
       weapon_categories_promise, 
       spells_promise,
       skills_promise)
       .done(function() {
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

  // random spells
  random_spells();

  // put the information on the page
  neaten_weapon_proficiencies();
  fill_page();
});
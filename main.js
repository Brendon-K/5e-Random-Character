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

/* Applies a random race to the character */
function random_race() {
  var num_races = races.length;

  var race = races[random_range(0, num_races)];
  // apply name
  character.race = race.name;

  // apply ability scores
  character.ability_scores.str += race.ability_scores.str;
  character.ability_scores.dex += race.ability_scores.dex;
  character.ability_scores.con += race.ability_scores.con;
  character.ability_scores.int += race.ability_scores.int;
  character.ability_scores.wis += race.ability_scores.wis;
  character.ability_scores.cha += race.ability_scores.cha;
  // Half-Elf gets two random ability scores +1
  if (race.name == "Half-Elf") {
    var ability_idxs = get_items_in_array([0, 1, 2, 3, 4, 5], 2);
    for (var i in ability_idxs) {
      switch (ability_idxs[i]) {
        case 0:
          ++character.ability_scores.str;
          break;
        case 1:
          ++character.ability_scores.dex;
          break;
        case 2:
          ++character.ability_scores.con;
          break;
        case 3:
          ++character.ability_scores.int;
          break;
        case 4:
          ++character.ability_scores.wis;
          break;
        case 5:
          ++character.ability_scores.cha;
          break;
      }
    }
  }


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
  if (new_hit_points > 1) {
    new_hit_points = 1;
  }
  character.hit_points += new_hit_points;
  // if character is a Hill Dwarf, they get an extra hit point per level
  if (character.race == "Hill Dwarf") {
    ++character.hit_points;
  }

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
          if (!character.equipment.includes(items[j])) {
            character.equipment.push(items[j])
          }
        }
      } else {
        // append to list
        if (!character.equipment.includes(base_class.equipment[i])) {
          character.equipment.push(base_class.equipment[i]);
        }
      }
    }
  }
}

/* Adds the character information to the HTML */
function fill_page() {
  $("#race").text(character.race);
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
  character.level = $("#level").val()*1;
  for (var i = 0; i < character.level; ++i) {
    random_base_class();
  }

  // random background

  fill_page();
});
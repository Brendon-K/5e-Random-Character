var character = null;
var races = null;
var base_classes = null;
var backgrounds = null;

// load all the json
var character_promise = $.getJSON("https://raw.githubusercontent.com/Brendon-K/5e-Random-Character/main/character.json?token=AFSYUS5MT6RYLPD7TB3SEEK7RCCVQ", function(data) {
  character = data;
});

var races_promise = $.getJSON("https://raw.githubusercontent.com/Brendon-K/5e-Random-Character/main/races.json?token=AFSYUS23ZUM5BVSF7WGA4D27RCCWE", function(data) {
  races = data;
});

var base_classes_promise = $.getJSON("https://raw.githubusercontent.com/Brendon-K/5e-Random-Character/main/base_classes.json?token=AFSYUSYAXM5XL5BGOTTPFYS7RCCU4", function(data) {
  base_classes = data;
});

var backgrounds_promise = $.getJSON("https://raw.githubusercontent.com/Brendon-K/5e-Random-Character/main/backgrounds.json?token=AFSYUS5ZGDXJ3FVLKVLERWC7RCCP2", function(data) {
  backgrounds = data;
});

$.when(character_promise, races_promise, base_classes_promise, backgrounds_promise).done(function() {
  // random ability scores
  

  // random race

  // random class for each level

  // random background
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
    console.log(roll);
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
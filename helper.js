// ------------------- RANDOM NUMBERS -------------------

// get a random integer
// randInt(1) can only return 0
// randInt(2) can return 0 or 1
var randInt = function(number1, number2) {
    number2 = number2 || 0;
    if (number1 == number2) {
        return number1;
    } else if (number1 > number2) {
        var great = number1;
        var less = number2;
    } else {
        var great = number2;
        var less = number1;
    };
    var diff = great - less;
    // return less + Math.floor(ROT.RNG.getUniform() * diff);
    return less + Math.floor(Math.random() * diff); // DEBUG
};

var randChoice = function(choice_list) {
    var index = randInt(choice_list.length);
    return( choice_list[index] );
};

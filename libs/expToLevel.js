const upBy = 5; //each level requires 5 more exp than the previous level
const startWith = 10; //level 1 will be 0->9 exp
const startWithAfterLevelTen = 60;
const startWithAfterLevelForTy = 360;
const decreaseBy = 1;

function getLevel(exp) {
    exp = exp + decreaseBy;

    let level = 0,
        minusBy = 0;

    while (exp > 0) {
        if (level > 40) {
            minusBy = startWithAfterLevelForTy / 1.5 * Math.floor(Math.pow(level - 39, 2) /2);
        } else if (level > 10) {
            minusBy = startWithAfterLevelTen + (level - 10) * (upBy + 5);
        } else {
            minusBy = startWith + upBy * level;
        }
        exp -= minusBy;
        level++;
    }

    return level;
}

// console.log(getLevel(65))


module.exports = getLevel;

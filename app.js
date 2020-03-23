var globalhsAll = new Set();
var arrLength = 0;
let winArray = [];

class PuzzleMove {
    constructor(arr, history, oldMoves, serializeVal, currentPos, manDist) {
        this._hsAll = new Set();

        if (serializeVal == '') {
            var res = deepCopy(arr);
            this._arr = res.newArray;
            this._currentPos = res.currentPos;
            this._serialized = serializeVal;//[].concat.apply([], arr).toString();
        } else {
            this._arr = arr;
            this._currentPos = currentPos;
            this._serialized = serializeVal;//[].concat.apply([], arr).toString();
        }
        this._manDist = manDist;

        // var res = deepCopy(arr);
        // this._arr = res.newArray;
        // this._currentPos = res.currentPos;
        // this._serialized = serializeVal;//[].concat.apply([], arr).toString();

        this._PerviousMoves = [];
        for (var moves in oldMoves) {
            this._PerviousMoves.push(oldMoves[moves]);
        }
    }

    get hsAll() {
        return this._hsAll;
    }
    get currentPos() {
        return this._currentPos;
    }
    get serialized() {
        return this._serialized;
    }
    get PerviousMoves() {
        return this._PerviousMoves;
    }
    get arr() {
        return this._arr;
    }
    get manDist() {
        return this._manDist;
    }
}

function printArray(arr) {
    console.table(arr);
    console.log(ManDist(arr));
    console.log('\n');
}

function deepCopy(arr) {
    var newArray = [];
    let currentPos = {
        'Item1': 0,
        'Item2': 0
    };
    for (y = 0; y < arrLength; y++) {
        newArrayX = [];
        for (x = 0; x < arrLength; x++) {
            newArrayX.push(arr[y][x]);
            if (arr[y][x] == 0) {
                currentPos = {
                    'Item1': x,
                    'Item2': y
                }
            }
        }
        newArray.push(newArrayX);
    }
    return { 'newArray': newArray, 'currentPos': currentPos};
}

function ManDistNew(arr) {
    var distance = 0;

    var currentScore = [].concat.apply([], arr);



    for (y = 0; y < arrLength; y++) {
        for (x = 0; x < arrLength; x++) {
            val = arr[y][x];
            if (val==0)
                continue;
            if (y==0 && x==0 || currentScore[(y*arrLength)+x] == (y*arrLength)+x) {
                quotient = Math.floor(val / arrLength);
                remainder = val % arrLength;
                distance += Math.abs(y - (remainder == 0 ? quotient - 1 : quotient)) + Math.abs(x - (remainder == 0 ? arrLength - 1 : remainder - 1));
            }
            else
                break;
            
        }
    }
    return distance;
}

function ManDist(arr) {
    distance = 0;
    for (y = 0; y < arrLength; y++) {
        for (x = 0; x < arrLength; x++) {
            val = arr[y][x];
            if (val==0)
                continue;
            quotient = Math.floor(val / arrLength);
            remainder = val % arrLength;
            distance += Math.abs(y - (remainder == 0 ? quotient - 1 : quotient)) + Math.abs(x - (remainder == 0 ? arrLength - 1 : remainder - 1));
        }
    }
    return distance;
}

function searchEmpty(arr) {
    for (y = 0; y < arr[0].length; y++) {
        for (x = 0; x < arr[y].length; x++) {
            if (arr[y][x] == 0)
                return {
                    'Item1': x,
                    'Item2': y
                };
        }
    }
    return null;
}

function Move(puzzleMove, direction) {
    var deepC = deepCopy(puzzleMove.arr);
    arrCopy = deepC.newArray;
    var result = deepC.currentPos; //searchEmpty(arrCopy);
    
    valueMoved = 0;

    switch (direction) {
        case 0: // right
            if (result.Item1 >= arrLength - 1)
                return null;
            arrCopy[result.Item2][result.Item1] = arrCopy[result.Item2][result.Item1 + 1];
            valueMoved = arrCopy[result.Item2][result.Item1 + 1];
            arrCopy[result.Item2][result.Item1 + 1] = 0;
            result.Item1++;
            break;
        case 1: // left
            if (result.Item2 >= arrLength - 1)
                return null;
            arrCopy[result.Item2][result.Item1] = arrCopy[result.Item2 + 1][result.Item1];
            valueMoved = arrCopy[result.Item2 + 1][result.Item1];
            arrCopy[result.Item2 + 1][result.Item1] = 0;
            result.Item2++;
            break;
        case 2: // left
            if (result.Item1 == 0)
                return null;
            arrCopy[result.Item2][result.Item1] = arrCopy[result.Item2][result.Item1 - 1];
            valueMoved = arrCopy[result.Item2][result.Item1 - 1];
            arrCopy[result.Item2][result.Item1 - 1] = 0;
            result.Item1--;
            break;
        case 3: // left
            if (result.Item2 == 0)
                return null;
            arrCopy[result.Item2][result.Item1] = arrCopy[result.Item2 - 1][result.Item1];
            valueMoved = arrCopy[result.Item2 - 1][result.Item1];
            arrCopy[result.Item2 - 1][result.Item1] = 0;
            result.Item2--;
            break;
        default:
            break;
    }
    serializeVal = [].concat.apply([], arrCopy).toString();
    tempMan = ManDist(arrCopy);
    if (!globalhsAll.has(serializeVal) && tempMan <= bestManDistance + arrLength) {
        bestManDistance = tempMan<bestManDistance?tempMan:bestManDistance;
        globalhsAll.add(serializeVal);
        //printArray(arrCopy);
        return {
            'arrCopy': arrCopy,
            'valueMoved': valueMoved,
            'serializeVal': serializeVal,
            'currentPos': result,
            'manDist': tempMan
        };
    } else{
        globalhsAll.add(serializeVal);
        return null;
    }
        
}

function slidePuzzle(arr) {
    globalhsAll = new Set();
    arrLength = arr[0].length;
    //console.log([].concat.apply([], arr).toString());
    let stack = [];
    winArray = [];
    for (i = 1; i < (arrLength * arrLength); i++) {
        winArray.push(i);
    }
    winArray.push(0);
    win = winArray.toString();

    puzzleMove = new PuzzleMove(arr, new Set(), [], "");
    bestManDistance = ManDist(arr);
    for (i = 0; i < 4; i++) {
        result = Move(puzzleMove, i);
        if (result != null) {
            newMove = new PuzzleMove(result.arrCopy, puzzleMove.hsAll, puzzleMove.PerviousMoves, result.serializeVal, result.currentPos, result.manDist);
            newMove.PerviousMoves.push(result.valueMoved);
            stack.push(newMove);
        }
    }

    for (depth = 0; depth <= 120; depth++) {
        newStack = [];

        stack.sort(function(a, b) { 
            return b.manDist - a.manDist;
        });

        while (stack.length > 0) {
            var poppedPuzzleMove = stack.pop();
            for (i = 0; i < 4; i++) {
                result = Move(poppedPuzzleMove, i);

                if (result != null && depth>25) {
                    if (result.serializeVal[0] != 1)
                        result = null;
                }
                // if (result != null && depth>((arrLength*arrLength)*3))
                // {
                //     var current = [].concat.apply([], result.arrCopy);

                //     for (dd = 1; dd <= (depth+1)/((arrLength*arrLength)*3); dd++) {
                //         if (current[dd-1] != dd) {
                //             //result = null;
                //             break;
                //         }
                //     }
                // }
                if (result != null) {
                    newMove = new PuzzleMove(result.arrCopy, poppedPuzzleMove.hsAll, poppedPuzzleMove.PerviousMoves, result.serializeVal, result.currentPos, result.manDist);
                    newMove.PerviousMoves.push(result.valueMoved);
                    if (newMove.serialized == win) {
                        console.log(newMove.PerviousMoves.toString());
                        return newMove.PerviousMoves;
                    }
                    newStack.push(newMove);
                }
            }
            if (newStack.length == 0 && stack.length == 0)
            {
                printArray(poppedPuzzleMove.arr);
                return null;
            }
        }
        stack = newStack;
    }
    return null;
}

let puzzle1 = [
	[4,1,3],
	[2,8,0],
	[7,6,5]
];
let puzzle2 = [
	[10, 3, 6, 4],
	[ 1, 5, 8, 0],
	[ 2,13, 7,15],
	[14, 9,12,11]
];
let puzzle3 = [
	[ 3, 7,14,15,10],
	[ 1, 0, 5, 9, 4],
	[16, 2,11,12, 8],
	[17, 6,13,18,20],
	[21,22,23,19,24]
];
let puzzle4 = [ [ 8, 2, 1 ], [ 3, 7, 0 ], [ 4, 6, 5 ] ];
let puzzle5 = [ [ 1, 6, 2, 9, 0 ],
                [ 23, 8, 3, 10, 18 ],
                [ 11, 22, 24, 15, 12 ],
                [ 21, 14, 16, 4, 5 ],
                [ 17, 13, 19, 20, 7 ] ];

let puzzle6 = [ [ 2, 7, 9, 5, 27, 12 ],
                [ 25, 11, 15, 6, 18, 4 ],
                [ 8, 26, 1, 14, 3, 28 ],
                [ 21, 20, 10, 30, 17, 29 ],
                [ 19, 13, 33, 22, 0, 23 ],
                [ 32, 34, 31, 24, 16, 35 ] ];

                console.time('someFunction');

[puzzle6].forEach(e => slidePuzzle(e.map(v => v.slice())));
[puzzle1, puzzle2, puzzle3, puzzle4, puzzle5].forEach(e => slidePuzzle(e.map(v => v.slice())));


console.timeEnd('someFunction');
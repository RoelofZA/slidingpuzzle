using System;
using System.Linq;
using System.Collections.Generic;

namespace slidePuzzle
{
    class Program
    {
        static void Main(string[] args)
        {
            int[][] puzzle1 = new int[][] { new int[] { 4, 1, 3 }, new int[] { 2, 8, 0 }, new int[] { 7, 6, 5 } };
            new PuzzleSolver().slidePuzzle(puzzle1);
        }
    }

    class PuzzleSolver
    {
        //HashSet<string> hsAll = new HashSet<string>();
        int bestManDistance = 0;

        public void slidePuzzle(int[][] arr)
        {
            Stack<PuzzleMove> stack = new Stack<PuzzleMove>();
            string win = String.Join(",", new int[][] { new int[] {1, 2, 3}, new int[] {4, 5, 6}, new int[] {7, 8, 0}}.SelectMany(inner => inner).ToArray());

            PuzzleMove puzzleMove = new PuzzleMove(arr, 0, new HashSet<string>(), new List<int>());
            puzzleMove.hsAll.Add(String.Join(",", arr.SelectMany(inner => inner).ToArray()));
            bestManDistance = ManDist(arr);
            for (int i = 0; i < 4; i++)
            {
                var result = Move(puzzleMove, i, out int valueMoved);
                if (result != null) {
                    var newMove = new PuzzleMove(result, puzzleMove.depth + 1, puzzleMove.hsAll, puzzleMove.PerviousMoves);
                    newMove.PerviousMoves.Add(valueMoved);
                    stack.Push(newMove);
                    puzzleMove.childMoves.Add(newMove);
                }
            }

            for (int depth = 0; depth < 20; depth++)
            {
                Stack<PuzzleMove> newStack = new Stack<PuzzleMove>();
                if (stack.Count == 0)
                    return;

                while(stack.Count>0) {
                    var poppedPuzzleMove = stack.Pop();
                    for (int i = 0; i < 4; i++)
                    {
                        var result = Move(poppedPuzzleMove, i,  out int valueMoved);
                        if (result != null) {
                            var newMove = new PuzzleMove(result, poppedPuzzleMove.depth + 1, poppedPuzzleMove.hsAll, poppedPuzzleMove.PerviousMoves);
                            newMove.PerviousMoves.Add(valueMoved);
                            if (String.Join(",", result.SelectMany(inner => inner).ToArray()) == win)
                            {
                                Console.WriteLine(String.Join(",", newMove.PerviousMoves));
                                return;
                            }
                            newStack.Push(newMove);
                            poppedPuzzleMove.childMoves.Add(newMove);
                        }
                    }
                }
                stack = newStack;
            }
        }

        Tuple<int, int> searchEmpty(int[][] arr)
        {
            for (int y = 0; y < arr.GetLength(0); y++)
            {
                for (int x = 0; x < arr[y].GetLength(0); x++)
                {
                    if (arr[y][x] == 0)
                        return new Tuple<int, int>(x, y);
                }
            }
            return null;
        }

        int[][] deepCopy(int[][] arr)
        {
            int[][] newArray = new int[arr.GetLength(0)][];
            for (int y = 0; y < arr.GetLength(0); y++)
            {
                newArray[y] = new int[arr[y].GetLength(0)];
                for (int x = 0; x < arr[y].GetLength(0); x++)
                {
                    newArray[y][x] = arr[y][x];
                }
            }
            return newArray;
        }

        int[][] Move(PuzzleMove puzzleMove, int direction, out int valueMoved)
        {
            int[][] arrCopy = deepCopy(puzzleMove.arr);
            var result = searchEmpty(arrCopy);
            valueMoved = 0;

                switch (direction)
                {
                    case 0: // right
                        if (result.Item1 >= arrCopy[0].GetLength(0) - 1)
                            return null;
                        arrCopy[result.Item2][result.Item1] = arrCopy[result.Item2][result.Item1 + 1];
                        valueMoved = arrCopy[result.Item2][result.Item1 + 1];
                        arrCopy[result.Item2][result.Item1 + 1] = 0;
                        break;
                    case 1: // left
                        if (result.Item2 >= arrCopy.GetLength(0) - 1)
                            return null;
                        arrCopy[result.Item2][result.Item1] = arrCopy[result.Item2 + 1][result.Item1];
                        valueMoved = arrCopy[result.Item2 + 1][result.Item1];
                        arrCopy[result.Item2 + 1][result.Item1] = 0;
                        break;
                    case 2: // left
                        if (result.Item1 == 0)
                            return null;
                        arrCopy[result.Item2][result.Item1] = arrCopy[result.Item2][result.Item1 - 1];
                        valueMoved = arrCopy[result.Item2][result.Item1 - 1];
                        arrCopy[result.Item2][result.Item1 - 1] = 0;
                        break;
                    case 3: // left
                        if (result.Item2 == 0)
                            return null;
                        arrCopy[result.Item2][result.Item1] = arrCopy[result.Item2 - 1][result.Item1];
                        valueMoved = arrCopy[result.Item2 - 1][result.Item1];
                        arrCopy[result.Item2 - 1][result.Item1] = 0;
                        break;
                    default:
                        break;
                }
                string serializeVal = String.Join(",", arrCopy.SelectMany(inner => inner).ToArray()); 
                if (!puzzleMove.hsAll.Contains(serializeVal) && ManDist(arrCopy) <= bestManDistance+2)
                {
                    bestManDistance = ManDist(arrCopy);
                    return arrCopy;
                }
                else
                    return null;
        }

        int ManDist(int[][] arr) {
            int distance = 0;
            for (int y = 0; y < arr.GetLength(0); y++)
            {
                for (int x = 0; x < arr[y].GetLength(0); x++)
                {
                    int val = arr[y][x], lng = arr.GetLength(0);
                    int quotient = Math.DivRem(val, lng, out int remainder);
                    distance += Math.Abs(y-(remainder==0?quotient-1:quotient)) + Math.Abs(x-( remainder==0?lng-1:remainder-1));
                }
            }
            return distance;
        }

        void printArray(int[][] arr)
        {
            for (int y = 0; y < arr.GetLength(0); y++)
            {
                Console.WriteLine();
                Array.ForEach(arr[y], Console.Write);
            }
            Console.WriteLine();
        }
    }

    class PuzzleMove
    {
        public PuzzleMove(int[][] arr, int depth, HashSet<string> history, List<int> oldMoves)
        {
            this.arr = deepCopy(arr);
            this.depth = depth;
            foreach (var item in history)
            {
                this.hsAll.Add(item);
            }
            this.hsAll.Add(String.Join(",", arr.SelectMany(inner => inner).ToArray()));

            foreach (var item in oldMoves)
            {
                this.PerviousMoves.Add(item);
            }
        }

        public HashSet<string> hsAll = new HashSet<string>();
        public List<int> PerviousMoves = new List<int>();
        
        public int depth { get; set; }
        public int[][] arr { get; set; }
        public List<PuzzleMove> childMoves { get; set; } = new List<PuzzleMove>();

        private int[][] deepCopy(int[][] arr)
        {
            int[][] newArray = new int[arr.GetLength(0)][];
            for (int y = 0; y < arr.GetLength(0); y++)
            {
                newArray[y] = new int[arr[y].GetLength(0)];
                for (int x = 0; x < arr[y].GetLength(0); x++)
                {
                    newArray[y][x] = arr[y][x];
                }
            }

            return newArray;
        }
    }

}

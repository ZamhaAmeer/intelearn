/**
 * Simple test/demo of the Tango game logic
 * Run this to verify the game engine works correctly
 */

import { gameService, PieceType, ConstraintType, type GameState } from './index';
import { TangoBoardSolver } from './solver/TangoBoardSolver';

export function runGameDemo(): void {
  console.log('🎮 Starting Tango Game Demo');
  
  try {
    // Test 1: Create a new game
    console.log('\n📋 Test 1: Creating new game...');
    const gameState = gameService.newGame('standard');
    console.log('✅ New game created successfully');
    console.log(`Difficulty: ${gameState.difficulty}`);
    console.log(`Starting pieces: ${countFilledCells(gameState.board)}`);
    console.log(`Has constraints: ${hasConstraints(gameState)}`);
    
    // Test 2: Validate initial state
    console.log('\n📋 Test 2: Validating initial state...');
    const isValid = gameService.validateBoard(
      gameState.board, 
      gameState.hConstraints, 
      gameState.vConstraints
    );
    console.log(`✅ Initial board is valid: ${isValid}`);
    
    // Test 3: Make some moves
    console.log('\n📋 Test 3: Making test moves...');
    let currentState = gameState;
    
    // Find an empty position to test
    const emptyPos = findEmptyPosition(currentState.board);
    if (emptyPos) {
      const [row, col] = emptyPos;
      console.log(`Trying to place SUN at position (${row}, ${col})`);
      
      // Test if the move is valid
      const wouldBeValid = gameService.isValidMove(currentState, row, col, PieceType.SUN);
      console.log(`Move would be valid: ${wouldBeValid}`);
      
      if (wouldBeValid) {
        currentState = gameService.makeMove(currentState, row, col, PieceType.SUN);
        console.log('✅ Move made successfully');
        console.log(`Board is still valid: ${currentState.isValid}`);
        console.log(`Board is complete: ${currentState.isComplete}`);
      } else {
        console.log('Testing MOON instead...');
        const moonValid = gameService.isValidMove(currentState, row, col, PieceType.MOON);
        if (moonValid) {
          currentState = gameService.makeMove(currentState, row, col, PieceType.MOON);
          console.log('✅ MOON move made successfully');
        }
      }
    }
    
    // Test 4: Get a hint
    console.log('\n📋 Test 4: Getting hint...');
    try {
      const hint = gameService.getHint(currentState);
      console.log('✅ Hint generated successfully');
      console.log(`Hint type: ${hint.type}`);
      console.log(`Hint message: ${hint.message}`);
      if (hint.position) {
        console.log(`Suggested position: (${hint.position.row}, ${hint.position.col})`);
      }
      if (hint.suggestedPiece) {
        console.log(`Suggested piece: ${hint.suggestedPiece}`);
      }
    } catch (error) {
      console.log(`⚠️ Hint generation failed: ${error}`);
    }
    
    // Test 5: Board analysis
    console.log('\n📋 Test 5: Analyzing board...');
    const analysis = gameService.analyzeBoard(currentState);
    console.log('✅ Board analysis completed');
    console.log(`Error count: ${analysis.errorCount}`);
    console.log(`Completeness: ${analysis.completeness}%`);
    console.log(`Constraint violations: ${analysis.constraintViolations.length}`);
    console.log(`Rule violations: ${analysis.ruleViolations.length}`);
    
    // Test 6: Auto-solve (as demonstration)
    console.log('\n📋 Test 6: Auto-solving puzzle...');
    const solvedState = gameService.autoSolve(currentState);
    console.log('✅ Puzzle auto-solved');
    console.log(`Solution is complete: ${solvedState.isComplete}`);
    console.log(`Solution is valid: ${solvedState.isValid}`);
    console.log(`Validation passes: ${gameService.validateSolution(solvedState)}`);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

function countFilledCells(board: PieceType[][]): number {
  return board.flat().filter(cell => cell !== PieceType.EMPTY).length;
}

function hasConstraints(gameState: GameState): boolean {
  const hHasConstraints = gameState.hConstraints.some(row => 
    row.some(constraint => constraint !== 'none')
  );
  const vHasConstraints = gameState.vConstraints.some(row => 
    row.some(constraint => constraint !== 'none')
  );
  return hHasConstraints || vHasConstraints;
}

function findEmptyPosition(board: PieceType[][]): [number, number] | null {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === PieceType.EMPTY) {
        return [row, col];
      }
    }
  }
  return null;
}

/**
 * Test the new advanced balance rules
 */
export async function testAdvancedBalanceRules(): Promise<void> {
  console.log('🧪 Testing Advanced Balance Rules');
  
  try {
    // Test the two X constraint pattern: A _x_ _x_ _ → A B x A x B
    console.log('\n📋 Test: Two X Constraint Pattern');
    await testTwoXConstraintPattern();
    
    // Test the triple equals pattern: A _=_ _=_ _ → A B B A A B  
    console.log('\n📋 Test: Triple Equals Pattern');
    await testTripleEqualsPattern();
    
    console.log('\n✅ All advanced balance rule tests completed');
  } catch (error) {
    console.error('❌ Error testing advanced balance rules:', error);
  }
}

async function testTwoXConstraintPattern(): Promise<void> {
  // Create a test board with the pattern A _x_ _x_ _
  // We'll create a minimal test case
  const board: PieceType[][] = Array(6).fill(null).map(() => Array(6).fill(PieceType.EMPTY));
  const hConstraints: ConstraintType[][] = Array(6).fill(null).map(() => Array(5).fill(ConstraintType.NONE));
  const vConstraints: ConstraintType[][] = Array(5).fill(null).map(() => Array(6).fill(ConstraintType.NONE));
  const lockedTiles: boolean[][] = Array(6).fill(null).map(() => Array(6).fill(false));
  
  // Set up pattern: S _ x _ x _ at positions (0,0) to (0,5)
  board[0][0] = PieceType.SUN;  // A = SUN
  lockedTiles[0][0] = true;
  hConstraints[0][2] = ConstraintType.DIFFERENT; // x constraint between positions 2-3
  hConstraints[0][4] = ConstraintType.DIFFERENT; // x constraint between positions 4-5
  
  console.log('Initial pattern: S _ x _ x _');
  console.log('Expected result: S M x S x M');
  
  // Create solver and apply the pattern
  const solver = new TangoBoardSolver(
    board, hConstraints, vConstraints, lockedTiles
  );
  
  const solutions = solver.findAllSolutions(1);
  
  if (solutions.length > 0) {
    const solution = solutions[0];
    const resultRow = solution[0].slice(0, 6);
    console.log('Actual result:', resultRow.map((p: PieceType) => 
      p === PieceType.SUN ? 'S' : 
      p === PieceType.MOON ? 'M' : '_'
    ).join(' '));
    
    // Verify the pattern
    const expected = [PieceType.SUN, PieceType.MOON, PieceType.SUN, PieceType.MOON];
    const actual = [resultRow[0], resultRow[1], resultRow[3], resultRow[5]];
    
    if (JSON.stringify(expected) === JSON.stringify(actual)) {
      console.log('✅ Two X constraint pattern test PASSED');
    } else {
      console.log('❌ Two X constraint pattern test FAILED');
      console.log('Expected:', expected);
      console.log('Actual:', actual);
    }
  } else {
    console.log('❌ No solution found for two X constraint pattern');
  }
}

async function testTripleEqualsPattern(): Promise<void> {
  // Create a test board with the pattern A _=_ _=_ _
  const board: PieceType[][] = Array(6).fill(null).map(() => Array(6).fill(PieceType.EMPTY));
  const hConstraints: ConstraintType[][] = Array(6).fill(null).map(() => Array(5).fill(ConstraintType.NONE));
  const vConstraints: ConstraintType[][] = Array(5).fill(null).map(() => Array(6).fill(ConstraintType.NONE));
  const lockedTiles: boolean[][] = Array(6).fill(null).map(() => Array(6).fill(false));
  
  // Set up pattern: S _ = _ = _ at positions (0,0) to (0,5)
  board[0][0] = PieceType.SUN;  // A = SUN
  lockedTiles[0][0] = true;
  hConstraints[0][2] = ConstraintType.SAME; // = constraint between positions 2-3
  hConstraints[0][4] = ConstraintType.SAME; // = constraint between positions 4-5
  
  console.log('Initial pattern: S _ = _ = _');
  console.log('Expected result: S M = M = S (which is S M M S S M when expanded)');
  
  // Create solver and apply the pattern
  const solver = new TangoBoardSolver(
    board, hConstraints, vConstraints, lockedTiles
  );
  
  const solutions = solver.findAllSolutions(1);
  
  if (solutions.length > 0) {
    const solution = solutions[0];
    const resultRow = solution[0].slice(0, 6);
    console.log('Actual result:', resultRow.map((p: PieceType) => 
      p === PieceType.SUN ? 'S' : 
      p === PieceType.MOON ? 'M' : '_'
    ).join(' '));
    
    // Verify the pattern: A B B A A B → S M M S S M
    const expected = [PieceType.SUN, PieceType.MOON, PieceType.MOON, PieceType.SUN, PieceType.SUN, PieceType.MOON];
    const actual = resultRow;
    
    if (JSON.stringify(expected) === JSON.stringify(actual)) {
      console.log('✅ Triple equals pattern test PASSED');
    } else {
      console.log('❌ Triple equals pattern test FAILED');
      console.log('Expected:', expected);
      console.log('Actual:', actual);
    }
  } else {
    console.log('❌ No solution found for triple equals pattern');
  }
}

// Export the function for use in components
export default runGameDemo;

// 클래스 모듈 선언
const { Console } = require('@woowacourse/mission-utils');
const Computer = require('./Computer');
// 상수 선언
const INPUT_LENGTH = 3;

class App {
  #collectValidationFn;
  #computer;

  constructor() {
    this.#collectValidationFn = Object.freeze({
      isNotThreeDigit: inputDigit => inputDigit.length !== INPUT_LENGTH,
      isNotOneToNineDigit: inputDigit =>
        isNaN(inputDigit) || inputDigit.toString().includes('0'),
      isDuplicates: inputDigit => {
        const arrForCheck = inputDigit.toString().split('');
        const setForCheck = new Set(arrForCheck);
        return arrForCheck.length !== setForCheck.size;
      },
    });
  }

  #setUserInput() {
    Console.readLine('숫자를 입력해주세요 : ', inputDigit => {
      const userDigit = [...this.isDigitValidation(inputDigit)].map(Number);
      const baseBallBoard = this.#computer.calcBaseBallDigit(userDigit);
      this.#isThreeStrike(baseBallBoard)
        ? this.getRestartInput()
        : this.#setUserInput();
    });
  }

  #isThreeStrike(baseBallBoard) {
    const { strike, ball } = baseBallBoard;
    if (strike || ball) {
      Console.print(
        (ball ? `${ball}볼 ` : ``) + (strike ? `${strike}스트라이크` : ``),
      );
    } else Console.print('낫싱');
    return strike === INPUT_LENGTH;
  }

  #showStartMessage() {
    Console.print('숫자 야구 게임을 시작합니다.');
  }

  #gameStart() {
    this.#computer = new Computer();
    this.#setUserInput();
  }

  #gameEnd() {
    this.#computer = null;
    Console.print('게임 종료');
    Console.close();
  }

  isDigitValidation(inputDigit) {
    const { isNotThreeDigit, isNotOneToNineDigit, isDuplicates } =
      this.#collectValidationFn;
    if (
      isNotThreeDigit(inputDigit) ||
      isNotOneToNineDigit(inputDigit) ||
      isDuplicates(inputDigit)
    )
      throw new Error('잘못된 값 입력됨');
    return inputDigit;
  }
  
  getRestartInput() {
    Console.print('게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.');
    Console.readLine('', isRestart => {
      if (isRestart === '1') return this.#gameStart();
      else if (isRestart === '2') return this.#gameEnd();
      else throw new Error('잘못된 값 입력됨');
    });
  }

  play() {
    this.#showStartMessage();
    this.#gameStart();
  }
}

const app = new App();
app.play();

module.exports = App;

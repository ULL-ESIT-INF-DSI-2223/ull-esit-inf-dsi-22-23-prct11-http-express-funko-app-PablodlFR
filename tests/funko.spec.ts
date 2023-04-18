import "mocha";
import { expect } from "chai";
import { Funko } from "../src/ej-guion/ejercicio-3/funko"
import { Type, Genre} from "../src/ej-guion/ejercicio-3/utilities";

const funko1 = new Funko(1, "Conan Edogawa", "Classic Conan Edogawa, 1996", Type.POP, Genre.ANIME, "Detective Conan", 1, true, "Ninguna característica especial", 100);
const funko2 = new Funko(1, "Conan Edogawa", "Classic Conan Edogawa, 1996", Type.POP, Genre.ANIME, "Detective Conan", 1, true, "Ninguna característica especial", 75);
const funko3 = new Funko(1, "Conan Edogawa", "Classic Conan Edogawa, 1996", Type.POP, Genre.ANIME, "Detective Conan", 1, true, "Ninguna característica especial", 50);
const funko4 = new Funko(1, "Conan Edogawa", "Classic Conan Edogawa, 1996", Type.POP, Genre.ANIME, "Detective Conan", 1, true, "Ninguna característica especial", 25)

const print1 = funko1.print();
const print2 = funko2.print();
const print3 = funko3.print();
const print4 = funko4.print();

describe('function print test', () => {
  it('funko1.print() should return funko1', () => {
    expect(funko1.print()).to.eql(print1);
  });
  it('funko2.print() should return funko2', () => {
    expect(funko2.print()).to.eql(print2);
  });
  it('funko3.print() should return funko3', () => {
    expect(funko3.print()).to.eql(print3);
  });
  it('funko4.print() should return funko4', () => {
    expect(funko4.print()).to.eql(print4);
  });
})
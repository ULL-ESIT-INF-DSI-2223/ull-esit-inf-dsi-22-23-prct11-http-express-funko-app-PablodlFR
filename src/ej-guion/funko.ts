import * as chalk from "chalk"
import { Type, Genre, FranchiseType } from "./utilities";

/**
 * Class to create a Funko with a method to print it.
 */
export class Funko {
  /**
   * Funko's constructor
   * @param id Number Funko's ID.
   * @param name String Funko's name.
   * @param description String Funko's description.
   * @param type Funko's type.
   * @param genre Funko's genre.
   * @param franchise String Funko's franchise.
   * @param franchiseNumber Number Funko's franchise number.
   * @param exclusive Boolean to check if the Funko is exclusive or not.
   * @param specialFeatures String for Funko's special features.
   * @param marketValue Number for the Funko's market value.
   */
  constructor(private id: number, private name: string, private description: string, private type: Type, private genre: Genre, private franchise: FranchiseType, private franchiseNumber: number, private exclusive: boolean, private specialFeatures: string, private marketValue: number){
  }

  /**
   * Print the Funko's information.
   * @returns String with the Funko's information.
   */
  print() {
    let str = "";
    str = "ID: " + this.id + "\nName: " + this.name + "\nDescription: " + this.description + "\nType: " + this.type + "\nGenre: " + this.genre + "\nFranchise: " + this.franchise + "\nFranchise Number: " + this.franchiseNumber + "\nExclusive: " + this.exclusive + "\nSpecial Features: " + this.specialFeatures + "\n";
    if (this.marketValue <= 25) {
      str += chalk.red("Market Value: " + this.marketValue + "€");
    } else if (this.marketValue > 25 && this.marketValue <= 50) {
      str += chalk.hex('#FFA500')("Market Value: " + (this.marketValue + "€"));
    } else if (this.marketValue > 50 && this.marketValue <= 75) {
      str += chalk.yellow("Market Value: " + (this.marketValue + "€"));
    } else if (this.marketValue > 75 && this.marketValue <= 100) {
      str += chalk.green("Market Value: " + (this.marketValue + "€"));
    }
    return str;
  }  
}
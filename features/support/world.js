import { setWorldConstructor } from "@cucumber/cucumber";

class CustomWorld {
  constructor() {
    this.context = null;
    this.page = null;
    this.createdUsername = null;
    this.createdPassword = null;
  }
}

setWorldConstructor(CustomWorld);

// CONTOH CREATIONAL PATTERN :
// Constructor Function/Class Pattern
// Singleton Pattern
// Builder Pattern
// Dependency Injection Pattern


// TANPA CLASS PATTERN :
const xenia_00 = {
  manufacture: "daihatsu",
  model: "xenia",
  year: 2020,
  color: "black",
  engineStatus: "inactive",
  startEngine() {
    this.engineStatus = "active";
    console.log(`${this.model} ${this.color} is starting`);
  },
};

const avanza_00 = {
  manufacture: "toyota",
  model: "avanza",
  year: 2019,
  color: "white",
  engineStatus: "inactive",
  startEngine() {
    this.engineStatus = "active";
    console.log(`${this.model} ${this.color} is starting`);
  },
};

const crv_00 = {
  manufacture: "honda",
  model: "crv",
  year: 2020,
  color: "gray",
  engineStatus: "inactive",
  startEngine() {
    this.engineStatus = "active";
    console.log(`${this.model} ${this.color} is starting`);
  },
};

//  DENGAN CLASS PATTERN
class Car {
  constructor(manufacture, model, year, color) {
    this.manufacture = manufacture;
    this.model = model;
    this.year = year;
    this.color = color;
    this.engineStatus = "inactive";
  }

  startEngine() {
    console.log(`${this.model} ${this.color} is starting`);
  }
}

const xenia = new Car("daihatsu", "xenia", 2020, "black");
const avanza = new Car("toyota", "avanza", 2019, "white");
const crv = new Car("honda", "crv", 2020, "gray");

xenia.startEngine(); // "xenia black is starting"
avanza.startEngine(); // "avanza white is starting"
crv.startEngine(); // "crv gray is starting"

//   OBJECT LITERAL
const Logging_00 = {
  logs: [],
  addLog(log) {
    this.logs.push(log);
  },
  viewLogs() {
    console.log(this.logs);
  },
};

const loggingA_00 = Logging;
const loggingB_00 = Logging;

loggingA.addLog("log 1");
loggingB.addLog("log 2");
loggingB.addLog("log 3");

console.log(loggingA.viewLogs()); // ["log 1","log 2","log 3"]

// CONSTRUCTOR FUNCTION/CLASS
class Logging {
  constructor() {
    if (typeof Logging.INSTANCE === "object") {
      return Logging.INSTANCE;
    }

    this.logs = [];
    Logging.INSTANCE = this;
  }

  addLog(log) {
    this.logs.push(log);
  }

  viewLogs() {
    console.log(this.logs);
  }
}

const loggingA = new Logging();
const loggingB = new Logging();

loggingA.addLog("log 1");
loggingB.addLog("log 2");
loggingB.addLog("log 3");

console.log(loggingA.viewLogs()); // ["log 1","log 2","log 3"]

// BUILD PATTERN
class Handphone {
  constructor(processor, ram, speaker, screen) {
    this.processor = processor;
    this.ram = ram;
    this.speaker = speaker;
    this.screen = screen;
  }
}

class HandphoneBuilder {
  constructor(processor, ram) {
    this.processor = processor; // wajib ada
    this.ram = ram; // wajib ada

    this.speaker = "Dolby Atmos"; // default
    this.screen = "IPS"; // default
  }

  setSpeaker(speaker) {
    this.speaker = speaker;
    return this;
  }

  setScreen(screen) {
    this.screen = screen;
    return this;
  }

  build() {
    return new Handphone(this.processor, this.ram, this.speaker, this.screen);
  }
}

const myPhone = new HandphoneBuilder("Octa-core", "8GB")
  .setScreen("Amoled")
  .build();

// Dependency Injection Pattern
class Engine {
  constructor() {
    this.status = "inactive";
  }

  activate() {
    this.status = "active";
  }
}

class Car {
  constructor(engine) {
    this.engine = engine;
  }

  start() {
    this.engine.activate();

    console.log(`status mesin: ${this.engine.status}`);
  }
}

const engine = new Engine();
const car = new Car(engine);
car.start(); // status mesin: active

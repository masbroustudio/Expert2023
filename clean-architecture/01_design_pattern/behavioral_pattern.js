// BEHAVIORAL PATTERN :
// Observer Pattern
// Template Method Pattern

// OBESERVE PATTERN :
class FavoriteYouTubeChannel {
  constructor(subscription) {
    this.subscription = subscription;
  }

  uploadNewVideo(title) {
    this.subscription.notify(`new video: ${title}`);
  }
}

class Subscription {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(message) {
    this.observers.forEach((observer) => {
      observer(message);
    });
  }
}

const subscriber1 = (data) => {
  console.log(data);
};

const subscriber2 = (data) => {
  console.log(data);
};

const subscription = new Subscription();
const favoriteYouTubeChannel = new FavoriteYouTubeChannel(subscription);

// subscribe
subscription.subscribe(subscriber1);
subscription.subscribe(subscriber2);

// event trigger!
favoriteYouTubeChannel.uploadNewVideo("Ultimate Prank Bro!");

// unsubscribe
subscription.unsubscribe(subscriber2);

// event trigger!
favoriteYouTubeChannel.uploadNewVideo("Mukbang Seafood!");

/* output
  new video: Ultimate Prank Bro!
  new video: Ultimate Prank Bro!
  new video: Mukbang Seafood!
  */

// TEMPLATE METHOD PATTERN :
class Datastore {
  constructor() {
    if (this.constructor.name === "Datastore") {
      throw new Error("datastore is abstract and need to be implemented");
    }
  }

  connect() {
    throw new Error("method not implemented");
  }

  query(query) {
    throw new Error("method not implemented");
  }

  disconnect() {
    throw new Error("method not implemented");
  }

  process(query) {
    this.connect();
    const result = this.query(query);
    this.disconnect();
    return result;
  }
}

class MySQLDatastore extends Datastore {
  connect() {
    console.log("mysql connect step");
  }

  query(query) {
    console.log(`mysql execute query: ${query}`);
    return ["some data"];
  }

  disconnect() {
    console.log("mysql disconnect step");
  }
}

class PostgreSQLDatastore extends Datastore {
  connect() {
    console.log("postgresql connect step");
  }

  query(query) {
    console.log(`postgresql execute query: ${query}`);
    return ["some data"];
  }

  disconnect() {
    console.log("postgresql disconnect step");
  }
}

const mySQLDatastore = new MySQLDatastore();
const postgreSQLDatastore = new PostgreSQLDatastore();

mySQLDatastore.process("SELECT * FROM users");
postgreSQLDatastore.process("SELECT * FROM users");

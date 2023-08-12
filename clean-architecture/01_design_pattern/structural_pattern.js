// CONTOH STRUCTURAL PATTERN :
// Facade Pattern
// Adapter Pattern

// FACADE PATTERN :
class FoodOrder {
  static async order(menu) {
    try {
      const accountant = new Accountant();
      const kitchen = new Kitchen();
      const chef = new Chef();

      const bill = await accountant.recordOrder(menu);
      await kitchen.verifyAvailabilityIngredients(menu);
      const orderedFood = await chef.cook(menu);
      return { orderedFood, bill };
    } catch (error) {
      console.log(`ups! order fail due ${error}`);
    }
  }
}

// facade
FoodOrder.order("spicy bulgogi");

// ADAPTER PATTERN
class GoogleSDKAuthentication {
  authenticate() {
    // implementasi autentikasi Google
    return "authenticated!";
  }
}

class GithubSDKAuthentication {
  setToken(token) {
    this.token = token;
  }

  setMode(mode) {
    this.mode = mode;
  }

  signIn() {
    // implementasi autentikasi Github
    if (!this.token || !this.mode) {
      throw new Error("Need to define token and mode");
    }

    return "authenticated!";
  }
}

class GithubAuthenticationAdapter {
  constructor(githubSDKAuthentication, token, mode) {
    this.githubSDKAuthentication = githubSDKAuthentication;
    this.token = token;
    this.mode = mode;
  }

  authenticate() {
    this.githubSDKAuthentication.setToken(this.token);
    this.githubSDKAuthentication.setMode(this.mode);
    return this.githubSDKAuthentication.signIn();
  }
}

// implementasi autentikasi lama
const authenticateApps = (authenticator) => {
  console.log(authenticator.authenticate());
};

const googleSDKAuthentication = new GoogleSDKAuthentication();
const githubSDKAuthentication = new GithubSDKAuthentication();
const githubAuthenticationAdapter = new GithubAuthenticationAdapter(
  githubSDKAuthentication,
  "abcd-efgh",
  "read"
);

// Works!
authenticateApps(googleSDKAuthentication);

// Works!
authenticateApps(githubAuthenticationAdapter);

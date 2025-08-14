const user = {
  name: "Alex Johnson",
  email: "demo@myfinance.com",
  avatar: "/placeholder-user.png",
  balance: 12450.75,
  monthlyIncome: 5200.0,
  monthlyExpenses: 3180.25,
};

export function getUserInfo() {
  // Simulate fetching user info from an API or database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(user);
    }, 1000);
  });
}

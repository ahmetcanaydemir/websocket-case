const users = [];

// Join user
function userJoin(id, userToAdd) {
  let user = { id, user: userToAdd };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get users
function getUsers() {
  return users;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getUsers,
};

(function () {
  const socket = io();
  const querySelector = document.querySelector.bind(document);

  // Join
  socket.emit("join", window.currentUser);

  document.getElementById("active-user").textContent = window.currentUser.email;

  socket.on("onlineUsers", ({ users }) => {
    window.users = users;
    querySelector("#online-users ul").innerHTML = "";
    const total = users.length;
    querySelector("#total").innerHTML = total;

    users.map((user) => {
      const singleUser = document.createElement("li");
      singleUser.classList.add("user-li");
      singleUser.innerHTML = `❮ <a href="#" data-bs-toggle="modal" data-bs-target="#userDetailsModal" data-bs-id="${user.id}">${user.user.email}</a> ❯`;
      querySelector("#online-users ul").appendChild(singleUser);
    });
  });

  socket.on("message", (message) => {
    console.log("wqwq");
    const singleMessage = document.createElement("li");
    singleMessage.classList.add("user-li");
    singleMessage.innerHTML = message;
    querySelector("#log-list ul").appendChild(singleMessage);
  });

  var userDetailsModal = document.getElementById("userDetailsModal");
  userDetailsModal.addEventListener("show.bs.modal", function (event) {
    var button = event.relatedTarget;
    var userId = button.getAttribute("data-bs-id");

    const user = window.users.find((user) => user.id === userId);
    document.getElementById("firstName").value = user.user.firstName;
    document.getElementById("lastName").value = user.user.lastName;
    document.getElementById("email").value = user.user.email;
    document.getElementById("language").value = user.user.language;
    document.getElementById("country").value = user.user.country;
  });
  document.getElementById("leave").addEventListener("click", () => {
    const leave = confirm("Çıkmak istediğinize emin misiniz?");
    if (leave) {
      socket.disconnect();
      window.location = "/login";
    } else {
    }
  });
})();

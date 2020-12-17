const socket = new WebSocket("ws://localhost:3001");

const statusElement = document.querySelector("#status");
const formElement = document.forms.messageForm;
const inputElement = formElement.input;
const nicknameElement = document.querySelector("#nickname");
const messageElement = document.querySelector("#messages");

const renderMessage = ({ nickname, message }) => {
  const li = document.createElement("li");

  const nickNameElement = document.createElement("span");
  nickNameElement.textContent = `${nickname}: `;

  const msgElement = document.createElement("span");
  msgElement.textContent = message;

  li.append(nickNameElement, msgElement);
  messageElement.appendChild(li);
};

const submitData = (e) => {
  e.preventDefault();
  const { value: message } = inputElement;
  const { value: nickname } = nicknameElement;
  socket.send(JSON.stringify({ nickname, message }));
  inputElement.value = "";
};

socket.onmessage = (data) => {
  const response = JSON.parse(data.data);
  if (response.type === "store") {
    response.messages.forEach((data) => {
      renderMessage(data);
    });
    return;
  }
  if (response.type === "msg") {
    renderMessage(response.message);
    return;
  }
};

formElement.addEventListener("submit", submitData);

socket.onopen = () => {
  console.log("Connected to server");
  statusElement.textContent = "ONLINE";
  statusElement.classList.toggle("online");
  statusElement.classList.toggle("offline");
};

socket.onclose = () => {
  console.log("Disconnected");
  statusElement.textContent = "OFFLINE";
  statusElement.classList.toggle("online");
  statusElement.classList.toggle("offline");
};

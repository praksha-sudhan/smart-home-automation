document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("deviceForm");
  const deviceList = document.getElementById("deviceList");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("deviceName").value;
    const type = document.getElementById("deviceType").value;
    const room = document.getElementById("deviceRoom").value;

    const li = document.createElement("li");
    li.textContent = `${name} (${type}) - ${room}`;
    li.onclick = function () {
      showPopup(name, type, room);
    };

    deviceList.appendChild(li);

    // Show success alert
    alert("Device is added...");

    form.reset();
  });
});

function showPopup(name, type, room) {
  document.getElementById("popupDeviceName").textContent = name;
  document.getElementById("popupDeviceType").textContent = type;
  document.getElementById("popupDeviceRoom").textContent = room;
  document.getElementById("deviceStatus").textContent = "OFF";
  document.getElementById("popup").style.display = "block";
}

function toggleDeviceStatus() {
  const statusSpan = document.getElementById("deviceStatus");
  statusSpan.textContent = statusSpan.textContent === "OFF" ? "ON" : "OFF";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}


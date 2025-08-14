
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("deviceForm");
  const deviceList = document.getElementById("deviceList");

  if (!form || !deviceList) {
    console.error("Missing required elements: deviceForm and/or deviceList");
    return;
  }


  function escapeHTML(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  
  function injectStyles() {
    if (document.getElementById("device-ui-styles")) return;
    const css = `
      
    `;
    const style = document.createElement("style");
    style.id = "device-ui-styles";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }


  function ensureToastContainer() {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, opts = {}) {

    const { type = "success", duration = 3000 } = opts;
    const container = ensureToastContainer();
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${escapeHTML(message)}</span><button class="close" aria-label="close">&times;</button>`;

    const closeBtn = t.querySelector(".close");
    closeBtn.addEventListener("click", () => removeToast(t));

    container.appendChild(t);

    
    requestAnimationFrame(() => t.classList.add("show"));

   
    const timer = setTimeout(() => removeToast(t), duration);

    function removeToast(el) {
      clearTimeout(timer);
      el.classList.remove("show");
      el.addEventListener(
        "transitionend",
        () => {
          if (el.parentNode) el.parentNode.removeChild(el);
        },
        { once: true }
      );
    }
  }


  let popup; 
  let popupTitle, popupContent, popupActions, popupCloseBtn;

  function ensurePopup() {
    popup = document.querySelector(".popup-box");
    if (!popup) {
  
      popup = document.createElement("div");
      popup.className = "popup-box";
      popup.innerHTML = `
        <button class="popup-close" aria-label="Close">&times;</button>
        <h3 class="popup-title"></h3>
        <div class="popup-content"></div>
        <div class="popup-actions"></div>
      `;
      document.body.appendChild(popup);
    }
    popupTitle = popup.querySelector(".popup-title");
    popupContent = popup.querySelector(".popup-content");
    popupActions = popup.querySelector(".popup-actions");
    popupCloseBtn = popup.querySelector(".popup-close");

    if (popupCloseBtn && !popupCloseBtn._hasListener) {
      popupCloseBtn.addEventListener("click", hidePopup);
      popupCloseBtn._hasListener = true;
    }
  }

  function showPopup(title = "", content = "", actions = []) {
    ensurePopup();
    popupTitle.textContent = title || "";
    popupContent.innerHTML = escapeHTML(content).replace(/\n/g, "<br>");
    popupActions.innerHTML = "";

  
    actions.forEach((a) => {
      const b = document.createElement("button");
      b.className = `popup-action ${a.className || ""}`.trim();
      b.textContent = a.text || "OK";
      b.addEventListener("click", (ev) => {
        try {
          if (typeof a.onClick === "function") a.onClick(ev);
        } catch (err) {
          console.error("action handler error", err);
        }
        if (a.autoHide !== false) hidePopup();
      });
      popupActions.appendChild(b);
    });

    popup.style.display = "block";
   
    requestAnimationFrame(() => popup.classList.add("show"));
  }

  function hidePopup() {
    if (!popup) return;
    popup.classList.remove("show");
    popup.addEventListener(
      "transitionend",
      () => {
        if (popup) popup.style.display = "none";
        if (popupActions) popupActions.innerHTML = "";
      },
      { once: true }
    );
  }


  function confirmDialog(title, content) {
    return new Promise((resolve) => {
      showPopup(title, content, [
        {
          text: "Remove",
          className: "danger",
          onClick: () => resolve(true),
          autoHide: true,
        },
        { text: "Cancel", className: "", onClick: () => resolve(false), autoHide: true },
      ]);
    });
  }

 
  let devices = [];

  function renderDevices() {
    deviceList.innerHTML = "";
    devices.forEach((device, index) => {
      const li = document.createElement("li");
      li.className = "device-item";
      li.innerHTML = `
        <div class="device-label">${escapeHTML(device.name)} <span class="device-type">(${escapeHTML(device.type)})</span></div>
        <div class="device-actions">
          <button class="delete-btn" title="Remove device">Remove</button>
        </div>
      `;

      li.querySelector(".device-label").addEventListener("click", () => {
        showPopup("Device Details", `Name: ${device.name}\nType: ${device.type}`, [
          { text: "Close", className: "", onClick: () => {}, autoHide: true },
        ]);
      });

   
      li.querySelector(".delete-btn").addEventListener("click", async () => {
        const ok = await confirmDialog("Confirm Remove", `Remove device "${device.name}"?`);
        if (ok) {
          devices.splice(index, 1);
          renderDevices();
          showToast(`🗑️ "${device.name}" removed`, { type: "success", duration: 2200 });
        }
      });

      deviceList.appendChild(li);
      
      setTimeout(() => li.classList.add("entered"), 20);
    });
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const nameInput = document.getElementById("deviceName");
    const typeInput = document.getElementById("deviceType");
    if (!nameInput || !typeInput) {
      showToast("Form inputs missing (deviceName/deviceType)", { type: "success", duration: 2500 });
      return;
    }
    const name = nameInput.value.trim();
    const type = typeInput.value.trim();
    if (!name || !type) {
      showPopup("Validation", "Please enter a device name and type.", [{ text: "OK", className: "", autoHide: true }]);
      return;
    }

    devices.push({ name, type });
    renderDevices();

   
    showToast(`✅ Device "${name}" added successfully!`, { type: "success", duration: 3200 });

    form.reset();
    nameInput.focus();
  });


  injectStyles();
  ensureToastContainer();
  ensurePopup();
  renderDevices();
});

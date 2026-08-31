document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("wellness-form");
  if (!form || typeof SignaturePad === "undefined") return;

  var setups = [
    { canvas: "client-signature-pad", input: "client-signature-input", clear: "clear-client-signature", label: "client signature" },
    { canvas: "privacy-signature-pad", input: "privacy-signature-input", clear: "clear-privacy-signature", label: "privacy signature" },
    { canvas: "waiver-signature-pad", input: "waiver-signature-input", clear: "clear-waiver-signature", label: "waiver signature" }
  ];

  function resizeCanvas(canvas, pad) {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    var rect = canvas.getBoundingClientRect();
    var data = pad && !pad.isEmpty() ? pad.toData() : null;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    var ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    if (pad) {
      pad.clear();
      if (data) pad.fromData(data);
    }
  }

  var pads = setups.map(function (item) {
    var canvas = document.getElementById(item.canvas);
    var input = document.getElementById(item.input);
    if (!canvas || !input) return null;
    var pad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255,255,255)",
      penColor: "rgb(20,40,32)"
    });
    resizeCanvas(canvas, pad);
    var clearBtn = document.getElementById(item.clear);
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        pad.clear();
        input.value = "";
      });
    }
    return { pad: pad, canvas: canvas, input: input, label: item.label };
  }).filter(Boolean);

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      pads.forEach(function (item) {
        resizeCanvas(item.canvas, item.pad);
      });
    }, 150);
  });

  function showMessage(message, type) {
    var box = document.getElementById("form-message");
    box.textContent = message;
    box.style.display = "block";
    box.style.backgroundColor = type === "error" ? "#fdecea" : "#e8f5e9";
    box.style.color = type === "error" ? "#8a1f11" : "#1b5e20";
    box.style.border = type === "error" ? "1px solid #f5c2c0" : "1px solid #a5d6a7";
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function compactSignature(pad) {
    return pad.toDataURL("image/jpeg", 0.55);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    var submitBtn = document.getElementById("submit-btn");
    var emptyPad = pads.find(function (item) { return item.pad.isEmpty(); });
    if (emptyPad) {
      showMessage("Please provide your " + emptyPad.label + ".", "error");
      return;
    }

    ["cellPhone", "homePhone", "emergencyPhone", "zip"].forEach(function (id) {
      var field = document.getElementById(id);
      if (field) field.value = field.value.replace(/\D/g, "");
    });

    pads.forEach(function (item) {
      item.input.value = compactSignature(item.pad);
    });

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    var payload = {};
    new FormData(form).forEach(function (value, key) {
      if (typeof value === "string") payload[key] = value;
    });

    var fileInput = form.querySelector('input[type="file"]');
    var files = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
    var oversized = files.find(function (file) { return file.size > 2 * 1024 * 1024; });
    if (oversized) {
      showMessage("Each attachment must be 2MB or smaller.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Form";
      return;
    }

    try {
      var apiResponse = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (apiResponse.ok) {
        var apiData = await apiResponse.json().catch(function () { return {}; });
        if (apiData.success !== false) {
          window.location.href = "thank-you.html";
          return;
        }
      }

      var fallback = await fetch("https://formsubmit.co/ajax/wholesoulyork@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(Object.assign({
          _subject: "New Client Intake Form - WholeSoul Wellness",
          _template: "table",
          _captcha: "false"
        }, payload))
      });

      var fallbackData = await fallback.json().catch(function () { return {}; });
      if (fallback.ok && fallbackData.success !== false) {
        window.location.href = "thank-you.html";
        return;
      }

      throw new Error(fallbackData.message || "Submission failed");
    } catch (err) {
      showMessage("We could not send the form just now. Please try again or email wholesoulyork@gmail.com.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Form";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("wellness-form");
  if (!form || typeof SignaturePad === "undefined") return;

  form.setAttribute("action", "https://formsubmit.co/wholesoulyork@gmail.com");
  form.setAttribute("method", "POST");
  form.setAttribute("enctype", "multipart/form-data");

  function ensureHidden(name, value) {
    var existing = form.querySelector('input[name="' + name + '"]');
    if (!existing) {
      existing = document.createElement("input");
      existing.type = "hidden";
      existing.name = name;
      form.appendChild(existing);
    }
    existing.value = value;
  }

  ensureHidden("_subject", "New Client Intake Form - WholeSoul Wellness");
  ensureHidden("_template", "table");
  ensureHidden("_captcha", "false");
  ensureHidden("_next", "https://wholesoulyork.com/thank-you.html");

  var setups = [
    { canvas: "client-signature-pad", input: "client-signature-input", clear: "clear-client-signature", label: "client signature", fileName: "client-signature.jpg", field: "Client Signature Image" },
    { canvas: "privacy-signature-pad", input: "privacy-signature-input", clear: "clear-privacy-signature", label: "privacy signature", fileName: "privacy-signature.jpg", field: "Privacy Signature Image" },
    { canvas: "waiver-signature-pad", input: "waiver-signature-input", clear: "clear-waiver-signature", label: "waiver signature", fileName: "waiver-signature.jpg", field: "Waiver Signature Image" }
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
    if (!canvas) return null;
    var pad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255,255,255)",
      penColor: "rgb(20,40,32)"
    });
    resizeCanvas(canvas, pad);
    var clearBtn = document.getElementById(item.clear);
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        pad.clear();
        if (input) input.value = "";
      });
    }
    return {
      pad: pad,
      canvas: canvas,
      input: input,
      label: item.label,
      fileName: item.fileName,
      field: item.field
    };
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

  function tinySignatureBlob(pad) {
    return new Promise(function (resolve, reject) {
      var exportCanvas = document.createElement("canvas");
      exportCanvas.width = 280;
      exportCanvas.height = 90;
      var ctx = exportCanvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      ctx.drawImage(pad.canvas, 0, 0, exportCanvas.width, exportCanvas.height);
      exportCanvas.toBlob(function (blob) {
        if (!blob) reject(new Error("Could not save signature"));
        else resolve(blob);
      }, "image/jpeg", 0.35);
    });
  }

  function assignFile(fieldName, file) {
    var input = form.querySelector('input[type="file"][name="' + fieldName + '"]');
    if (!input) {
      input = document.createElement("input");
      input.type = "file";
      input.name = fieldName;
      input.accept = "image/jpeg";
      input.hidden = true;
      form.appendChild(input);
    }
    var transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
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

    var fileInput = form.querySelector('input[type="file"][name="attachment"]');
    var extraFiles = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
    var extraBytes = extraFiles.reduce(function (sum, file) { return sum + file.size; }, 0);
    if (extraBytes > 8 * 1024 * 1024) {
      showMessage("Please keep extra documents under 8MB total so FormSubmit can email them.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      var blobs = await Promise.all(pads.map(function (item) {
        return tinySignatureBlob(item.pad);
      }));

      pads.forEach(function (item, index) {
        var file = new File([blobs[index]], item.fileName, { type: "image/jpeg" });
        assignFile(item.field, file);
        if (item.input) item.input.value = "Attached as " + item.fileName;
      });

      form.submit();
    } catch (err) {
      showMessage(err && err.message ? err.message : "Could not prepare the signatures.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Form";
    }
  });
});

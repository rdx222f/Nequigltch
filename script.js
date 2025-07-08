
function obfuscate() {
    const input = document.getElementById("lua-input").value.trim();
    if (!input) {
        alert("Please paste a LuaU script first.");
        return;
    }

    document.getElementById("status").innerText = "Obfuscating...";

    fetch("obfuscate-local", {
        method: "POST",
        body: input
    }).then(res => res.text())
      .then(data => {
          document.getElementById("lua-output").value = data;
          document.getElementById("output-section").style.display = "block";
          document.getElementById("status").innerText = "Obfuscation complete.";
      })
      .catch(() => {
          document.getElementById("status").innerText = "Error during obfuscation.";
      });
}

function copyOutput() {
    const output = document.getElementById("lua-output").value;
    navigator.clipboard.writeText(output).then(() => {
        document.getElementById("status").innerText = "Copied to clipboard!";
    });
}

function downloadOutput() {
    const content = document.getElementById("lua-output").value;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "obfuscated_script.lua";
    a.click();
    URL.revokeObjectURL(url);
}

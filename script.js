
function obfuscate() {
    const input = document.getElementById("lua-input").value.trim();
    if (!input) {
        alert("Please paste a LuaU script first.");
        return;
    }

    document.getElementById("status").innerText = "Obfuscating...";
    fetch("https://wearedevs.net/api/obfuscate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: input })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
            return;
        }
        document.getElementById("lua-output").value = data.obfuscated;
        document.getElementById("output-section").style.display = "block";
        document.getElementById("status").innerText = "Obfuscation complete.";
    })
    .catch(() => {
        document.getElementById("status").innerText = "Error contacting API.";
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

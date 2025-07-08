
function obfuscate() {
    const input = document.getElementById("lua-input").value.trim();
    if (!input) {
        alert("Please paste a LuaU script first.");
        return;
    }

    document.getElementById("status").innerText = "Obfuscating...";
    const keywords = new Set(["local", "function", "if", "then", "end", "for", "while", "do", "return", "true", "false", "nil", "not", "and", "or", "break"]);
    const words = input.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
    const unique = [...new Set(words.filter(w => !keywords.has(w)))];
    const map = {};
    unique.forEach((word, i) => map[word] = "v" + String(i).padStart(3, '0'));
    const output = input.replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, w => map[w] || w);

    document.getElementById("lua-output").value = output;
    document.getElementById("output-section").style.display = "block";
    document.getElementById("status").innerText = "Obfuscation complete.";
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

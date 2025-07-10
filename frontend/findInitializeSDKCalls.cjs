const fs = require("fs");
const path = require("path");

// Directory to scan - adjust if needed
const ROOT_DIR = "../pdf-debug-alt"; // or "." if your code is in root

// Recursively read all .js/.jsx/.ts/.tsx files
function getAllJsFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllJsFiles(fullPath, files);
    } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

// Search for initializeSDK calls
function findInitializeSDKCalls(files) {
  const regex = /initializeSDK\s*\(([^)]*)\)/g;
  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    let match;
    while ((match = regex.exec(content)) !== null) {
      const args = match[1].trim();
      // Log calls with no args or with a suspicious arg (like undefined or empty)
      if (
        args === "" ||
        args === "undefined" ||
        args === "null" ||
        args === "{}"
      ) {
        console.log(`Possible problematic call in ${file}:`);
        console.log(`  initializeSDK(${args}) at index ${match.index}`);
        console.log(
          `  Line: ${content.substring(0, match.index).split("\n").length}\n`
        );
      }
    }
  });
}

const files = getAllJsFiles(ROOT_DIR);
findInitializeSDKCalls(files);

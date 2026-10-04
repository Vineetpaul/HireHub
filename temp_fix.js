const fs = require("fs");
const f = "c:/Users/admin/OneDrive/Desktop/HireHub/frontend/HireHub/src/pages/JobSeeker/JobDetails.jsx";
let c = fs.readFileSync(f, "utf8");
c = c.replace(/font-medium >/g, "font-medium ${typeColor[job.type] || 'bg-gray-100 text-gray-700'}>");
fs.writeFileSync(f, c);
console.log("Fixed: " + (c.match(/font-medium >/g) || []).length + " remaining");

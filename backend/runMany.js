
const {exec} = require("child_process");

for(let i=1;i < 100; i++) {
    exec(`node test.js ${Math.random() * 999999999} ${Math.random() * 999999999}`)
}
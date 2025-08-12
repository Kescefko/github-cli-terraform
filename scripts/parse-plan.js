const fs = require("fs");
const { execSync } = require("child_process");

function parsePlan() {
  const planOutput = fs.readFileSync("plan.txt", "utf8");

  const match = planOutput.match(/Plan:\s+(\d+)\s+to add,\s+(\d+)\s+to change,\s+(\d+)\s+to destroy/);

  if (!match) {
    console.error("Could not find Terraform plan summary line.");
    process.exit(1);
  }

  const [add, change, destroy] = match.slice(1).map(Number);
  console.log(`Detected plan: add=${add}, change=${change}, destroy=${destroy}`);

  if (add === 1 && change === 0 && destroy === 0) {
    console.log("Plan matches expected criteria.");
    return true;
  } else {
    console.error("Plan does NOT match expected criteria.");
    return false;
  }
}

function mergePR(prNumber) {
  try {
    console.log(`Attempting to merge PR #${prNumber}...`);
    execSync(`gh pr merge ${prNumber} --merge --admin`, {
        stdio: 'inherit', env: process.env 
    });
    console.log("PR merged successfully.");
  } catch (error) {
        console.error("Failed to merge PR:", error.message);
        process.exit(1);
  }
}

async function main() {
  const prNumber = process.env.PR_NUMBER;

  if (!prNumber) {
    console.error("PR_NUMBER environment variable is not set.");
    process.exit(1);
  }

  const planIsValid = parsePlan();

  if (!planIsValid) {
    process.exit(1);
  }

  mergePR(prNumber);
}

main();

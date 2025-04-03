#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import chalk from "chalk";

async function createProject() {
  const response = await prompts({
    type: "text",
    name: "name",
    message: "Enter project name:",
    initial: "my-react-app",
  });

  const projectName = response.name;
  const targetDir = path.resolve(process.cwd(), projectName);

  console.log(chalk.green(`\nCreating React project with Vite...`));

  // Run create-vite
  execSync(`pnpm create vite ${projectName} --template react`, {
    stdio: "inherit",
  });

  // Navigate to project folder
  process.chdir(targetDir);

  console.log(chalk.blue("\nInstalling dependencies...\n"));

  // Install dependencies
  execSync(`pnpm install`, { stdio: "inherit" });
  execSync(`pnpm install tailwindcss @tailwindcss/vite react-router-dom`, {
    stdio: "inherit",
  });

  fs.writeFileSync("src/index.css", `@import "tailwindcss";`);
  fs.writeFileSync(
    "src/assets/tailwind.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" fill="none" viewBox="0 0 256 256"><rect width="256" height="256" fill="#242938" rx="60"/><path fill="url(#paint0_linear_2_119)" fill-rule="evenodd" d="M83 110C88.9991 86.0009 104.001 74 128 74C164 74 168.5 101 186.5 105.5C198.501 108.501 209 104.001 218 92C212.001 115.999 196.999 128 173 128C137 128 132.5 101 114.5 96.5C102.499 93.4991 92 97.9991 83 110ZM38 164C43.9991 140.001 59.0009 128 83 128C119 128 123.5 155 141.5 159.5C153.501 162.501 164 158.001 173 146C167.001 169.999 151.999 182 128 182C92 182 87.5 155 69.5 150.5C57.4991 147.499 47 151.999 38 164Z" clip-rule="evenodd"/><defs><linearGradient id="paint0_linear_2_119" x1="86.5" x2="163.5" y1="74" y2="185.5" gradientUnits="userSpaceOnUse"><stop stop-color="#32B1C1"/><stop offset="1" stop-color="#14C6B7"/></linearGradient></defs></svg>`
  );

  // Add React Router setup
  fs.writeFileSync(
    "src/App.jsx",
    `import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import tailwindlogo from './assets/tailwind.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={tailwindlogo} className="logo" alt="tailwindcss logo" />
        </a>
      </div>
      <h1>Vite + React + tailwindcss v4</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p> 
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
`
  );

  console.log(chalk.green("\nSetup complete! 🎉\n"));
  console.log(chalk.yellow(`\nRun these commands to start:\n`));
  console.log(chalk.cyan(`cd ${projectName}`));
  console.log(chalk.cyan(`pnpm run dev`));
}

createProject();

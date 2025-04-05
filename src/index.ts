#!/usr/bin/env node
//@ts-ignore
import { exec, execSync } from "child_process";
import prompts from "prompts";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const createProject = async () => {
  const response = await prompts([
    {
      type: "text",
      name: "name",
      message: "Enter project name:",
      initial: "my-app",
    },
    {
      type: "select",
      name: "bundler",
      message: "Choose a bundler:",
      choices: [
        { title: "Vite", value: "vite" },
        { title: "Rsbuild", value: "rsbuild" },
      ],
    },
    {
      type: "toggle",
      name: "typescript",
      message: "Use TypeScript?",
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "select",
      name: "cssFramework",
      message: "Choose a CSS framework:",
      choices: [
        { title: "Tailwind CSS v4(does not support rsbuild)", value: "tailwind" },
        { title: "UnoCSS", value: "unocss" },
        { title: "Bootstrap", value: "bootstrap" },
      ],
    },
    {
      type: "select",
      name: "preprocessor",
      message: "Choose a CSS preprocessor:",
      choices: [
        { title: "Sass", value: "sass" },
        { title: "Less", value: "less" },
        { title: "None", value: "none" },
      ],
    },
    {
      type: "toggle",
      name: "git",
      message: "Initialize a git repository?",
      initial: true,
      active: "Yes",
      inactive: "No",
    },
    {
      type: "select",
      name: "state",
      message: "Choose a state management library:",
      choices: [
        { title: "Redux", value: "redux" },
        { title: "MobX", value: "mobx" },
        { title: "None", value: "none" },
      ],
    },    
  ]);

  const { name, bundler, typescript, cssFramework, preprocessor, git, state } = response;
  const template = typescript ? "react-ts" : "react";
  const targetDir = path.resolve(process.cwd(), name);

  
  if (bundler === "vite") {
    console.log(chalk.green(`\nCreating Vite project with template "${template}"...`));
    execSync(`pnpm create vite ${name} --template ${template}`, { stdio: "inherit" });
  } else {
    console.log(chalk.green(`\nCreating Rsbuild project with template "${template}"...`));
    execSync(`pnpm create rsbuild --dir ${name} --template ${template}`, { stdio: "inherit" });
  }
  

  process.chdir(targetDir);

  console.log(chalk.blue(`\nInstalling dependencies...\n`));
  execSync(`pnpm install`, { stdio: "inherit" });

  // State Management Setup
  switch (state) {
    case "redux":
      console.log(chalk.green("Installing Redux..."));
      execSync(`pnpm install @reduxjs/toolkit react-redux`, { stdio: "inherit" });

      fs.writeFileSync(
        "src/store.js",
        `import { configureStore } from '@reduxjs/toolkit';

        export const store = configureStore({
        reducer: {},
          }); 

// Example usage:
// import { Provider } from 'react-redux';
// <Provider store={store}>...</Provider>`
      );
      break;

    case "mobx":
      console.log(chalk.green("Installing MobX..."));
      execSync(`pnpm install mobx mobx-react-lite`, { stdio: "inherit" });

      fs.writeFileSync(
        "src/store.js",
        `import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

class AppStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }
}

const StoreContext = createContext(new AppStore());

export const useStore = () => useContext(StoreContext);

// Example usage:
// const { count, increment } = useStore();`
      );
      break;
  }


  // CSS Framework Setup
  switch (cssFramework) {
    case "tailwind":
      console.log(chalk.green("Setting up Tailwind CSS v4..."));
      execSync(`pnpm install tailwindcss @tailwindcss/vite`, { stdio: "inherit" });

      fs.writeFileSync(
        "src/index.css",
        `@import "tailwindcss";`
      );
      break;

    case "unocss":
      console.log(chalk.green("Setting up UnoCSS..."));
      execSync(`pnpm install -D unocss`, { stdio: "inherit" });

      fs.writeFileSync(
        "uno.config.js",
        `import { defineConfig, presetUno } from 'unocss';

          export default defineConfig({
            presets: [presetUno()],
        });`
      );

      const viteConfigPath = typescript ? "vite.config.ts" : "vite.config.js";
      const viteConfig = fs.readFileSync(viteConfigPath, "utf-8");
      const updatedConfig = viteConfig.replace(
        /plugins:\s*\[/,
        `plugins: [\n    require('unocss/vite').default(),`
      );
      fs.writeFileSync(viteConfigPath, updatedConfig);
      break;

    case "bootstrap":
      console.log(chalk.green("Setting up Bootstrap CSS..."));
      execSync(`pnpm install bootstrap`, { stdio: "inherit" });
      fs.appendFileSync("src/index.css", `\n@import "bootstrap/dist/css/bootstrap.min.css";`);
      break;
  }

  // CSS Preprocessor Setup
  switch (preprocessor) {
    case "sass":
      console.log(chalk.green("Installing Sass..."));
      execSync(`pnpm install -D sass`, { stdio: "inherit" });
      break;
    case "less":
      console.log(chalk.green("Installing Less..."));
      execSync(`pnpm install -D less`, { stdio: "inherit" });
      break;
  }

  // Git Initialization
  if (git) {
    console.log(chalk.green("\nInitializing git repository..."));
    execSync("git init", { stdio: "inherit" });
  }
  
  console.log(chalk.green(`\nAll done! 🚀`));
  console.log(chalk.yellow(`\nNext steps:`));
  console.log(chalk.cyan(`cd ${name}`));
  console.log(chalk.cyan(`pnpm run dev`));
}



createProject();
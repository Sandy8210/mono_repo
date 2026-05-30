const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const GITHUB_RAW_BASE_URL =
  "https://raw.githubusercontent.com/Sandy8210/mono_repo/main";

const ROOT_PATH = "E:\\learning\\monoRepo";

const APPS = ["sme", "retail"];

const SHADCN_COMPONENTS = [
  "button",
  "input",
  "card",
  "select",
  "radio-group",
  "checkbox",
  "popover",
  "calendar",
  "textarea",
  "switch",
  "label",
  "command",
  "dialog",
  "tabs",
  "table",
  "accordion",
  "alert",
  "drawer",
  "sheet",
  "avatar",
  "separator",
  "field",
  "scroll-area",
  "empty",
  "input-otp",
  "spinner",
  "input-group",
];

const SHARED_DEPENDENCIES = {
  "@tanstack/react-table": "8.21.3",
  "@reduxjs/toolkit": "2.12.0",
  "@tanstack/react-query": "5.100.11",
  "crypto-js": "4.2.0",
  "react-toastify": "11.1.0",
  axios: "1.16.1",
  "@hookform/resolvers": "3.9.0",
  "class-variance-authority": "0.7.0",
  clsx: "2.1.0",
  dayjs: "1.11.20",
  exceljs: "4.4.0",
  "lucide-react": "1.16.0",
  "react-dropzone": "15.0.0",
  "react-hook-form": "7.76.0",
  "react-router-dom": "7.15.1",
  "tailwind-merge": "3.6.0",
  zod: "4.4.3",
  jsencrypt: "3.5.4",
};

const sharedDepsJson = Object.entries(SHARED_DEPENDENCIES)
  .map(([pkg, ver]) => `    "${pkg}": "${ver}"`)
  .join(",\n");

const appSharedDepsEntries = Object.entries(SHARED_DEPENDENCIES)
  .map(([pkg, ver]) => `"${pkg}": "${ver}"`)
  .join(",\n    ");

// ==========================================
// 2. UTILITY FUNCTIONS
// ==========================================

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content.trim() + "\n", "utf8");
}

function runCmd(command, cwd) {
  console.log(`\n> Running: ${command}`);
  execSync(command, { stdio: "inherit", cwd });
}

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });

  fs.readdirSync(from).forEach((element) => {
    const fromElement = path.join(from, element);
    const toElement = path.join(to, element);
    if (fs.lstatSync(fromElement).isFile()) {
      fs.copyFileSync(fromElement, toElement);
    } else {
      copyFolderSync(fromElement, toElement);
    }
  });
}

// Fetches an entire directory from GitHub dynamically using their API
async function fetchFolderFromGitHub(githubFolderPath, localTargetDir) {
  console.log(`\n☁️ Fetching entire folder from GitHub: ${githubFolderPath}`);

  // Use the GitHub API to list the contents of the directory
  const apiUrl = `https://api.github.com/repos/Sandy8210/mono_repo/contents/${githubFolderPath}?ref=main`;

  const response = await fetch(apiUrl, {
    // GitHub requires a User-Agent for API requests
    headers: { "User-Agent": "MonoRepo-Bootstrap-Script" },
  });

  if (!response.ok) {
    throw new Error(
      `❌ Failed to fetch folder list for ${githubFolderPath}. (Status: ${response.status})`,
    );
  }

  const items = await response.json();

  // Ensure the local target directory exists
  if (!fs.existsSync(localTargetDir)) {
    fs.mkdirSync(localTargetDir, { recursive: true });
  }

  // Loop through all items in the folder
  for (const item of items) {
    if (item.type === "file") {
      console.log(`   ⬇️ Downloading file: ${item.name}`);
      const fileRes = await fetch(item.download_url);
      const content = await fileRes.text();
      fs.writeFileSync(path.join(localTargetDir, item.name), content, "utf8");
    }
    // If there is a sub-folder inside the validation folder, recursively fetch it too!
    else if (item.type === "dir") {
      await fetchFolderFromGitHub(
        item.path,
        path.join(localTargetDir, item.name),
      );
    }
  }
}

async function fetchAndRenderTemplate(fileName, variables = {}) {
  const url = `${GITHUB_RAW_BASE_URL}/${fileName}`;
  console.log(`☁️ Fetching: ${fileName}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `❌ Failed to fetch ${fileName} from GitHub. (Status: ${response.status})`,
    );
  }

  let content = await response.text();

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    content = content.replace(regex, value);
  }

  return content;
}

// ==========================================
// 3. MASTER BOOTSTRAP FUNCTION (ASYNC)
// ==========================================

async function bootstrap() {
  console.log(`🚀 Bootstrapping MonoRepo at: ${ROOT_PATH}`);

  let pnpmVersion = "9.0.0";
  try {
    pnpmVersion = execSync("pnpm -v").toString().trim();
  } catch (e) {
    runCmd(`npm install -g pnpm@${pnpmVersion}`, process.cwd());
  }

  if (!fs.existsSync(ROOT_PATH)) fs.mkdirSync(ROOT_PATH, { recursive: true });

  console.log(`\n📦 Setting up root workspace...`);
  writeFile(
    `${ROOT_PATH}/pnpm-workspace.yaml`,
    `packages:\n  - "apps/*"\n  - "packages/*"`,
  );
  writeFile(
    `${ROOT_PATH}/turbo.json`,
    `{ "$schema": "https://turbo.build/schema.json", "tasks": { "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] }, "lint": {}, "dev": { "cache": false, "persistent": true } } }`,
  );

  const rootPackageJson = await fetchAndRenderTemplate(
    "root-package.json.hbs",
    { PNPM_VERSION: pnpmVersion, SHARED_DEPS: sharedDepsJson },
  );
  writeFile(`${ROOT_PATH}/package.json`, rootPackageJson);

  console.log(`\n🛠️ Setting up shared packages...`);

  // Config & Store
  writeFile(
    `${ROOT_PATH}/packages/config/package.json`,
    `{"name": "@company/config", "version": "0.0.0", "private": true, "devDependencies": {"tailwindcss": "^3.4.1", "tailwindcss-animate": "^1.0.7", "typescript": "^5.2.2"}}`,
  );
  writeFile(
    `${ROOT_PATH}/packages/config/tailwind/base.ts`,
    `import type { Config } from "tailwindcss"; import tailwindAnimate from "tailwindcss-animate"; export const baseConfig: Config = { darkMode: ["class"], theme: { extend: { colors: { background: "hsl(var(--background))", foreground: "hsl(var(--foreground))", primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" }, border: "hsl(var(--border))", input: "hsl(var(--input))", ring: "hsl(var(--ring))" } } }, plugins: [tailwindAnimate] };`,
  );
  writeFile(
    `${ROOT_PATH}/packages/store/package.json`,
    `{"name": "@company/store", "version": "0.0.0", "private": true, "exports": {".": "./src/index.ts"}, "dependencies": {"@reduxjs/toolkit": "${SHARED_DEPENDENCIES["@reduxjs/toolkit"]}", "react-redux": "^9.1.0"}}`,
  );
  writeFile(
    `${ROOT_PATH}/packages/store/src/index.ts`,
    `import { createSlice } from '@reduxjs/toolkit'; export const sharedAuthSlice = createSlice({ name: 'auth', initialState: { user: null, token: null }, reducers: { setCredentials: (state, action) => { state.user = action.payload.user; state.token = action.payload.token; } } }); export const localStorageSyncMiddleware = (store: any) => (next: any) => (action: any) => { const result = next(action); localStorage.setItem('monorepo_shared_state', JSON.stringify(store.getState())); return result; };`,
  );

  // Form Builder Package (Fetched entirely from GitHub!)
  console.log(`\n☁️ Fetching Form Builder files from GitHub...`);
  writeFile(
    `${ROOT_PATH}/packages/form-builder/package.json`,
    `{"name": "@company/form-builder", "version": "0.0.0", "private": true, "exports": { ".": "./src/index.tsx" }, "dependencies": { "@company/ui": "workspace:*", "react-hook-form": "${SHARED_DEPENDENCIES["react-hook-form"]}", "zod": "${SHARED_DEPENDENCIES["zod"]}", "@hookform/resolvers": "${SHARED_DEPENDENCIES["@hookform/resolvers"]}" }, "peerDependencies": { "react": "^18.2.0" }}`,
  );
  writeFile(
    `${ROOT_PATH}/packages/form-builder/tsconfig.json`,
    `{"compilerOptions": {"target": "es2016", "jsx": "react-jsx", "module": "commonjs", "esModuleInterop": true, "strict": true, "skipLibCheck": true}}`,
  );

  const fbIndex = await fetchAndRenderTemplate("FormBuilder/index.tsx");
  writeFile(`${ROOT_PATH}/packages/form-builder/src/index.tsx`, fbIndex);

  const fbFieldRender = await fetchAndRenderTemplate(
    "FormBuilder/FieldRender.tsx",
  );
  writeFile(
    `${ROOT_PATH}/packages/form-builder/src/FieldRender.tsx`,
    fbFieldRender,
  );

  // Assuming it's index.ts inside the validation folder based on standard practices
  const fbValidation = await fetchFolderFromGitHub(
    "FormBuilder/validation",
    `${ROOT_PATH}/packages/form-builder/src/validation`,
  );

  // UI Package (Base)
  writeFile(
    `${ROOT_PATH}/packages/ui/package.json`,
    `{"name": "@company/ui", "version": "0.0.0", "private": true, "exports": { ".": "./src/index.ts", "./lib/utils": "./src/lib/utils.ts", "./components/*": "./src/components/*" }}`,
  );
  writeFile(
    `${ROOT_PATH}/packages/ui/components.json`,
    `{"$schema": "https://ui.shadcn.com/schema.json", "style": "default", "rsc": false, "tsx": true, "tailwind": {"config": "tailwind.config.ts", "css": "src/index.css", "baseColor": "slate", "cssVariables": true, "prefix": ""}, "aliases": {"components": "@company/ui/components", "utils": "@company/ui/lib/utils"}}`,
  );
  writeFile(
    `${ROOT_PATH}/packages/ui/tsconfig.json`,
    `{"compilerOptions": {"target": "es2016", "jsx": "react-jsx", "module": "commonjs", "ignoreDeprecations": "6.0", "baseUrl": ".", "paths": {"@company/ui/*": ["./src/*"]}, "esModuleInterop": true, "strict": true, "skipLibCheck": true}}`,
  );
  writeFile(
    `${ROOT_PATH}/packages/ui/tailwind.config.ts`,
    `import type { Config } from "tailwindcss"; export default { content: ["./src/**/*.{ts,tsx}"] } satisfies Config;`,
  );
  writeFile(
    `${ROOT_PATH}/packages/ui/src/lib/utils.ts`,
    `import { type ClassValue, clsx } from "clsx"; import { twMerge } from "tailwind-merge"; export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }`,
  );
  writeFile(
    `${ROOT_PATH}/packages/ui/src/index.css`,
    `@tailwind base;\n@tailwind components;\n@tailwind utilities;`,
  );

  // Dynamically copy `custom` and `shared` directories into the UI package
  console.log(
    `\n📂 Migrating custom and shared folders into the UI package...`,
  );
  const targetCustomPath = path.join(
    ROOT_PATH,
    "packages/ui/src/components/custom",
  );
  copyFolderSync(path.join(process.cwd(), "custom"), targetCustomPath);

  const targetSharedPath = path.join(
    ROOT_PATH,
    "packages/ui/src/components/shared",
  );
  copyFolderSync(path.join(process.cwd(), "shared"), targetSharedPath);

  // API Services Package
  console.log(`\n📡 Setting up services package...`);
  writeFile(
    `${ROOT_PATH}/packages/services/package.json`,
    `{"name": "@company/services", "version": "0.0.0", "private": true, "exports": { ".": "./src/index.ts" }, "dependencies": {}}`,
  );
  writeFile(
    `${ROOT_PATH}/packages/services/tsconfig.json`,
    `{"compilerOptions": {"target": "es2016", "module": "commonjs", "esModuleInterop": true, "strict": true, "skipLibCheck": true}}`,
  );
  writeFile(
    `${ROOT_PATH}/packages/services/src/index.ts`,
    `export const fetchBaseUrl = () => import.meta.env.VITE_API_URL || "http://localhost:3000";\n`,
  );

  // 4. Create Apps via GitHub
  console.log(`\n💻 Dynamically creating applications...`);
  for (let index = 0; index < APPS.length; index++) {
    const appName = APPS[index];
    const appDir = `${ROOT_PATH}/apps/${appName}`;

    const appPackageContent = await fetchAndRenderTemplate(
      "app-package.json.hbs",
      { APP_NAME: appName, PORT: 5173 + index, APP_DEPS: appSharedDepsEntries },
    );
    writeFile(`${appDir}/package.json`, appPackageContent);

    const appTsxContent = await fetchAndRenderTemplate("App.tsx.hbs", {
      APP_NAME: appName,
    });
    writeFile(`${appDir}/src/App.tsx`, appTsxContent);

    writeFile(`${appDir}/.env`, `VITE_API_URL=http://localhost:3000\n`);
    writeFile(
      `${appDir}/.gitignore`,
      `node_modules\ndist\ndist-ssr\n*.local\n.env\n.env.*\n.DS_Store\n`,
    );
    writeFile(
      `${appDir}/README.md`,
      `# ${appName.toUpperCase()} App\n\nThis application was generated as part of the monorepo.\n`,
    );
    writeFile(
      `${appDir}/tsconfig.json`,
      `{ "compilerOptions": { "target": "ES2020", "useDefineForClassFields": true, "lib": ["ES2020", "DOM", "DOM.Iterable"], "module": "ESNext", "skipLibCheck": true, "moduleResolution": "bundler", "allowImportingTsExtensions": true, "resolveJsonModule": true, "isolatedModules": true, "noEmit": true, "jsx": "react-jsx", "strict": true, "noUnusedLocals": true, "noUnusedParameters": true, "noFallthroughCasesInSwitch": true, "ignoreDeprecations": "6.0", "baseUrl": ".", "paths": { "@/*": ["./src/*"] } }, "include": ["src"], "references": [{ "path": "./tsconfig.node.json" }] }`,
    );
    writeFile(
      `${appDir}/tsconfig.node.json`,
      `{ "compilerOptions": { "composite": true, "skipLibCheck": true, "module": "ESNext", "moduleResolution": "bundler", "allowImportingTsExtensions": true }, "include": ["vite.config.ts"] }`,
    );
    writeFile(
      `${appDir}/vite.config.ts`,
      `import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react'; import path from "path"; export default defineConfig({ plugins: [react()], resolve: { alias: { "@": path.resolve(__dirname, "./src") } }, server: { watch: { usePolling: true } } });`,
    );
    writeFile(
      `${appDir}/tailwind.config.ts`,
      `import type { Config } from "tailwindcss"; import { baseConfig } from "@company/config/tailwind/base"; export default { ...baseConfig, content: ["./index.html", "./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}", "../../packages/form-builder/src/**/*.{ts,tsx}"] } satisfies Config;`,
    );
    writeFile(
      `${appDir}/postcss.config.js`,
      `export default { plugins: { tailwindcss: {}, autoprefixer: {} } }`,
    );
    writeFile(
      `${appDir}/index.html`,
      `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${appName.toUpperCase()} App</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
    );
    writeFile(
      `${appDir}/src/index.css`,
      `@tailwind base; @tailwind components; @tailwind utilities; @layer base { :root { --background: 0 0% 100%; --foreground: 222.2 84% 4.9%; --primary: 222.2 47.4% 11.2%; --primary-foreground: 210 40% 98%; --border: 214.3 31.8% 91.4%; --input: 214.3 31.8% 91.4%; --ring: 222.2 84% 4.9%; --radius: 0.5rem; } * { @apply border-border; } body { @apply bg-background text-foreground; } }`,
    );
    writeFile(
      `${appDir}/src/components/index.ts`,
      `// Export your app-level components here\n`,
    );
    writeFile(
      `${appDir}/src/pages/Home.tsx`,
      `import React from 'react';\n\nexport default function Home() {\n  return <div className="p-4">Home Page</div>;\n}`,
    );
    writeFile(`${appDir}/src/store/index.ts`, `export * from '../store';\n`);
    writeFile(
      `${appDir}/src/store.ts`,
      `import { configureStore } from '@reduxjs/toolkit'; import { sharedAuthSlice, localStorageSyncMiddleware } from '@company/store'; export const store = configureStore({ reducer: { auth: sharedAuthSlice.reducer }, middleware: (getDefault) => getDefault().concat(localStorageSyncMiddleware) });`,
    );
    writeFile(
      `${appDir}/src/main.tsx`,
      `import React from 'react'; import ReactDOM from 'react-dom/client'; import { Provider } from 'react-redux'; import { store } from './store'; import App from './App'; import './index.css'; ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Provider store={store}><App /></Provider></React.StrictMode>);`,
    );
    writeFile(
      `${appDir}/src/form/createForm.ts`,
      `export const formSchema = [{ type: "input", inputType: "alpha-numeric", label: "Arrival Flight Number", name: "arrivalFlightNumber", placeholder: "Enter Arrival Flight Number (e.g. AI302)", required: true }];`,
    );
  }

  // 5. THE MASTER INSTALL
  console.log(`\n📦 Initializing workspace dependencies...`);
  runCmd("pnpm install", ROOT_PATH);

  // 6. Install Shadcn components
  console.log(`\n⚡ Downloading and installing shadcn components...`);
  const uiDir = path.join(ROOT_PATH, "packages", "ui");
  try {
    runCmd(
      `npx --yes shadcn@latest add ${SHADCN_COMPONENTS.join(" ")} -y`,
      uiDir,
    );
  } catch (err) {
    console.log(
      `\n⚠️ The shadcn CLI threw a warning... moving to verification.`,
    );
  }

  console.log(`\n🔗 Exporting downloaded components from UI package...`);
  let uiIndexContent = `export * from "./lib/utils";\n`;

  // Read and export exact files from custom directory
  if (fs.existsSync(targetCustomPath)) {
    fs.readdirSync(targetCustomPath).forEach((file) => {
      if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        const fileName = file.replace(/\.tsx?$/, "");
        if (fileName !== "index")
          uiIndexContent += `export * from "./components/custom/${fileName}";\n`;
      }
    });
  }

  // Read and export exact files from shared directory
  if (fs.existsSync(targetSharedPath)) {
    fs.readdirSync(targetSharedPath).forEach((file) => {
      if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        const fileName = file.replace(/\.tsx?$/, "");
        if (fileName !== "index")
          uiIndexContent += `export * from "./components/shared/${fileName}";\n`;
      }
    });
  }

  // Export shadcn
  SHADCN_COMPONENTS.forEach((component) => {
    if (fs.existsSync(path.join(uiDir, `src/components/ui/${component}.tsx`))) {
      uiIndexContent += `export * from "./components/ui/${component}";\n`;
    }
  });
  writeFile(`${ROOT_PATH}/packages/ui/src/index.ts`, uiIndexContent);

  // 7. Types & Format
  console.log(`\n🔵 Installing global React types for the workspace...`);
  runCmd(
    "pnpm add -wD @types/react@^18.2.66 @types/react-dom@^18.2.22",
    ROOT_PATH,
  );

  console.log(`\n📦 Syncing final monorepo workspace dependencies...`);
  runCmd("pnpm install", ROOT_PATH);

  console.log(`\n🧹 Running Prettier to format all generated files...`);
  try {
    runCmd(`npx prettier --write "**/*.{ts,tsx,json,js,html,css}"`, ROOT_PATH);
  } catch (err) {
    console.log(`\n⚠️ Prettier skipped.`);
  }

  // 9. FINAL NOTIFICATION LOG
  console.log(`
🎉 Monorepo successfully bootstrapped!
===================================================
📢 NOTIFICATION OF ARCHITECTURAL UPDATES:
✅ Added .env, .gitignore, and README.md files to all apps.
✅ Generated internal src/ folders (components, form, pages, store) in all apps.
✅ Initialized @company/services for API logic in the packages directory.
✅ Dynamically copied all files from root 'custom/' into @company/ui/src/components/custom/.
✅ Dynamically copied all files from root 'shared/' into @company/ui/src/components/shared/.
✅ Fetched templates dynamically from GitHub.

⚠️ MANUAL COMPONENT UPDATE REQUIRED:
Please ensure your InputGroupInput component is updated with the following syntax for update error reflection:

export const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      ref={ref}   // ← must reach the real <input>
      {...props}
    />
  );
});

InputGroupInput.displayName = "InputGroupInput";



const InputGroupInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        data-slot="input-group-control"
        ref={ref}
        className={cn(
          "py-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent",
          className
        )}
        {...props}
      />
    )
  }
)

InputGroupInput.displayName = "InputGroupInput";
===================================================

🚀 Next Steps:
-------------
1️⃣ cd mono-repo-output
2️⃣ pnpm dev
`);
}

bootstrap().catch((err) => {
  console.error("❌ A fatal error occurred during setup:");
  console.error(err);
});

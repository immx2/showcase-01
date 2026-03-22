import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const nuxi = resolve(projectRoot, "node_modules/@nuxt/cli/bin/nuxi.mjs");
const cmd = process.argv[2] ?? "dev";
const extraArgs = process.argv.slice(3);

const child = spawn(process.execPath, [nuxi, cmd, ...extraArgs], {
  stdio: "inherit",
  windowsHide: true,
  cwd: projectRoot,
});

child.on("exit", (code) => process.exit(code ?? 0));

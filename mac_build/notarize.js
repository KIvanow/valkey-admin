/* eslint-disable @typescript-eslint/no-require-imports */
const { notarize } = require("electron-notarize");

function isEnvFilePresent() {
  const result = require("dotenv").config({ path: "./mac_build/.env", debug: true });
  if (result.error?.code === "ENOENT") {
    console.log("  • ⚠️ No mac_build/.env detected. Skipping notarization step.");
    return false;
  }

  return true;
}


exports.default = async function notarizing(context) {
  if (!isEnvFilePresent()) {
    return;
  }

  if (process.env.SKIP_NOTARIZE === "true") {
    console.log("  • ⚠️ SKIP_NOTARIZE=true detected. Skipping notarization step.");
    return;
  }

  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== "darwin") {
    return
  }

  const appName = context.packager.appInfo.productFilename

  return await notarize({
    tool: "notarytool",
    teamId: process.env.APPLE_TEAM_ID,
    appBundleId: "com.valkey.glide",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_APP_SPECIFIC_PASSWORD,
  })
}

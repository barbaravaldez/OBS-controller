import OBSWebSocket from "obs-websocket-js";
import { configDotenv } from "dotenv";

const obs = new OBSWebSocket();
configDotenv();

(async () => {
  try {
    const url = process.env.WS_URL;
    const wsSecret = process.env.WS_SECRET;
    await obs.connect(url, wsSecret);
    console.log("Connected to OBS");

    // Example: Get current scene
    const { currentProgramSceneName } = await obs.call(
      "GetCurrentProgramScene"
    );
    console.log(`Current Scene: ${currentProgramSceneName}`);

    // Example: Switch scene
    // await obs.call('SetCurrentProgramScene', { sceneName: 'Scene 2' });

    // Listen for scene changes
    obs.on("CurrentProgramSceneChanged", (data) => {
      console.log(`Scene changed to: ${data.sceneName}`);
      // You can communicate this to your app via WebSockets
    });
  } catch (error) {
    console.error("Failed to connect OBS:", error.code, error.message);
  }
})();

export { obs };

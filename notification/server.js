import app from "./src/app.js";
import config from "./src/config/config.js";
import { connectRabbit } from "./src/broker/Rabbit.js";
import startListeners from "./src/broker/listner.js";

const start = async () => {
  await connectRabbit();   // ONLY ONCE
  startListeners();        // ONLY ONCE

  const PORT = config.PORT || 4001;

  app.listen(PORT, () => {
    console.log(`🔥 Notification running on ${PORT}`);
  });
};

start();

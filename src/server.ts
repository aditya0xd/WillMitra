import { app } from "@app.js";
import { env } from "@env.js";

const { PORT } = env;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

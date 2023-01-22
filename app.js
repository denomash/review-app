const express = require("express");
require("./db");
const userRouuter = require("./routes/user");

const PORT = 8000;
const app = express();
app.use(express.json());

app.use("/api/user", userRouuter);

app.listen(PORT, () => console.log(`App is running on localhost:${PORT}`));

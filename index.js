const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

const QRCode = require("qrcode");
const { PassThrough } = require("stream");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/qr", async (req, res, next) => {
  try {
    const { size, data } = req.query;
    const sizeSplit = size.split("x");
    const qrStream = new PassThrough();
    const result = await QRCode.toFileStream(qrStream, data, {
      type: "png",
      margin: 1,
      height: sizeSplit[0],
      width: sizeSplit[1],
      errorCorrectionLevel: "H",
    });

    qrStream.pipe(res);
  } catch (err) {
    console.error("Failed to return content", err);
  }
});

server.listen(port, () => {
  console.log("listening on *:" + port);
});

process.on("SIGINT", () => {
  server.close(() => console.log("process terminated ..."));
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close(() => console.log("process terminated ..."));
  process.exit(0);
});

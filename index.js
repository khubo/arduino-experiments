const sleep = require("await-sleep");
var five = require("johnny-five"),
  board = new five.Board(),
  led = null,
  express = require("express"),
  app = express(),
  port = 8000;

let boardInitialized = false;
let dirPin;
let stepPin;

board.on("ready", async function () {
  console.log("### Board ready!");
  //   led = new five.Led(13);
  dirPin = new five.Pin(2);
  stepPin = new five.Pin(3);
  boardInitialized = true;
});

async function rotate(clockwise = true) {
  clockwise ? dirPin.high() : dirPin.low();

  for (let i = 0; i < 400; i++) {
    stepPin.high();
    await sleep(0.00001);
    stepPin.low();
  }
}

app.get("/:mode", async function (req, res) {
  try {
    // board is not initialized
    if (!boardInitialized) {
      res.statusCode = 300;
      return res.json({
        message: "board unInitialized",
      });
    }
    const { mode } = req.params;

    if (mode == "cw") {
      console.log("rotating clockwise");
      rotate(true).then();
    } else if (mode == "ccw") {
      console.log("roting counter clockwise");
      rotate(false).then();
    } else {
      res.statusCode = 400;
      return res.json({
        message: "invalid shite",
      });
    }

    return res.json({
      message: `rotating ${mode}`,
    });
  } catch (e) {
    console.log("erorr", e);
    res.status = 400;
    res.json({
      message: e,
    });
  }
});

app.listen(port, function () {
  console.log("Listening on port " + port);
});

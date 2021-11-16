import React from "react";
import "../App.scss";
import { useEffect, useState } from "react";

var MESSAGES = [
  "@spaceace",
  "@rob",
  "@drno",
  "i'm a webmaster",
  "all hail jumpstartbot",
  "now with more qubits",
  "doom is eternal",
  "mom i'm nonbinary",
  "beam me up, scotty",
  "live long and prosper",
  "computer sussy house",
  "be gay do crimes",
  "don't let your memes be dreams",
  "don't let your dreams be memes",
  "based",
  "cringe",
  "i sell kids to drugs",
  "siri call me steven pussydestroyer green",
];
var MESSAGE_CHANCE = 0.01;

function generateBinary() {
  var num_chars = Math.round(
    (window.innerWidth / 19.6) * (window.innerHeight / 29)
  );

  var raw_binary = [];
  var current_message = [];
  for (var i = 0; i <= num_chars; i++) {
    if (Math.random() > 1 - MESSAGE_CHANCE && current_message.length == 0) {
      current_message =
        MESSAGES[Math.floor(Math.random() * MESSAGES.length)].split("");
    }
    if (current_message.length > 0) {
      raw_binary.push(
        <span className="item" key={Math.random()}>
          {current_message[0] + ""}
        </span>
      );
      current_message = current_message.slice(1);
    } else {
      raw_binary.push(
        <span className="item" key={Math.random()}>
          {Math.round(Math.random()).toString()}
        </span>
      );
    }
  }
  return raw_binary;
}

export function BinaryBackground() {
  const [binary, setBinary] = useState(generateBinary());

  useEffect(function () {
    var binInterval = setInterval(() => setBinary(generateBinary()), 5000);
    return () => clearInterval(binInterval);
  }, []);

  return <div className="binary-background">{binary}</div>;
}

export default BinaryBackground;

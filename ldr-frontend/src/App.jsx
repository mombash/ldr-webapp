import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER_URL = "ws://broker.emqx.io:8083/mqtt"; // Replace with your broker URL
const MQTT_TOPIC = "bashsensor"; // Replace with your topic

const IlluminanceDisplay = () => {
  const [illuminance, setIlluminance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to the MQTT broker
    const client = mqtt.connect(MQTT_BROKER_URL);

    // Handle connection
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setIsConnected(true);

      // Subscribe to the topic
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error("Failed to subscribe to topic:", MQTT_TOPIC);
        }
      });
    });

    // Handle incoming messages
    client.on("message", (topic, message) => {
      if (topic === MQTT_TOPIC) {
        try {
          // Convert the message to a number
          const illuminanceValue = Number(message.toString());
          setIlluminance(illuminanceValue);
        } catch (error) {
          console.error("Failed to convert message to number:", message.toString());
        }
      }
    });

    // Handle disconnection
    client.on("close", () => {
      console.log("Disconnected from MQTT broker");
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      client.end();
    };
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", margin: "50px" }}>
      <h1>Illuminance Monitor</h1>
      <div style={{ margin: "20px", fontSize: "1.2em", color: isConnected ? "green" : "red" }}>
        {isConnected ? "Connected to MQTT Broker" : "Disconnected"}
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          background: "#f9f9f9",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ margin: "0", color: "#333" }}>
          Current Illuminance:
        </h2>
        <p
          style={{
            fontSize: "2em",
            fontWeight: "bold",
            color: illuminance ? "#007bff" : "#999",
          }}
        >
          {illuminance !== null ? `${illuminance} lux` : "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default IlluminanceDisplay;

const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");
const fs = require("fs");

const updateFileData = (newData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("Currencies.json", JSON.stringify(newData), "utf8", (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const getFileData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("Currencies.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const cleanedData = data.replace(/[\r\n]/g, "");
        console.log(cleanedData);

        resolve(cleanedData);
      }
    });
  });
};

app.get("/update", async (req, res) => {
  try {
    let resp = await axios.get(
      "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=508110c9722e4cb7a270c4cdc1c79d5b"
    );
    updateFileData(resp.data);
  } catch (error) {
    console.log(error);
  }
});

app.get("/", async (req, res) => {
  try {
    const data = await getFileData();
    const sanitizedData = data.replace(/[^\x20-\x7E]/g, "");
    res.send({
      currencies: sanitizedData,
    });
  } catch (err) {
    res.status(500).send("Error retrieving file data");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

import express from "express";
import awsIott from "aws-iot-device-sdk";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";
import {
  DynamoDBDocumentClient,
  DynamoDBDocument,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
("use strict");
var dist = [];
async function fetchDistricts() {
  const response = await fetch(
    "https://raw.githubusercontent.com/hmpandey/All-Indian-States-With-Districts-JSON-List/master/list.json"
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  data.states.map((ele) => {
    dist = dist.concat(ele["districts"]);
  });
  dist.sort();
}
fetchDistricts();
app.post("/get-dist", async (req, res) => {
  var to_send = [];
  dist.map((names) => {
    names.toLowerCase().includes(req.body.dis_name.toLowerCase())
      ? to_send.push(names)
      : null;
  });
  res.send(to_send);
});
app.post("/get-cities", async (req, res) => {
  (async () => {
    const where = encodeURIComponent(
      JSON.stringify({
        ascii_name: {
          $regex: req.body.name,
          $options: "i",
        },
      })
    );
    const response = await fetch(
      `https://parseapi.back4app.com/classes/Indiacities_india_cities_database?order=ascii_name&keys=&where=${where}`,
      {
        headers: {
          "X-Parse-Application-Id": "ZjF4GOMwMTmz24BxZnzd8p2IeOrOuLnnkhjDaAnN", // This is your app's application id
          "X-Parse-REST-API-Key": "HN9HS8RQBjMJRHWNbyC67aOlSNHgAhgKmdwu5b4z", // This is your app's REST API key
        },
      }
    );
    const data = await response.json(); // Here you have the data that you need
    res.send(JSON.stringify(data, null, 2));
  })();
});

const my_AWSAccessKeyId = "AKIA3FLD2QUFYQBOIELT";
const my_AWSSecretKey = "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";
const aws_region = "ap-south-1";
const empTable1 = "ESP32_dbB";
const empTable2 = "Login_table";
const empTable3 = "Data_table";

var dynamoDB = DynamoDBDocument.from(
  new DynamoDB({
    region: aws_region,
    credentials: {
      accessKeyId: my_AWSAccessKeyId,
      secretAccessKey: my_AWSSecretKey,
    },
  })
);
async function fetchDatafromDatabase2(ele) {
  // get method fetch data from dynamodb
  var id = ele;
  var params = {
    TableName: empTable1,
    Key: {
      uniqueId: id,
    },
  };
  const rsp = await DynamoDBDocumentClient.from(dynamoDB).send(
    new GetCommand(params)
  );
  return [rsp["Item"]];
}
var result = [];
async function fetchDatafromDatabase3(ele) {
  // get method fetch data from dynamodb
  var id = ele;
  var params = {
    TableName: empTable2,
    Key: {
      username: id,
    },
  };
  const rsp = await DynamoDBDocumentClient.from(dynamoDB).send(
    new GetCommand(params)
  );
  return [rsp["Item"]];
}
app.post("/login", async (req, res) => {
  var result = [];
  if (req.body.flag == "admin") {
    result = await fetchDatafromDatabase3(req.body.userinput.username);
    if (result[0]) {
      if (result[0].password == req.body.userinput.password) {
        if (
          (req.body.flag == "admin" && result[0].admin_flag == "Admin1") ||
          (req.body.flag == "client" && !result[0].admin_flag)
        ) {
          res.send("success");
        }
      }
    }
  } else {
    result = await fetchDatafromDatabase3(req.body.clientinput.username);
    if (result[0]) {
      if (result[0].password == req.body.clientinput.password) {
        if (
          (req.body.flag == "admin" && result[0].admin_flag == "Admin1") ||
          (req.body.flag == "client" && !result[0].admin_flag)
        ) {
          res.send({ Name: result[0].name });
        }
      }
    }
  }
});
const port = 3001;
app.post("/add-data", async (req, res) => {
  var dynamoDB = DynamoDBDocument.from(
    new DynamoDB({
      region: aws_region,
      credentials: {
        accessKeyId: my_AWSAccessKeyId,
        secretAccessKey: my_AWSSecretKey,
      },
    })
  );
  const command = new PutCommand( {
    TableName: empTable3,
    Item: {
      uniqueId:req.body.macAddress,
      client_select:req.body.client,
      "district-select":req.body.district,
      "location-select":req.body.location,
      "city-select":req.body.city,
    },
  });

  const response = await dynamoDB.send(command);
});
app.post("/get-name", async (req, res) => {
  var params = {
    TableName: empTable2,
    Key: {
      username: req.body.username,
      // password:req.body.password,
    },
  };
  const rsp = await DynamoDBDocumentClient.from(dynamoDB).send(
    new GetCommand(params)
  );
  if(rsp["Item"]){
  if (
    rsp["Item"]["password"] == req.body.password &&
    !rsp["Item"]["admin_flag"]
  ) {
    res.send({ name: rsp["Item"]["name"], flag: "client" });
  } else {
    res.send({ flag: "admin" });
  }
}
else{
  res.send("Invalid")
}
});

app.get("/client-select", async function (req, res) {
  var params = {
    TableName: empTable3,
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      var ans = [];
      data.Items.forEach((item) => {
        ans.push(item["client_select"]);
      });
      ans = new Set(ans);
      res.send(Array.from(ans));
    }
  });
});
app.post("/devicecheck", function (req, res) {
  var params = {
    TableName: empTable3,
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      var ans = [];
      ans=data.Items.filter((item) => {
        return item["uniqueId"] == req.body.id;
      });
      if (ans.length != 0) {
        res.send(ans[0]);
      } else {
        res.send("Ok");
      }
    }
  });
});
app.post("/device-select", async function (req, res) {
  var params = {
    TableName: empTable3,
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      var ans = [];
      data.Items.forEach((item) => {
        if (
          (!req.body.cs ||
            (req.body.cs && req.body.cs == item["client_select"])) &&
          (!req.body.ds ||
            (req.body.ds && req.body.ds == item["district-select"])) &&
          (!req.body.cis ||
            (req.body.cis && req.body.cis == item["city-select"])) &&
          (!req.body.ls ||
            (req.body.ls && req.body.ls == item["location-select"]))
        ) {
          ans.push(item);
        }
      });
      ans = new Set(ans);
      res.send(Array.from(ans));
    }
  });
});
app.post("/find", async function (req, res) {
  var result = [];
  if (req.body.id_view) {
    result = await fetchDatafromDatabase2(req.body.id_view);
  }
  var r = [];
  for (var i in result) {
    r.push(result[i]);
  }
  res.send(r);
});
app.get("/district-select", function (req, res) {
  var params = {
    TableName: empTable3,
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      var ans = [];
      data.Items.forEach((item) => {
        ans.push(item["district-select"]);
      });
      ans = new Set(ans);
      res.send(Array.from(ans));
    }
  });
});
app.get("/city-select", function (req, res) {
  var params = {
    TableName: empTable3,
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      var ans = [];
      data.Items.forEach((item) => {
        ans.push(item["city-select"]);
      });
      ans = new Set(ans);
      res.send(Array.from(ans));
    }
  });
});
app.get("/location-select", function (req, res) {
  var params = {
    TableName: empTable3,
  };
  dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      var ans = [];
      data.Items.forEach((item) => {
        ans.push(item["location-select"]);
      });
      ans = new Set(ans);
      res.send(Array.from(ans));
    }
  });
});

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT.
// NOTE: client identifiers must be unique within your AWS account; if a client attempts
// to connect with a client identifier which is already in use, the existing
// connection will be terminated.
//
function callit(st,id) {
  var device = awsIott.device({
    keyPath:
      "./26edecfaba64765dfcee9bc2e3cedec03e4907156101b3b9217b0cc2bb434356-private.pem.key",
    certPath:
      "./26edecfaba64765dfcee9bc2e3cedec03e4907156101b3b9217b0cc2bb434356-certificate.pem.crt",
    caPath: "./AmazonRootCA1.pem",
    clientId: "iotconsole-942f23fd-3798-41ef-8070-18a9318be6c8",
    host: "a2jkrhdo8xxwzo-ats.iot.ap-south-1.amazonaws.com",
  });

  //
  // Device is an instance returned by mqtt.Client(), see mqtt.js for full
  // documentation.
  //
  device.on("connect", function () {
    console.log("connect");
    //     device.subscribe('ESP32/sub');
    device.publish("curtain1/sub", JSON.stringify({ status: st , uniqueId:id,enum:"status"}));
    // device.end();
  });

  device.on("message", function (topic, payload) {
    console.log("message", topic, payload.toString());
  });

  device.on("close", function () {
    device.end();
  });
}
function callit2(st,id) {
  var device = awsIott.device({
    keyPath:
      "./fde74993affdc235ed78f7a28ffdec437b3c31c63df8dbd80680956a5f878b57-private.pem.key",
    certPath:
      "./fde74993affdc235ed78f7a28ffdec437b3c31c63df8dbd80680956a5f878b57-certificate.pem.crt",
    caPath: "./AmazonRootCA1.pem",
    clientId: "iotconsole-942f23fd-3798-41ef-8070-18a9318be6c8",
    host: "a2jkrhdo8xxwzo-ats.iot.ap-south-1.amazonaws.com",
  });

  //
  // Device is an instance returned by mqtt.Client(), see mqtt.js for full
  // documentation.
  //
  device.on("connect", function () {
    console.log("connect");
    //     device.subscribe('ESP32/sub');
    device.publish("curtain1/sub", JSON.stringify({ check: st,enum:"check",uniqueId:id }));
    // device.end();
  });

  device.on("message", function (topic, payload) {
    console.log("message", topic, payload.toString());
  });

  device.on("close", function () {
    device.end();
  });
}
app.post("/change", (req, res) => {
  callit(req.body.st,req.body.id);
  
});
app.post("/checki",async(req,res)=>{
  await callit2(1,req.body.id);
  console.log(req.body.id);
  var id = req.body.id;
  var params = {
    TableName: empTable1,
    Key: {
      uniqueId: id,
    },
  };
  const rsp = await DynamoDBDocumentClient.from(dynamoDB).send(
    new GetCommand(params)
  );
  if(rsp["Item"].DST==1){
    res.send("ON");
    const command = new PutCommand( {
      TableName: empTable1,
      Item: {
        uniqueId:rsp["Item"].uniqueId,
        Indoor_Temp:rsp["Item"].Indoor_Temp,
        Power:rsp["Item"].Power,
        DST:0,
        Outdoor_Temp:rsp["Item"].Outdoor_Temp,
      },
    });
  
    const response = await dynamoDB.send(command);
    // console.log(response);
  }
  else{
    res.send("OFF");
    await callit2(0,req.body.id);
  }
})
app.post("/add-client", async (req, res) => {
  console.log(1);
  var dynamoDB = DynamoDBDocument.from(
    new DynamoDB({
      region: aws_region,
      credentials: {
        accessKeyId: my_AWSAccessKeyId,
        secretAccessKey: my_AWSSecretKey,
      },
    })
  );
  const command = new PutCommand( {
    TableName: empTable2,
    Item: {
      username:req.body.username,
      password:req.body.password,
      name:req.body.Name,
    },
  });

  const response = await dynamoDB.send(command);
  res.send("ok")
});
app.post("/delete-client",async(req,res)=>{
  const command = new DeleteCommand( {
    TableName: empTable2,
    Key: {
      username:req.body.username,
    },
  });

  const response = await dynamoDB.send(command);
  res.send("ok")
})
app.post("/delete-device",async(req,res)=>{
  const params={
    TableName:empTable3,
  }
  var ans=[];
  await dynamoDB.scan(params, (err, data) => {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      ans=data.Items.filter((item) => {
        return(item["uniqueId"]==req.body.id);
      });
      if(ans[0]){
      const command = new DeleteCommand( {
        TableName: empTable3,
        Key: {
          uniqueId:req.body.id,
          client_select:ans[0]["client_select"],
        },
      });
      const response = dynamoDB.send(command);
      res.send("ok")
    }
    }
  });
})
// Function to describe a Thing and check its connectivity status
app.listen(port, () => {
  console.log("listening on port");
});

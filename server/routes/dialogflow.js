const express = require("express");
const router = express.Router();
const structjson = require("./structjson.js");
const dialogflow = require("dialogflow");
const uuid = require("uuid");

const config = require("../config/keys");

// /config/dev.js에 저장되어 있는 변수 사용
const projectId = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

// 새로운 세션 생성
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// npm dailogflow 샘플 코드 참고
//https://www.npmjs.com/package/dialogflow
// 메시지 입력 라우터
router.post("/textQuery", async (req, res) => {
  // Dialogflow API에서 가져온 데이터에 입력 받은 데이터를 추가한 뒤 response로 응답한다.
  // 받은 텍스트를 추가하여 다음과 같은 형태로 만든다.
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // Dialogflow 에 보낼 메시지
        text: req.body.text,
        languageCode: languageCode,
      },
    },
  };

  // 클라이언트에서 전달받은 데이터를 DialogFlow를 거친 보낸다.
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);

  res.send(result);
});

//Event Query 라우터

router.post("/eventQuery", async (req, res) => {
  //Dialogflow API에서 가져온 데이터에 입력 받은 이벤트를 추가한 뒤 response로 응답한다.
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        name: req.body.event,
        languageCode: languageCode,
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log("Detected intent");
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);

  res.send(result);
});

module.exports = router;

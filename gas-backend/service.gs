function doPost(e) {
  const rqData = JSON.parse(e.postData.contents);
  if (rqData.type === "message-board") {
    const messageBoard = sites[rqData.type];
    messageBoard.appendRow([rqData.message, rqData.timestamp, rqData.token]);
    const messages = [...getMessageByToken(rqData.token)];
    return ContentService.createTextOutput(
      JSON.stringify({ data: messages })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  const site = sites[rqData.level];
  if (rqData.pass) {
    return ContentService.createTextOutput(
      JSON.stringify({
        flag: site.getDataRange().getValues()[0][0],
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const searchParams = e.parameter;
  if (searchParams.type === "message-board") {
    const messageBoard = sites[searchParams.type];
    if (!messageBoard) return;
    const resData = [...getMessageByToken(searchParams.token)];
    const token = Utilities.newBlob(
      Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        `Elden Ring ${new Date().getTime()} You-Get-It`
      )
    ).getDataAsString();
    return ContentService.createTextOutput(
      JSON.stringify({ data: resData, token: token })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  if (searchParams.level === "w04") {
    const w04 = sites[searchParams.level];
    return ContentService.createTextOutput(
      JSON.stringify({ flag: w04.getDataRange().getValues()[0][0] })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function getMessageByToken(token) {
  messageBoard = sites["message-board"];
  const md = messageBoard.getDataRange().getValues();
  const messages = [];
  for (let i = 1; i < md.length; i++) {
    if (md[i][2] !== "" && token !== md[i][2]) continue;
    messages.push({
      message: md[i][0],
      timestamp: md[i][1],
    });
  }
  return messages;
}

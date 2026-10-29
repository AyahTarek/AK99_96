// Sheet columns (row 1 = header): key | name | status | updatedAt
// key = per-device id sent by the site. Counts: =COUNTIF(C:C,"yes") and =COUNTIF(C:C,"no")

function keyOf_(id) {
  const s = String(id || "");
  return /^[\w-]{8,64}$/.test(s) ? s : "";
}

function findRow_(sheet, key) {
  const keys = sheet
    .getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1)
    .getValues();
  for (let i = 0; i < keys.length; i++) {
    if (String(keys[i][0]) === key) return i + 2;
  }
  return -1;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const key = keyOf_(e.parameter && e.parameter.d);
  if (!key) return json_({ ok: false });
  const row = findRow_(sheet, key);
  const status = row < 0 ? null : sheet.getRange(row, 3).getValue() || null;
  return json_({ ok: true, status: status });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const key = keyOf_(body.id);
    const name = String(body.name || "")
      .trim()
      .slice(0, 60);
    if (!key || !name || (body.status !== "yes" && body.status !== "no")) {
      return json_({ ok: false });
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const row = findRow_(sheet, key);
    // Leading ' stops a name like "=..." from being run as a formula.
    const values = [key, "'" + name, body.status, new Date()];
    if (row < 0) sheet.appendRow(values);
    else sheet.getRange(row, 1, 1, 4).setValues([values]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

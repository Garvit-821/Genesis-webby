/**
 * Genesis Hacks - form submissions -> Google Sheets.
 *
 * Each website form gets its own tab, created automatically on first
 * submission (or all at once by running setup()). Every tab ends with
 * "Status" and "Notes" columns for the team to fill in.
 */

var TIMEZONE = "Asia/Kolkata";

// formType sent by the website -> tab name and columns.
// Each column is [header, ...payload keys to read, first non-empty wins].
var FORMS = {
  contact: {
    tab: "Contact",
    columns: [
      ["Name", "name"],
      ["Email", "email"],
      ["Reaching out as", "role"],
      ["Message", "message"]
    ]
  },
  work_with_us: {
    tab: "Work With Us",
    columns: [
      ["Name", "name"],
      ["Email", "email"],
      ["Phone", "phone"],
      ["Domain", "role"],
      ["Experience", "experience"],
      ["Portfolio / Link", "portfolio"],
      ["Why Genesis", "message"]
    ]
  },
  partner: {
    tab: "Partner",
    attachment: true,
    columns: [
      ["Name", "name"],
      ["Email", "email"],
      ["Phone", "phone"],
      ["Company / College", "organization"],
      ["Partnership type", "partnershipType"],
      ["Website", "website"],
      ["Details", "proposal"]
    ]
  },
  collaborate: {
    tab: "Collaborate",
    columns: [
      ["Name", "name"],
      ["Email", "email"],
      ["Phone", "phone"],
      ["Organization / Event", "organization"],
      ["Collaboration type", "partnershipType"],
      ["Website", "website"],
      ["Details", "proposal"]
    ]
  }
};

// Older builds of the site sent this before Partner and Collaborate were split.
var ALIASES = { partner_collaborate: "partner" };

var FOLLOW_UP = ["Status", "Notes"];

// Uploaded brochures / pitch decks are saved in this Drive folder (created on first upload).
var UPLOAD_FOLDER = "Genesis Form Uploads";
var MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
var UPLOAD_TYPES = {
  pdf: "application/pdf",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
};

function getSheet_(config) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(config.tab);
  if (sheet) return sheet;

  sheet = ss.insertSheet(config.tab);
  var headers = ["Timestamp"]
    .concat(config.columns.map(function (c) { return c[0]; }))
    .concat(config.attachment ? ["Attachment"] : [])
    .concat(FOLLOW_UP);
  var range = sheet.getRange(1, 1, 1, headers.length);
  range.setValues([headers]);
  range.setFontWeight("bold").setBackground("#4c1d95").setFontColor("#ffffff");
  sheet.setFrozenRows(1);
  return sheet;
}

/** Run once from the editor to create every tab up front. */
function setup() {
  Object.keys(FORMS).forEach(function (key) { getSheet_(FORMS[key]); });
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var blank = ss.getSheetByName("Sheet1");
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) {
    ss.deleteSheet(blank);
  }
}

function pick_(data, keys) {
  for (var i = 0; i < keys.length; i++) {
    var value = data[keys[i]];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      var text = String(value).trim();
      // Stop submitted text from being evaluated as a sheet formula.
      return /^[=+\-@]/.test(text) ? "'" + text : text;
    }
  }
  return "";
}

/** Saves an uploaded file to Drive and returns its link, or "" if there is none. */
function saveUpload_(data) {
  if (!data.attachmentData || !data.attachmentName) return "";

  var extension = String(data.attachmentName).split(".").pop().toLowerCase();
  var mimeType = UPLOAD_TYPES[extension];
  if (!mimeType) return "Rejected: unsupported file type";

  var bytes = Utilities.base64Decode(data.attachmentData);
  if (bytes.length > MAX_UPLOAD_BYTES) return "Rejected: file too large";

  var folders = DriveApp.getFoldersByName(UPLOAD_FOLDER);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(UPLOAD_FOLDER);

  var safeName = String(data.attachmentName).replace(/[^\w.\- ]/g, "_");
  var stamp = Utilities.formatDate(new Date(), TIMEZONE, "yyyyMMdd-HHmmss");
  var file = folder.createFile(Utilities.newBlob(bytes, mimeType, stamp + " " + safeName));
  return file.getUrl();
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Open the web app URL in a browser to confirm it is live. */
function doGet() {
  return json_({ result: "ok", forms: Object.keys(FORMS) });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    var formType = String(data.formType || "contact");
    formType = ALIASES[formType] || formType;
    var config = FORMS[formType] || FORMS.contact;

    var row = [Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss")]
      .concat(config.columns.map(function (c) { return pick_(data, c.slice(1)); }))
      .concat(config.attachment ? [saveUpload_(data)] : [])
      .concat(FOLLOW_UP.map(function (h) { return h === "Status" ? "New" : ""; }));

    var sheet = getSheet_(config);
    sheet.appendRow(row);

    return json_({ result: "success", tab: config.tab, row: sheet.getLastRow() });
  } catch (error) {
    return json_({ result: "error", error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

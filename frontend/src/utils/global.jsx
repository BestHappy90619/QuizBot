export const BASE_URL = "http://localhost:5000";

export const MSG_BY_USER = 0;

export const MSG_BY_BOT = 1;

export const DEBUG_MODE = false;

export const ADMIN_ROLE = 1;

export const USER_ROLE = 0;

export const ALLOWED_IMG_TYPES = [
  {
    type: "image/png",
    extension: ".png",
  },
];

export const ALLOWED_DOC_TYPES = [
  {
    type: "application/pdf",
    extension: ".pdf",
  },
  {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extension: ".docx",
  },
  {
    type: "text/plain",
    extension: ".txt",
  },
];

export const parseURLParams = (url) => {
  var queryStart = url.indexOf("?") + 1,
    queryEnd = url.indexOf("#") + 1 || url.length + 1,
    query = url.slice(queryStart, queryEnd - 1),
    pairs = query.replace(/\+/g, " ").split("&"),
    parms = {},
    i,
    n,
    v,
    nv;

  if (query === url || query === "") return;

  for (i = 0; i < pairs.length; i++) {
    nv = pairs[i].split("=", 2);
    n = decodeURIComponent(nv[0]);
    v = decodeURIComponent(nv[1]);

    if (!parms.hasOwnProperty(n)) parms[n] = [];
    parms[n].push(nv.length === 2 ? v : null);
  }
  return parms;
};

export const isAllowedFile = (allowedTypes, files) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileType = file.type;
    const fileExtension = "." + file.name.split(".").pop();

    let validFlag = false;
    for (let j = 0; j < allowedTypes.length; j++) {
      let allowedType = allowedTypes[j];
      if (
        fileType === allowedType.type ||
        fileExtension === allowedType.extension
      ) {
        validFlag = true;
        break;
      }
    }

    if (!validFlag) return false;
  }
  return true;
};

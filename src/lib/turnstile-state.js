const BLOCKING_ERROR_PREFIXES = [
  "110100",
  "110110",
  "110200",
  "400020",
  "400070"
];

function startsWithAny(value, prefixes) {
  return prefixes.some(function(prefix) {
    return value.indexOf(prefix) === 0;
  });
}

export function describeTurnstileError(errorCode, hostname) {
  const code = String(errorCode || "");
  const currentHostname = String(hostname || "");

  if (code.indexOf("110200") === 0) {
    return {
      blocking: true,
      message: currentHostname
        ? "The security check is not authorized for " + currentHostname + "."
        : "The security check is not authorized for this address."
    };
  }

  if (startsWithAny(code, BLOCKING_ERROR_PREFIXES)) {
    return {
      blocking: true,
      message: "The security check is unavailable because its site configuration is invalid."
    };
  }

  if (code.indexOf("200500") === 0) {
    return {
      blocking: false,
      message: "The security check could not load. Disable content blocking for this page, then refresh."
    };
  }

  return {
    blocking: false,
    message: "The security check failed. Refresh the page and try again."
  };
}

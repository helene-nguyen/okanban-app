const deployPath = "/okanban-app"

function deleteCookie(name) {
  document.cookie = name + `=; Path=${deployPath}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export { deleteCookie };
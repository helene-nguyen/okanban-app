    //! TOKEN
    function getCookie(cookieName) {
        let cookie = {};
        document.cookie.split(';').forEach(function(element) {
          let [key,value] = element.split('=');
          cookie[key.trim()] = value;
        })
        return cookie[cookieName];
}
      
export { getCookie };
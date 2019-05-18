var xsrfCookie = postman.getResponseCookie("csrftoken");
postman.setEnvironmentVariable('csrftoken', xsrfCookie.value);
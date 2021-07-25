var http = require("http");
var fs = require("fs");
var url = require("url");

function templateHTML(title, list, des) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${des}
  </body>
  </html>
`;
}

function templateList(fileList) {
  var list = "<ul>";
  var i = 0;
  while (i < fileList.length) {
    list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
    i++;
  }
  list = list + `</ul>`;
  return list;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (err, fileList) {
        var title = "Welcome";
        var description = "hello node.js";
        var list = templateList(fileList);
        var template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${description}`
        );

        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", function (err, fileList) {
        fs.readFile(`data/${queryData.id}`, "utf8", function (err, data) {
          var description = data;
          var title = queryData.id;
          var list = templateList(fileList);
          var template = templateHTML(
            title,
            list,
            `<h2>${title}</h2>${description}`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000);

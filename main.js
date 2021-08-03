var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
function templateHTML(title, list, des, control) {
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
    ${control}
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
  console.log(request);
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
          `<h2>${title}</h2>${description}`,
          '<a href="/create">create</a>'
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
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>
            <form action="/delete_process" method="post" onsubmit="delete_submit">
            <input type="hidden" name="id" value=${title} />
            <input type="submit" value="delete"/>
            </form>
            `
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (err, fileList) {
      var title = "WEB - Create";
      var list = templateList(fileList);
      var template = templateHTML(
        title,
        list,
        `
        <form action="http://localhost:3000/create_process" method="post">
  <p><input type="text" name="title" /></p>
  <p>
    <textarea id="" cols="30" rows="10" name="description"></textarea>
  </p>
  <p><input type="submit" /></p>
</form>
        `,
        ""
      );

      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (err, fileList) {
      fs.readFile(`data/${queryData.id}`, "utf8", function (err, data) {
        var description = data;
        var title = queryData.id;
        var list = templateList(fileList);
        var template = templateHTML(
          title,
          list,
          `
        <form action="/update_process" method="post">
        <input type="hidden" value=${title} name="id">
  <p><input type="text" name="title" value=${title}></p>
  <p>
    <textarea id="" cols="30" rows="10" name="description">${description}</textarea>
  </p>
  <p><input type="submit" /></p>
</form>
        `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var id = post.id;
      var description = post.description;
      console.log(post);
      fs.rename(`data/${id}`, `data/${title}`, function (err) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, function (err) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});
app.listen(3000);

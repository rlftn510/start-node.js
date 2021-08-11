var http = require("http");
var url = require("url");
// var sanitizeHtml = require("sanitize-html");
var topic = require(".//lib/topic");
// db.connect();

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      topic.home(request, response);
      // fs.readdir("./data", function (error, filelist) {
      //   var title = "Welcome";
      //   var description = "Hello, Node.js";
      //   var list = template.list(filelist);
      //   var html = template.HTML(
      //     title,
      //     list,
      //     `<h2>${title}</h2>${description}`,
      //     `<a href="/create">create</a>`
      //   );
      //   response.writeHead(200);
      //   response.end(html);
      // });
    } else {
      topic.page(request, response);
      /*fs.readdir("./data", function (error, filelist) {
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
          var title = queryData.id;
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags: ["h1"],
          });
          var list = template.list(filelist);
          var html = template.HTML(
            sanitizedTitle,
            list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
          );
          response.writeHead(200);
          response.end(html);
        })
      });;*/
    }
  } else if (pathname === "/create") {
    topic.create(request, response);
    /*fs.readdir("./data", function (error, filelist) {
      var title = "WEB - create";
      var list = template.list(filelist);
      var html = template.HTML(
        title,
        list,
        `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,
        ""
      );
      response.writeHead(200);
      response.end(html);
    });*/
  } else if (pathname === "/create_process") {
    topic.create_process(request, response);
  } else if (pathname === "/update") {
    topic.update(request, response);
    /*fs.readdir("./data", function (error, filelist) {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.HTML(
          title,
          list,
          `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });*/
  } else if (pathname === "/update_process") {
    topic.update_process(request, response);
  } else if (pathname === "/delete_process") {
    topic.delete_process(request, response);
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);

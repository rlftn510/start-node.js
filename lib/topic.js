var db = require("./db");
var template = require("./template");
var url = require("url");
var qs = require("querystring");
var path = require("path");
var sanitizeHtml = require("sanitize-html");

exports.home = function (request, response) {
  db.query(`SELECT * FROM topic`, function (errer, topics) {
    var title = "Welcome";
    var description = "Hello, Node.js";
    var list = template.list(topics);
    var html = template.HTML(
      `
      ${title}
      
      `,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
};

exports.page = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  db.query(`SELECT * FROM topic`, function (errer, topics) {
    if (errer) throw error;
    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`,
      [queryData.id],
      function (error2, result) {
        if (error2) throw error2;
        var title = sanitizeHtml(result[0].title);
        var description = sanitizeHtml(result[0].description);
        var author = sanitizeHtml(result[0].name);
        var list = template.list(topics);
        var html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>
          ${description}
          <p>by ${author}</p>`,
          ` <a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}">
              <input type="submit" value="delete">
            </form>`
        );
        response.writeHead(200);
        response.end(html);
      }
    );
  });
};

exports.create = function (request, response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) throw error;
    db.query(`SELECT * FROM author`, function (error2, authors) {
      if (error2) throw error;
      var title = "WEB - create";
      var list = template.list(topics);
      var html = template.HTML(
        sanitizeHtml(title),
        list,
        `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p>
            <input type="submit" value="제출"/>
          </p>
        </form>
      `,
        ""
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;
    var author_id = post.author;
    db.query(
      `INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, now(), ?)`,
      [title, description, author_id],
      function (error, result) {
        if (error) throw error;
        response.writeHead(302, { Location: `/?id=${result.insertId}` });
        response.end();
      }
    );
    /*fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });*/
  });
};

exports.update = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) throw error;
    db.query(
      `SELECT * FROM topic WHERE id=?`,
      [queryData.id],
      function (error2, topic) {
        if (error2) throw error2;
        db.query(`SELECT * FROM author`, function (error3, authors) {
          if (error3) throw error3;
          var title = sanitizeHtml(topic[0].title);
          var description = sanitizeHtml(topic[0].description);
          var list = template.list(topics);
          var html = template.HTML(
            title,
            list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                ${template.authorSelect(authors, topic[0].author_id)}
              </p>
              <p>
                <input type="submit" value="수정">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      }
    );
  });
};

exports.update_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
    console.log(body);
  });
  request.on("end", function () {
    var post = qs.parse(body);
    var id = post.id;
    var title = post.title;
    var description = post.description;
    var author_id = post.author;
    db.query(
      `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
      [title, description, author_id, id],
      function (error, result) {
        if (error) throw error;
        response.writeHead(302, { Location: `/?id=${id}` });
        response.end();
      }
    );

    // fs.rename(`data/${id}`, `data/${title}`, function (error) {
    //   fs.writeFile(`data/${title}`, description, "utf8", function (err) {
    //     response.writeHead(302, { Location: `/?id=${title}` });
    //     response.end();
    //   });
    // });
  });
};

exports.delete_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    var id = post.id;
    var filteredId = path.parse(id).base;
    db.query(`DELETE FROM topic WHERE id = ?`, [id], function (error) {
      if (error) throw error;
      response.writeHead(302, { Location: `/` });
      response.end();
    });
    // fs.unlink(`data/${filteredId}`, function (error) {
    //   response.writeHead(302, { Location: `/` });
    //   response.end();
    // });
  });
};

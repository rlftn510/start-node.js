var db = require("./db");
var template = require("./template");
var url = require("url");
var qs = require("querystring");
var path = require("path");
var sanitizeHtml = require("sanitize-html");
exports.home = function (request, response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) throw error;
    db.query(`SELECT * FROM author`, function (error2, authors) {
      if (error2) throw error2;
      var title = "Author List";
      var list = template.list(topics);

      var html = template.HTML(
        title,
        list,
        `
        ${template.authorList(authors)}
        <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                }
            </style>
            <form action="/author/create_process" method="post">
            <p>
                <input type="text" name="name" placeholder="name">
            </p>
            <p>
                <textarea name="profile" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        `,
        ``,
        ``
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
    db.query(
      `INSERT INTO author (name, profile) VALUES(?, ?)`,
      [post.name, post.profile],
      function (error, result) {
        if (error) throw error;
        response.writeHead(302, { Location: `/author` });
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
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) throw error;
    db.query(`SELECT * FROM author`, function (error2, authors) {
      if (error2) throw error2;
      var _url = request.url;
      var queryData = url.parse(_url, true).query;
      db.query(
        `SELECT * FROM author WHERE id=?`,
        [queryData.id],
        function (err3, author) {
          if (err3) throw err3;
          var title = "Author List";
          var list = template.list(topics);
          var html = template.HTML(
            title,
            list,
            `
          ${template.authorList(authors)}
          <style>
                  table{
                      border-collapse: collapse;
                  }
                  td{
                      border:1px solid black;
                  }
              </style>
              <form action="/author/update_process" method="post">
              <input type="hidden" name="id" value="${author[0].id}"/>
              <p>
                  <input type="text" name="name" placeholder="name" value="${sanitizeHtml(
                    author[0].name
                  )}">
              </p>
              <p>
                  <textarea name="profile" placeholder="description">${sanitizeHtml(
                    author[0].profile
                  )}</textarea>
              </p>
              <p>
                  <input type="submit" value="update">
              </p>
          </form>
          `,
            ``,
            ``
          );
          response.writeHead(200);
          response.end(html);
        }
      );
    });
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
    db.query(
      `UPDATE author SET name=?, profile=? WHERE id=?`,
      [post.name, post.profile, post.id],
      function (error, result) {
        if (error) throw error;
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

exports.delete_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body = body + data;
    console.log(body);
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(
      `DELETE FROM topic WHERE author_id = ?`,
      [post.id],
      function (err) {
        if (err) throw err;
        db.query(
          `DELETE FROM author WHERE id=?`,
          [post.id],
          function (error, result) {
            if (error) throw error;
            response.writeHead(302, { Location: `/author` });
            response.end();
          }
        );
      }
    );
  });
};

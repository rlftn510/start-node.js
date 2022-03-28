var sanitizeHtml = require("sanitize-html");

module.exports = {
  HTML: function (title, list, body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <p>
        <a href="/author">Authors</a>
      </p>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list: function (filelist) {
    var list = "<ul>";
    var i = 0;
    while (i < filelist.length) {
      list =
        list +
        `<li><a href="/?id=${filelist[i].id}">${sanitizeHtml(
          filelist[i].title
        )}</a></li>`;
      i = i + 1;
    }
    list = list + "</ul>";
    return list;
  },
  authorSelect: function (authors, select_id) {
    var list = "<select name='author'>";
    var i = 0;
    var selected = "";
    while (i < authors.length) {
      if (authors[i].id === select_id) {
        selected = "selected";
      } else {
        selected = "";
      }
      list += `<option value="${authors[i].id}" ${selected}>${sanitizeHtml(
        authors[i].name
      )}</option>`;
      i++;
    }
    list = list + "</select>";
    return list;
  },
  authorList: function (authors) {
    var tag = `
    <table>
          <thead>
          <tr>
            <th>name</th>
            <th>profile</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
          </thead>
          <tbody>
    `;
    var i = 0;
    while (i < authors.length) {
      tag += `
      <tr>
        <td>${sanitizeHtml(authors[i].name)}</td>
        <td>${sanitizeHtml(authors[i].profile)}</td>
        <td><a href="/author/update?id=${authors[i].id}">update</a></td>
        <td>
          <form action="/author/delete_process" method="post">
            <input type="hidden" name="id" value=${authors[i].id} />
            <input type="submit" value="delete"/> 
          </form>
        </td>
      </tr>
      `;
      i++;
    }
    tag = tag + `</tbody></table>`;
    return tag;
  },
};

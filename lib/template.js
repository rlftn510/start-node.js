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
        `<li><a href="/?id=${filelist[i].id}">${filelist[i].title}</a></li>`;
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
      list += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
      i++;
    }
    list = list + "</select>";
    return list;
  },
};

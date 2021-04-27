module.exports.HtmlPage = ({ title, content }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="/wp-content/style.css">
      </head>
      <body>
        <div id="container">
          ${content}
        </div>
      </body>
    </html>
  `;
};

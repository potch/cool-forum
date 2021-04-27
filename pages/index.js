const htm = require('htm');
const { h } = require('preact');

const html = htm.bind(h);

module.exports.IndexPage = ({ user = {}, forums = [] }) => {
  return html`
    <nav class="menu">oh hey it's ${user.username}</nav>
    <header>
      <h1>Forum Website</h1>
    </header>
    <section class="forums">
      <h2 class="section-title">forums</h2>
      ${forums.map(
        forum => html`
          <div class="forums">
            <h2>
              <a href="/forum/${forum.id}">${forum.name}</a>
            </h2>
          </div>
        `
      )}
    </section>
    <footer>
      <span>© 2002-2021 friends</span>
      <b>•</b>
      <a href="/dbsync">reset the database</a>
    </footer>
  `;
};

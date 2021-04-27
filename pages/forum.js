import htm from "htm";
import { h } from "preact";

const html = htm.bind(h);

export const ForumPage = ({ user = {}, forum = {}, topics = [] }) => {
  return html`
    <nav class="menu">oh hey it's ${user.username}</nav>
    <header>
      <h1>Forum Website</h1>
    </header>
    <section class="forum">
      <h2>${forum.name}</h2>
    </section>
    <section class="topics">
      ${topics.map(
        (topic) => html`
          <div class="topic">
            <a href="/topic/${topic.id}">${topic.name}</a>
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

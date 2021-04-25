import htm from "htm";
import { h } from "preact";

const html = htm.bind(h);

export const TopicPage = ({
  user = {},
  forum = {},
  topic = {},
  messages = [],
}) => {
  return html`
    <nav class="menu">oh hey it's ${user.username}</nav>
    <header>
      <h1>Forum Website</h1>
    </header>
    <section class="forum">
      <h3>${forum.name}</h3>
      <h2>${topic.name}</h2>
    </section>
    <section class="topics">
      ${messages.map(
        message => html`
          <div class="message">
            <h4>${message.title}</h4>
            <i>by ${message.User && message.User.username}</i>
            <br />
            <br />
            ${message.body}
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

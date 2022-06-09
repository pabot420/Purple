Iframes allow us to load HTML content asynchronously. We treat them kind of like http "long-polling", allowing the rest of the page to load and only serving the iframe request once the data has loaded.

Some questions:
- How do we declare where we want the iframes to be

Some ideas:
- We can put the iframes inside <noscript> tags to only load them as needed.
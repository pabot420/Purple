# What's the problem?

I've spent a long time researching a variety of web frameworks (from Ruby on Rails to React & Solid.js) Here's what I learned about good framework design:

## 1. It makes developers happy

Writing apps in JSX is actually quite fun. State solutions in the browser (like MobX and Redux) when combined with rendering libraries seem like the new browser side MVC architecture, and if any of these terms sound confusing that's because they are. By pushing all of our code into the browser as Javascript we make it easy to develop highly interactive apps, and deploy them isomorphically (meaning we can run the same code in the server and the browser).

In a lot of cases this ends up sabotaging the user experience, but it doesn't have to. This problem stems from the fact that HTML is incredibly faster than JavaScript. HTML is "stupid", like a rough rubric of a page. It's super easy to show a page but it breaks down quickly when you want to do something a little more complicated. JavaScript is super smart, and a much easier way to write a powerful app, but due to these capabilities it takes much longer to evaluate. Now appears two (seemingly) diametrically opposed forces:

1.  The user who wants to get their page as fast as possible

2.  The developer who doesn't really feel like maintaining two separate code bases for the front end and back end, and/or prefers JavaScript for it's nice syntax and good async/streaming capabilities.

## 2. It makes users happy

Normal apps using JSX run one of the following ways

1.  Run everything in the client **(Super Slow, the lazy way)**

2.  Run everything in the server to get the HTML and then re-run everything in the client **(Still Slow, easy for devs)**

3.  Qwik.js runs the code in the server then only parse the JS it needs (**Quite fast** but it's **immature**, and it still downloads all the code from my understanding)

I was noticing a trend. To make the best framework you can't get there by comprimising load times. To make the best apps we need to focus on doing as much work in the server as possible, and not dump a whole bunch of code into the browser (this is the symptom of coding tools being poorly optimized, not an inherent trade-off).

## 3. It eliminates pain points

New fangled JS frameworks might be on the road to creating better developer tools, but they're still experiencing growing pains. We need to re-evaluate which parts have made developing apps harder not easier compared to "ancient" languages like **PHP** and **Rudolph on Rails**. Here's some of the other places I've had the hardest time

1.  Support for CSS Modules & Preprocessors

2.  Internationalization is hard (libraries do exist but they seem to be significantly lacking in my experience)

3.  General lack of add-on plugins/packages in the ecosystem

4.  Lack of adoption limits a project's potential (less field-testing, contributors, and job opportunities)

## What is Purple?

Purple is being developed to solve these issues. It strives to seek harmony between user and developer experiences. I previously took a break from this project and now I am rewriting it from scratch.

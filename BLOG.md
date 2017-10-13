# Polymer 2 and TypeScript

For [reasons beyond my control](http://mdworld.nl/blog/webdevelopment/2017/07/30/polymer2-redux/) I'm working with
Polymer 2 at the moment. Although the idea of web components is great, the choice for HTML imports that comes with
Polymer 2 makes integration into a modern development stack cumbersome, as will become clear soon.

**polyfills for html imports are available, but these are pretty intransparent**

Using TypeScript seems like a good choice, because strong typing helps prevent runtime errors. Additionally it would a
good opportunity to try out the [Scala-TS-interfaces project](https://github.com/code-star/scala-ts-interfaces) by my
colleagues, that can generate TypeScript from a Scala domain model. Unfortunately, adding TypeScript to a Polymer 2
development stack proves to be cumbersome, whereas using it with Polymer 3 seems trivial. Polymer 3 is currently in
preview so it is not a viable option for me for the moment, but it will exchange HTML imports for ES6 Modules. This will
make integrating it into a modern development stack much easier. An [example](https://github.com/mdvanes/polymer3-typescript)
already exists, by [Paolo Ferretti](https://github.com/pferretti) and follows normal conventions for a TypeScript project.

If you're adventurous, don't need any [existing Polymer 2 elements](https://www.webcomponents.org/) and don't need to
run production stop reading here and use Polymer 3. If you need Polymer 2 read on, but be warned that it won't be pretty.

The first challenge is to use webpack with Polymer 2. Although not strictly necessary for TypeScript compilation, it would
make sense for importing HTML as modules. Fortunately, [Rob Doddson himself](https://www.youtube.com/playlist?list=PLOU2XLYxmsII5c3Mgw6fNYCzaWrsM3sMN) wrote an
article [How to use Polymer with Webpack](http://robdodson.me/how-to-use-polymer-with-webpack/). It even mentions TypeScript!
The article introduces the webpack loader [https://github.com/webpack-contrib/polymer-webpack-loader](https://github.com/webpack-contrib/polymer-webpack-loader) and
explains how it extracts the JavaScript from the HTMl of Polymer elements and eventually combines everything into one
JavaScript file. I was basically able to copy the webpack.config.js and index.ejs and that would compile. I moved my
[custom elements](https://github.com/mdvanes/polygram/tree/webpack) from the root of the project to the src dir and I had
to modify the paths to the bower_components and it would basically work. Except for Redux, because @TODO



The article uses Babel and import from npm modules. Was easy to migrate, but loses the poly serve/demo pages. @

It was not just a matter of adding ts loader (and changing the extensions.)  @
Show first html webpack config

```javascript
{
    test: /\.html$/,
    use: [
        { loader: 'babel-loader' },
        { loader: 'polymer-webpack-loader' }
    ]
},
```

```javascript
{
    test: /\.html$/,
    use: [
        { loader: 'babel-loader' },
        { loader: 'ts-loader' }, // https://github.com/webpack-contrib/polymer-webpack-loader/issues/64
        { loader: 'polymer-webpack-loader' }
    ]
},
```

Does such a Gist works in Jekyll?
https://github.com/jekyll/jekyll-gist
<script src="https://gist.github.com/robdodson/4270ff2dbd0852b34ad849e723bc4592.js"></script>



Even without changing any code it fails..
Filed a bug and will look into the code myself.
Workaround :
So extracting ts to separate file, so webpack match for tsloader can be... instead of part of the html match...  .
How to load? Now using import (code example)  but would script tag work?
Next problem: ts file does not import the html imports (code example) like Polymer.Element. Stubbed it and that compiles. Next step: HOF that accepts the html imports

One thing to do Typescript for poly app, other thing for reusable poly component.
The current solution will generate a compiled app, but does not allow importing (check?) and how about lazy loading?


Demos and stuff are now gone

To do
* Fix Redux
* Linting
* Unit and e2e and coverage
* Rxjs
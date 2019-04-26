define(["jquery", "jquery_ui", "answer"], function($) {
  $.widget("stej.app", {
    options: {
      categories: ["Potpourri"],
      api_url: "https://opentdb.com/api.php",
      api_categoriy_url: "https://opentdb.com/api_category.php"
    },

    _init: function() {
      this.game_data = eval(sessionStorage.getItem("game_data"));

      if (this.game_data == null) {
        $.ajax(this.options.api_categoriy_url).then(({ trivia_categories }) => {
          Promise.all(
            this.options.categories
              .map(category =>
                ["easy", "medium", "hard"].reduce(
                  (urls, difficulty) =>
                    Object.assign(urls, {
                      [difficulty]:
                        this.options.api_url +
                        "?" +
                        $.param({
                          amount: 2,
                          category: trivia_categories.filter(c => c.name === category).reduce((a, c) => c.id, ""),
                          difficulty
                        })
                    }),
                  { category }
                )
              )
              .map(urls =>
                Promise.all([
                  $.ajax(urls.easy).then(data => data.results),
                  $.ajax(urls.medium).then(data => data.results),
                  $.ajax(urls.hard).then(data => data.results)
                ])
                  .then(questions => Object.assign(urls, { questions: questions.flat() }))
                  .catch(err => console.log(err))
              )
          )
            .then(data => sessionStorage.setItem("game_data", JSON.stringify(data)))
            .catch(err => console.log(err));
        });
      }
    },

    _createCategoryEl: function(name) {
      return $("<div>")
        .addClass("game-category")
        .append(
          $("<div>")
            .text(name)
            .addClass("game-category-header game-box"),
          [200, 400, 600, 800, 1000].map(amount => $("<div>").answer({ amount, category: name }))
        );
    },

    _create: function() {
      this.element
        .append(
          $("<div>")
            .addClass("jumbotron")
            .append(
              $("<h1>")
                .addClass("display-4 title-font")
                .text("Trivia Game!"),
              $("<p>")
                .addClass("lead")
                .text("A tribute to the best game show host ever."),
              $("<hr>").addClass("my-4"),
              $("<div>")
                .append(
                  $("<div>")
                    .append(this.options.categories.map(c => this._createCategoryEl(c)))
                    .addClass("game-board")
                )
                .addClass("game"),
              $("<hr>").addClass("my-4")
            )
        )
        .addClass("app");
    }
  });
});

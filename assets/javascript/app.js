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

    _createCategoryEl: function(category) {
      return $("<div>")
        .addClass("game-category")
        .append(
          $("<div>")
            .text(category)
            .addClass("game-category-header game-box"),
          [200, 400, 600, 800, 1000].map(amount => $("<div>").answer({ amount, category }))
        );
    },

    _create: function() {
      this._addClass("app d-flex flex-column justify-content-center align-items-center h-100 w-100");

      this._on(this.element, {
        "click .game-answer": function(e) {
          $(e.currentTarget).answer("open");
        }
      });

      this.element.append(
        $("<h1>")
          .addClass("game-title display-4 ")
          .text("Trivia Game!"),
        $("<p>")
          .addClass("game-byline lead")
          .text("A tribute to the best game show host ever."),
        $("<div>")
          .addClass("game")
          .append(
            $("<div>")
              .addClass("game-board")
              .append(this.options.categories.map(c => this._createCategoryEl(c)))
          )
      );
    }
  });
});

define(["jquery", "jquery_ui", "answer"], function($) {
  $.widget("stej.app", {
    options: {
      categories: ["Potpourri"],
      api_url: "https://opentdb.com/api.php",
      api_categoriy_url: "https://opentdb.com/api_category.php"
    },

    _init: function() {
      if (eval(sessionStorage.getItem("game_data")) == null) {
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
            .then(data => {
              sessionStorage.setItem("game_data", JSON.stringify(data));
              this._update();
            })

            .catch(err => console.log(err));
        });
      } else {
        this._update();
      }
    },

    _update: function() {
      var game_data = eval(sessionStorage.getItem("game_data"));

      this.categoriesEl.map(categoryEl => {
        var category = categoryEl.find(".game-category-header").text();

        game_data
          .filter(c => c.category === category)
          .map(category_data => {
            var { questions } = category_data;
            categoryEl.find(".game-answer").each((x, el) => {
              $(el).answer({
                answer: questions[x].question,
                questions: [questions[x].correct_answer, ...questions[x].incorrect_answers],
                response: function(event, data) {
                  if (data.selection === questions[x].correct_answer) {
                    console.log("Correct!");
                  } else {
                    console.log('Wrong: The correct question is "What is ' + questions[x].correct_answer + '?"');
                  }
                }
              });
            });
          });
      });
    },

    _createCategoryEl: function(category) {
      return $("<div>")
        .addClass("game-category")
        .append(
          $("<div>")
            .text(category)
            .addClass("game-category-header game-box"),
          [200, 400, 600, 800, 1000].map(amount =>
            $("<div>").answer({
              amount,
              category
            })
          )
        );
    },

    _create: function() {
      this._addClass("app d-flex flex-column justify-content-center align-items-center h-100 w-100");

      this._on(this.element, {
        "click .game-answer": function(e) {
          $(e.currentTarget).answer("open");
        }
      });

      this.categoriesEl = this.options.categories.map(c => this._createCategoryEl(c));

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
              .append(this.categoriesEl)
          )
      );
    }
  });
});

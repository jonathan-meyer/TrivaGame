define(["jquery", "jquery_ui"], function($) {
  $.widget("stej.answer", {
    options: {
      amount: 0,
      category: "",
      data: {}
    },

    open() {
      console.log([this.options.category, this.options.amount, "open"].join("_"));

      // unselect all other items
      $(".selected").removeClass("selected");

      // select this item
      this._addClass("selected");

      this.amountEl.hide("fade", 200, () => {
        this.clueEl.show("fade", 200, () => {
          this.clueEl.css({ position: "absolute" }).animate(
            { width: 640, height: 480 },
            {
              duration: 800,
              step: () => {
                var w = this.clueEl.width();
                var h = this.clueEl.height();

                $("#fitin div").css("font-size", "1em");

                while ($("#fitin div").height() > $("#fitin").height()) {
                  $("#fitin div").css("font-size", parseInt($("#fitin div").css("font-size")) - 1 + "px");
                }
              }
            }
          );
        });
      });
    },

    data: function(data) {
      console.log([this.options.category, this.options.amount, "data"].join("_"));

      this.options.data = data;

      this.clueEl.text(this.options.data.question);
      this.answers = this._shuffle([this.options.data.correct_answer, ...this.options.data.incorrect_answers]);
    },

    _shuffle: function(items) {
      var _items = [...items];
      var shuffled = [];

      while (_items.length > 0) {
        shuffled = [...shuffled, ..._items.splice(Math.round(Math.random() * 100) % _items.length, 1)];
      }

      return shuffled;
    },

    _init: function() {
      console.log([this.options.category, this.options.amount, "init"].join("_"));
    },

    _create: function() {
      console.log([this.options.category, this.options.amount, "create"].join("_"));

      this._addClass("game-answer game-box");

      this.clueEl = $("<div>")
        .addClass("game-answer-clue")
        .hide();
      this.amountEl = $("<div>")
        .text(this.options.amount)
        .addClass("game-answer-amount")
        .show();

      this.element.append(this.amountEl, this.clueEl);
    }
  });
});

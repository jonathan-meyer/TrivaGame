define(["jquery", "jquery_ui"], function($) {
  $.widget("stej.answer", {
    options: {
      amount: 0,
      category: "",
      data: {}
    },

    open() {
      // console.log([this.options.category, this.options.amount, "open"].join("_"));
      var widget = this;

      widget.clueEl.dialog({
        width: 640,
        height: 480,
        autoOpen: true,
        modal: true,
        resizable: false,
        draggable: false,
        closeOnEscape: false,
        buttons: widget.questions.map(ans => ({
          text: ans,
          click: function(event) {
            widget._trigger("ask", event, {
              selection: $(event.target).text(),
              correctQuestion: widget.correctQuestion,
              result: $(event.target).text() === widget.correctQuestion ? "Correct" : "Wrong"
            });

            widget.clueEl.dialog("close");
            widget.amountEl.hide("fade", 200);
          }
        })),
        show: {
          effect: "fade",
          duration: 500
        },
        classes: {
          "ui-button": "btn btn-primary"
        },
        open: function() {
          widget.clueEl.css("font-size", widget.clueEl.width() * 0.1 - 10);
        }
      });
    },

    data: function(data) {
      // console.log([this.options.category, this.options.amount, "data"].join("_"));

      this.options.data = data;

      this.clueEl.html(this.options.data.question);
      this.correctQuestion = this.options.data.correct_answer;
      this.questions = this._shuffle([this.options.data.correct_answer, ...this.options.data.incorrect_answers]);
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
      // console.log([this.options.category, this.options.amount, "init"].join("_"));
    },

    _create: function() {
      // console.log([this.options.category, this.options.amount, "create"].join("_"));

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

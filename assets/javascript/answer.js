define(["jquery", "jquery_ui"], function($) {
  $.widget("stej.answer", {
    options: {
      amount: 0,
      category: "",
      answer: "",
      questions: []
    },

    open() {
      var widget = this;

      widget.clueEl.html(widget.options.answer).dialog({
        width: 640,
        height: 480,
        autoOpen: true,
        modal: true,
        resizable: false,
        draggable: false,
        closeOnEscape: false,
        buttons: widget._shuffle(widget.options.questions).map(question => ({
          text: question,
          click: function(event) {
            widget._trigger("response", event, {
              selection: $(event.target).text()
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
          var width = widget.clueEl.width() + 1;
          var height = widget.clueEl.height() + 1;

          for (var size = 50; width > widget.clueEl.width() || height > widget.clueEl.height(); size--) {
            var el = $("<div>")
              .css({ fontSize: size, display: "inline-block", maxWidth: widget.clueEl.width(), border: "1px solid red" })
              .text(widget.clueEl.text())
              .appendTo("body");

            width = el.width();
            height = el.height();

            el.remove();
          }

          widget.clueEl.css({ fontSize: size });
        }
      });
    },

    _shuffle: function(items) {
      var _items = [...items];
      var shuffled = [];

      while (_items.length > 0) {
        shuffled = [...shuffled, ..._items.splice(Math.round(Math.random() * 100) % _items.length, 1)];
      }

      return shuffled;
    },

    _create: function() {
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

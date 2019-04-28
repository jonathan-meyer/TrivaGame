define(["jquery", "jquery_ui"], function($) {
  $.widget("stej.answer", {
    options: {
      amount: 0,
      category: "",
      answer: "",
      questions: [],
      timeout: 10
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
            widget._stopTimer();
            widget._trigger("onResponse", event, {
              selection: $(event.target).text(),
              amount: widget.options.amount
            });
            widget.clueEl.dialog("close");
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
          var timerEl = $("<div>").progressbar({ max: widget.options.timeout * 10, value: widget.options.timeout * 10 });

          $(this).after(timerEl);

          var width = widget.clueEl.width() + 1;
          var height = widget.clueEl.height() + 1;

          for (var size = 50; width > widget.clueEl.width() || height > widget.clueEl.height(); size--) {
            var el = $("<div>")
              .css({ fontSize: size, display: "inline-block", maxWidth: widget.clueEl.width(), border: "1px solid red" })
              .text(widget.clueEl.text())
              .appendTo("body");

            width = el.width();
            height = el.height();

            console.log({ width: widget.clueEl.width(), height: widget.clueEl.height() });
            el.remove();
          }

          widget.clueEl.css({ fontSize: size });
          widget.timer = setInterval(() => {
            timerEl.progressbar("value", timerEl.progressbar("value") - 1);

            if (timerEl.progressbar("value") <= 0) {
              widget._stopTimer();
              widget._trigger("onTimeout", null, {
                amount: widget.options.amount
              });
              widget.clueEl.dialog("close");
            }
          }, 100);
        },

        close: function() {
          widget.amountEl.hide("fade", 200);
        }
      });
    },

    _stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    _shuffle: function(items) {
      var _items = [...items];
      var shuffled = [];

      while (_items.length > 0) {
        shuffled = [...shuffled, ..._items.splice(Math.round(Math.random() * 100) % _items.length, 1)];
      }

      return shuffled;
    },

    _setOptions: function(options) {
      this._super(options);

      if (this.options.answer && this.options.answer.length > 0) {
        this.amountEl.show();
      } else {
        this.amountEl.hide();
      }
    },

    _create: function() {
      this._addClass("game-answer game-box");

      this.clueEl = $("<div>")
        .addClass("game-answer-clue")
        .hide();
      this.amountEl = $("<div>")
        .text(this.options.amount)
        .addClass("game-answer-amount")
        .hide();

      this.element.append(this.amountEl, this.clueEl);
    }
  });
});

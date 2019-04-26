define(["jquery", "jquery_ui"], function($) {
  $.widget("stej.answer", {
    options: {
      amount: 0,
      category: "",
      data: {}
    },

    open() {
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

    _init: function() {
      // console.log(this.options.category + " _init");

      this.amountEl.text(this.options.amount);
      this.clueEl.text("unknown");
    },

    _create: function() {
      // console.log(this.options.category + " _create");

      this._addClass("game-answer game-box");

      this.clueEl = $("<div>")
        .addClass("game-answer-clue fittext")
        .hide();
      this.amountEl = $("<div>")
        .addClass("game-answer-amount")
        .show();

      this.element.append(this.amountEl, this.clueEl);
    }
  });
});

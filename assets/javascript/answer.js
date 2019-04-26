define(["jquery", "jquery_ui"], function($) {
  $.widget("stej.answer", {
    options: {
      amount: 0,
      category: "",
      data: {}
    },

    _init: function() {
      this.element
        .text(this.options.amount)
        .addClass("game-category-amount game-box")
        .click(() => {
          console.log(this.options.category + " for $" + this.options.amount + " Alex!");
        });
    }
  });
});

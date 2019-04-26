(function($) {
  jQuery.fn.revealAnswer = function(settings) {
    var config = { foo: "bar" };

    if (settings) jQuery.extend(config, settings);

    this.each(function() {
      // element-specific code here
    });

    return this;
  };
})(jQuery);

requirejs.config({
  map: {
    "*": { "popper.js": "popper" }
  },
  paths: {
    jquery: "https://code.jquery.com/jquery-3.4.0.min",
    jquery_ui: "https://code.jquery.com/ui/1.12.1/jquery-ui",
    popper: "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min",
    bootstrap: "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min"
  }
});

define(["jquery", "app"], function($) {
  $(function() {
    $("#app").app({ categories: ["Geography", "Science & Nature", "Sports"] });
  });
});

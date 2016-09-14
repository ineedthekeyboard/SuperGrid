(function() {
    if (!window.jQuery || !window.$ || !window.$.widget) {
        document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js"><\/script>');
        document.write('<script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js" integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E=" crossorigin="anonymous"><\/script>');
        alert('jQuery or jQuery UI Not Found. Using CDN');
        console.log('jQuery Not Found. Using CDN');
        console.log('jQuery UI Not Found. Using CDN');
    }
})();

(function ($) {
  $.fn.ajaxer = function () {
    const getParams = new URLSearchParams(window.location.search);

    return this.each(function () {
      const $form = $(this);
      const actionUrl = window.location.href.split('?')[0];
      const $submitBtn = $form.find('[type="submit"]');

      $submitBtn.prop('disabled', true);
      $submitBtn.find('span').html("Processing...");
      getParams.forEach((value, key) => {
        if (!$form.find(`[name="${key}"]`).length) {
          $form.append(
            $('<input>', {
              type: 'hidden',
              name: key,
              value: value,
            })
          );
        }
      });

      const $captcha = $form.find('.cf-turnstile');
      const captchaId = $captcha.attr('id') || `cf-${Date.now()}`;
      $captcha.attr('id', captchaId);

      window.cfCallback = function (token) {
        if (token && token.length > 0) {
          $submitBtn.prop('disabled', false);
          $submitBtn.find('span').html("Process donation");
        }
      };

      $form.validate({
        submitHandler: function (form) {
          const $form = $(form);

          $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method') || 'POST',
            data: $form.serialize(),
            dataType: 'json',
            success: function (response) {
              console.log('Form submitted successfully:', response);
            },
            error: function (xhr) {
              console.error('Form submission failed:', xhr.responseText || xhr.statusText);
            },
            complete: function () {
              if (typeof turnstile !== 'undefined') {
                turnstile.reset(captchaId);
              }
              $submitBtn.prop('disabled', true);
              $submitBtn.find('span').html("Process donation");
            },
          });

          return false;
        },
      });
    });
  };
})(jQuery);

(function(exports, global) {
  'use strict';

  global.fetch = global.fetch || require('node-fetch');

  const App = {
    url: 'https://localhost:8010/v1/user',
    fetch() {
      const self = this;
      let xhr;

      return global.fetch(this.url, {
          method: 'GET',
          // mode: 'cors',
          credentials: 'include',
          headers: {
            Accept: 'application/json; charset=utf-8',
            'Content-Type': 'application/json; charset=utf-8',
          },
          redirect: 'manual', // manual, *follow, error
        }).then(function(response) {
          xhr = response;
          return response.json();
        }).then(function(data) {
          if (xhr.status >= 400) {
            data.status = xhr.status;
            data.statusText = xhr.statusText;
            data.url = xhr.url;
            throw data;
          }

          if (data) {
            self.user = new exports.User(data);
            self.user.render();
            self.render();
          }
          return self;
        })
        .catch((err) => {
          self.renderError(err);
        });
    },

    render () {
      const nav = global.jQuery('#navbar');
      if (this.user) {
        nav.find('.login').hide();
        nav.find('.signup').hide();
      } else {
        nav.find('.logout').hide();
      }
    },

    editUser() {
      return this.user.update({
          name: {
            givenName: 'Gina',
            familyName: 'C',
          },
          email: 'cesine.ca@gmail.com',
          description: '["javascript","data","android"]'
        })
        .catch((err) => {
          this.renderError(err);
        });
    },

    renderError(err) {
      global.jQuery('#errors').html(`<div class="alert alert-${err.status <= 400 ? 'warning': 'danger'} alert-dismissible" role="alert">
  <strong>${err.statusText || 'Error'}:</strong> ${err.message}
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`);
    },
  }

  exports.App = App;

  App.fetch();
})(exports, global);

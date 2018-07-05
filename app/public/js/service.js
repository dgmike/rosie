((doc, loc) => {
  const html = doc.querySelector('html');
  html.classList.remove('no-js');
  html.classList.add('js');

  const id = loc.pathname.match(/\d+\/?$/)[0];

  function ErrorNotFound() {}

  function validate(res) {
    if (res.status == 404) {
      throw new ErrorNotFound();
    }
    if (res.status != 200) {
      throw new Error('Invalid status code');
    }
    return res;
  }

  function getJson(res) {
    return res.json();
  }

  function resolveErrors(err) {
    if (err.constructor == ErrorNotFound) {
      doc.querySelector(this).innerHTML = 'Serviço não encontrado. :-(';
    }
    doc.querySelector(this).innerHTML = err.message;
  }

  function generatePage(data) {
    const { ServiceType } = data._embedded;

    let source = 'Sem código-fonte';

    if (data.source) {
      source = `<a href="${data.source}">${data.source}</a>`;
    }

    return `
      <div class="row">
        <div class="col-sm-8">
          <h2>${data.name}</h2>
          <ul>
            <li>${source}</li>
            <li>Tipo: <img src="/img/type/${ServiceType.slug}.png"> ${ServiceType.name}</li>
            <li>Descrição: ${data.description || 'sem descrição'}</li>
          </ul>
        </div>
        <div class="col-sm-4">
          <div class="card rounded shadow-sm p-3 mb-5">
            <div class="card-block">
              <h3 class="card-title">Status</h3>
              <div class="badge badge-success">ONLINE</div>
            </div>
          </div>
          <div class="card rounded shadow-sm p-3 mb-5 mt-4">
            <div class="card-block">
              <h3 class="card-title">Dependencias</h3>
              <div class="list-group list-group-flush">
                <div class="list-group-item">conline</div>
                <div class="list-group-item">api-juros</div>
                <a class="list-group-item list-group-item-action text-primary" href="#">api-companies</a></a>
              </div>
            </div>
          </div>
        </div>
      </div>
        <!-- pre><code>${JSON.stringify(data, null, 2)}</code></pre -->
    `;
  }

  function injectOn(content) {
    doc.querySelector(this).innerHTML = content;
  }

  fetch(`/api/services/${id}`)
    .then(validate)
    .then(getJson)
    .then(generatePage)
    .then(injectOn.bind('#page'))
    .catch(resolveErrors.bind('#page'))

})(window.document, window.location);
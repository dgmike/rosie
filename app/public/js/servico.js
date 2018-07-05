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
        <div class="col-sm-12">
          <div class="float-right badge badge-success mt-4 mb-0">ONLINE</div>
          <h2>Serviço: ${data.name}</h2>
        </div>
        <div class="col-sm-9">
          <div class="card">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs">
                <li class="nav-item"><a href="#" class="nav-link active">Detalhes</a></li>
                <li class="nav-item"><a href="#" class="nav-link">README</a></li>
                <li class="nav-item"><a href="#" class="nav-link">project.yml</a></li>
                <li class="nav-item"><a href="#" class="nav-link">Dockerfile</a></li>
                <li class="nav-item"><a href="#" class="nav-link">Consultório</a></li>
                <li class="nav-item"><a href="#" class="nav-link">Responsáveis</a></li>
              </ul>
            </div>
            <div class="card-body">
              <div class="card-text">
                <dl>
                  <dt>Source</dt>
                    <dd>${source}</dd>
                  <dt>Tipo</dt>
                    <dd><img src="/img/type/${ServiceType.slug}.png"> ${ServiceType.name}</dd>
                  <dt>Etiquetas</dt>
                    <dd>
                      <ul class="list-inline">
                        <li class="list-inline-item"><a href="#">nodejs</a></li>
                        <li class="list-inline-item"><a href="#">express</a></li>
                        <li class="list-inline-item"><a href="#">b2b</a></li>
                      </ul>
                    </dd>
                  <dt>Descrição</dt>
                    <dd>${data.description || '<em>sem descrição</em>'}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-3">
          <div class="card">
            <div class="card-header">Dependencias</div>
            <div class="list-group list-group-flush mb-0">
              <a class="list-group-item list-group-item-action text-primary" href="#">api-companies</a>
              <div class="list-group-item">conline</div>
              <div class="list-group-item">api-juros</div>
              <a class="list-group-item list-group-item-action list-group-item-secondary text-muted text-right" href="#"><em>ver gráfico</em></a>
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
    .then(injectOn.bind('#main-page'))
    .catch(resolveErrors.bind('#main-page'))

})(window.document, window.location);
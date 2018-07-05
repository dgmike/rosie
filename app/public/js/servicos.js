(function (doc, fetch) {
  const html = doc.querySelector('html');
  html.classList.remove('nojs');
  html.classList.add('js');

  function getJson(res) {
    return res.json();
  }

  function generatePage(json) {
    return Promise
      .resolve(json)
      .then(generateHTMLRows)
      .then(joinAll)
      .then(wrapTable)
      .then(appendPagination.bind(json));
  }

  function generateHTMLRows(json) {
    return json.results.map(generateHTMLRow);
  }

  function generateHTMLRow(item) {
    return `
      <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item._embedded.ServiceType.name}</td>
        <td><a href="/dashboard/services/${item.id}">visualizar</a></td>
      </tr>
    `;
  }

  function joinAll(list) {
    return list.join('');
  }

  function wrapTable(html) {
    return `<table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Tipo</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${html}
      </tbody>
    </table>`;
  }

  function appendPagination(html) {
    const nextOffset = this.offset + this.limit;
    const prevOffset = Math.max(0, this.offset - this.limit);

    const prevPage = this.offset === 0 ? '<span class="disabled">anterior</span>' : `<a href="#" data-url="/api/services?offset=${prevOffset}&limit=${this.limit}">anterior</a>`;
    const nextPage = (this.offset + this.limit > this.total) ? '<span class="disabled">próxima</span>' : `<a href="#" data-url="/api/services?offset=${nextOffset}&limit=${this.limit}">próxima</a>`;

    return `
      ${html}

      <div id="pagination">${prevPage}${nextPage}</div>
    `;
  }

  function injectOn(html) {
    this.innerHTML = html;
  }

  function applyActions() {
    doc
      .querySelectorAll(this)
      .forEach(applyGetAction);
  }

  function applyGetAction(item) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      get(event.target.dataset.url)
    });
  }

  function get(url) {
    fetch(url)
      .then(getJson)
      .then(generatePage)
      .then(injectOn.bind(doc.querySelector('#services')))
      .then(applyActions.bind('#pagination a'))
  }

  get('/api/services');

}).call(null, window.document, window.fetch);
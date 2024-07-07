(async () => {
  // create qlik-embed script
  var qlik_embed_script = document.createElement('script');
  qlik_embed_script.setAttribute('crossorigin','anonymous');
  qlik_embed_script.setAttribute('type','application/javascript');
  qlik_embed_script.setAttribute('src','https://cdn.jsdelivr.net/npm/@qlik/embed-web-components');
  qlik_embed_script.setAttribute('data-host','https://qfp.eu.qlikcloud.com');
  qlik_embed_script.setAttribute('web-integration-id','drorsCqSDVq96dncC10xRK6yCHnDJ_RO');
  qlik_embed_script.setAttribute('data-cross-site-cookies','true');
  qlik_embed_script.setAttribute('data-auto-redirect','true');

  document.head.appendChild(qlik_embed_script);
  var qlik_embedcontainer_1 = document.getElementById('qlik-embed-home');
  var row = document.createElement('div');
  //row.classList.add('row');
  var home =  config.mobileDash;
  var charts = home.charts;
  for (let chart in charts) {
      var objectDiv = document.createElement('div');
      objectDiv.classList.add('col-sm-4', 'qlik-embed-home');
      var qlik_embed_obj =  document.createElement('qlik-embed');
      qlik_embed_obj.setAttribute('id', chart);
      qlik_embed_obj.setAttribute('ui',  charts[chart]["type"]);
      qlik_embed_obj.setAttribute("context:json", "{theme: '"+`${config.theme}`+"'}");
      qlik_embed_obj.setAttribute('app-id', `${config.appId}`);
      qlik_embed_obj.setAttribute('object-id', charts[chart]["id"] );
      objectDiv.appendChild(qlik_embed_obj);
      row.appendChild(objectDiv);

  }
  qlik_embedcontainer_1.appendChild(row);
  qlik_embed.setAttribute('clear-selections','TRUE');
  qlik_embed.setAttribute('theme', `${config.theme}`)
  document.getElementById("qlik-embed-container").appendChild(qlik_embed);

})();

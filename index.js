document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    cordova.plugin.http.setDataSerializer('json');
    document.getElementById('btnNovo').addEventListener('click', showCadastro);
    document.getElementById('btnCancelar').addEventListener('click', showLista);
    document.getElementById('btnFoto').addEventListener('click', takePhoto);
    document.getElementById('btnSalvar').addEventListener('click', savePizza);
    document.getElementById('btnExcluir').addEventListener('click', deletePizza);
    carregarPizzas();
}

function showCadastro() {
    document.getElementById('applista').style.display = 'none';
    document.getElementById('appcadastro').style.display = 'flex';
}

function showLista() {
    document.getElementById('applista').style.display = 'flex';
    document.getElementById('appcadastro').style.display = 'none';
}

function takePhoto() {
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.DATA_URL });

    function onSuccess(imageData) {
        let image = document.getElementById('imagem');
        image.style.backgroundImage = `url('data:image/jpeg;base64,${imageData}')`;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function savePizza() {
    let pizza = document.getElementById('pizza').value;
    let preco = document.getElementById('preco').value;
    let imagem = document.getElementById('imagem').style.backgroundImage;

    cordova.plugin.http.post('https://pedidos-pizzaria.glitch.me/admin/pizza/', {
        pizzaria: 'pizzaria_do_ze',
        pizza: pizza,
        preco: preco,
        imagem: imagem
    }, {}, function(response) {
        alert('Pizza saved successfully');
        carregarPizzas();
        showLista();
    }, function(response) {
        alert('Error saving pizza: ' + response.error);
    });
}

function deletePizza() {
    let pizza = document.getElementById('pizza').value;

    cordova.plugin.http.delete(`https://pedidos-pizzaria.glitch.me/admin/pizza/pizzaria_do_ze/${pizza}`, {}, {}, function(response) {
        alert('Pizza deleted successfully');
        carregarPizzas();
        showLista();
    }, function(response) {
        alert('Error deleting pizza: ' + response.error);
    });
}

function carregarPizzas() {
    cordova.plugin.http.get('https://pedidos-pizzaria.glitch.me/admin/pizzas/pizzaria_do_ze', {}, {}, function(response) {
        let listaPizzasCadastradas = JSON.parse(response.data);
        let listaPizzas = document.getElementById('listaPizzas');
        listaPizzas.innerHTML = '';
        listaPizzasCadastradas.forEach((item, idx) => {
            const novo = document.createElement('div');
            novo.classList.add('linha');
            novo.innerHTML = item.pizza;
            novo.id = idx;
            novo.onclick = function () {
                carregarDadosPizza(novo.id);
            };
            listaPizzas.appendChild(novo);
        });
    }, function(response) {
        alert('Error loading pizzas: ' + response.error);
    });
}

function carregarDadosPizza(id) {
    let listaPizzasCadastradas = JSON.parse(response.data);
    let pizza = listaPizzasCadastradas[id];
    document.getElementById('imagem').style.backgroundImage = pizza.imagem;
    document.getElementById('pizza').value = pizza.pizza;
    document.getElementById('preco').value = pizza.preco;
    showCadastro();
}

const jsonPath = "../data/products.json";
const productContainer = document.querySelector(".products");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const pageInfo = document.getElementById("page-info");

let products = []; // Para armazenar todos os produtos carregados
let currentPage = 1; // Página atual
const itemsPerPage = 10; // Número de itens por página

// Função para criar os elementos de um produto
function createProductCard(product) {
    return `
        <div class="product">
            <img src="${product.image_link}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">R$${parseFloat(product.price).toFixed(2)}</p>
            <p class="review">${product.rating ? "⭐".repeat(Math.round(product.rating)) : "Sem Avaliações"}</p>
        </div>
    `;
}

// Função para renderizar produtos com base na página atual
function renderProducts() {
    // Limpa o container antes de adicionar os produtos
    productContainer.innerHTML = "";

    // Cálculo dos índices inicial e final
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Pega os produtos da página atual
    const productsToShow = products.slice(startIndex, endIndex);

    // Adiciona os produtos ao HTML
    productContainer.innerHTML = productsToShow.map(createProductCard).join("");

    // Atualiza paginação
    pageInfo.textContent = `Página ${currentPage}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = endIndex >= products.length;
}

// Função para carregar os produtos do JSON
async function loadProducts() {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error("Erro ao carregar o arquivo JSON");

        products = await response.json();
        renderProducts(); // Renderiza a primeira página de produtos
    } catch (error) {
        console.error("Erro:", error);
        productContainer.innerHTML = "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
    }
}

// Configuração dos eventos de clique nos botões de paginação
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
    }
});

nextButton.addEventListener("click", () => {
    const maxPage = Math.ceil(products.length / itemsPerPage);
    if (currentPage < maxPage) {
        currentPage++;
        renderProducts();
    }
});

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim(); // Convertendo para minúsculas e removendo espaços
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) // Verifica o nome
    );

    currentPage = 1; // Reseta para a primeira página
    renderFilteredProducts(filteredProducts); // Chama a função de renderização com os produtos filtrados
});

function renderFilteredProducts(filteredProducts) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    productContainer.innerHTML = productsToShow.map(createProductCard).join("");

    // Atualiza a paginação
    pageInfo.textContent = `Página ${currentPage}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = endIndex >= filteredProducts.length;

    // Atualiza os botões de paginação com base no resultado filtrado
    nextButton.onclick = () => {
        if (endIndex < filteredProducts.length) {
            currentPage++;
            renderFilteredProducts(filteredProducts);
        }
    };

    prevButton.onclick = () => {
        if (startIndex > 0) {
            currentPage--;
            renderFilteredProducts(filteredProducts);
        }
    };
}

const priceFilters = document.querySelectorAll(".filter-group input");

priceFilters.forEach(filter => {
    filter.addEventListener("change", () => {
        let filteredProducts = [];

        if (document.getElementById("price-50").checked) {
            filteredProducts = products.filter(product => product.price <= 50);
        } else if (document.getElementById("price-50-100").checked) {
            filteredProducts = products.filter(
                product => product.price > 50 && product.price <= 100
            );
        } else if (document.getElementById("price-above-100").checked) {
            filteredProducts = products.filter(product => product.price > 100);
        }

        currentPage = 1; // Reseta para a primeira página
        renderFilteredProducts(filteredProducts);
    });
});

// Carregar produtos ao iniciar a página
loadProducts();

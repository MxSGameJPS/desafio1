const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const listaProdutos = document.getElementById("lista-produtos");
const setaDireita = document.getElementById("seta_direita");
const setaEsquerda = document.getElementById("seta_esquerda");
const dotsContainer = document.querySelector(
  ".container_produtos_text .indicadores"
); // Assumindo que os dots estão neste container

// --- Funcionalidade de Busca ---
if (searchButton && searchInput) {
  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      alert(`Voce buscou por: ${searchTerm}`);
    } else {
      alert("Por favor, digite algo para buscar.");
    }
    searchInput.focus();
  });

  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      searchButton.click();
    }
  });
}

// --- Funcionalidade do Menu Hover ---
document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".main-menu .menu-item");
  const submenuContainer = document.getElementById("submenu-container");
  let hideTimeout; // Timer para o fechamento

  if (!submenuContainer) {
    console.error("Submenu container not found!");
    return;
  }

  // Função para mostrar o submenu
  function showSubmenu() {
    clearTimeout(hideTimeout); // Cancela qualquer timer de fechamento pendente
    submenuContainer.classList.add("active");
    // Opcional: adicionar classe 'active' ao item do menu hovered (se necessário para estilização)
    // menuItems.forEach(item => item.classList.remove('active'));
    // this.classList.add('active'); // 'this' pode não ser o item correto aqui, cuidado
  }

  // Função para iniciar o timer de fechamento do submenu
  function startHideTimer() {
    clearTimeout(hideTimeout); // Limpa timer anterior
    hideTimeout = setTimeout(() => {
      submenuContainer.classList.remove("active");
      // Opcional: remover classe 'active' dos itens do menu
      // menuItems.forEach(item => item.classList.remove('active'));
    }, 200); // Pequeno delay para permitir mover o mouse para o submenu
  }

  // Adiciona listeners aos itens do menu principal
  menuItems.forEach((item) => {
    item.addEventListener("mouseenter", showSubmenu);
    item.addEventListener("mouseleave", startHideTimer);
  });

  // Mantém o submenu aberto se o mouse entrar nele
  submenuContainer.addEventListener("mouseenter", showSubmenu); // Reusa showSubmenu para cancelar o timer
  // Inicia o timer de fechamento se o mouse sair do submenu
  submenuContainer.addEventListener("mouseleave", startHideTimer);

  // --- Funcionalidade do Carrossel (com Swiper) ---
  const productSwipers = document.querySelectorAll(".product-swiper");
  console.log(`Found ${productSwipers.length} swiper containers.`); // DEBUG

  productSwipers.forEach((swiperContainer, index) => {
    console.log(
      `Initializing Swiper for container ${index + 1}:`,
      swiperContainer
    ); // DEBUG

    const paginationEl = swiperContainer.querySelector(".swiper-pagination");
    const nextEl = swiperContainer.querySelector(".swiper-button-next");
    const prevEl = swiperContainer.querySelector(".swiper-button-prev");

    console.log(`  Pagination element:`, paginationEl); // DEBUG
    console.log(`  Next button:`, nextEl); // DEBUG
    console.log(`  Prev button:`, prevEl); // DEBUG

    if (!paginationEl || !nextEl || !prevEl) {
      console.error(
        `Swiper ${index + 1}: Missing navigation or pagination elements!`
      );
      return; // Pula a inicialização se faltar elementos
    }

    try {
      new Swiper(swiperContainer, {
        // Opções do Swiper
        spaceBetween: 17, // Espaçamento entre slides
        loop: true, // Ativar loop infinito
        grabCursor: true, // Mudar cursor para "agarrar"

        // Paginação (dots)
        pagination: {
          el: paginationEl,
          clickable: true,
        },

        // Navegação (setas)
        navigation: {
          nextEl: nextEl,
          prevEl: prevEl,
        },

        // Autoplay
        autoplay: {
          delay: 5000, // 5 segundos
          disableOnInteraction: false, // Não desabilitar após interação manual (pode remover se preferir)
          pauseOnMouseEnter: true, // Pausar ao passar o mouse
        },

        // Breakpoints Responsivos
        breakpoints: {
          // Quando a largura da janela for <= 600px
          600: {
            slidesPerView: 3,
            spaceBetween: 50, // Reduzir espaço em telas menores
          },
          // Quando a largura da janela for > 600px e <= 900px
          601: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          // Quando a largura da janela for > 900px e <= 1200px
          901: {
            slidesPerView: 4,
            spaceBetween: 17,
          },
          // Quando a largura da janela for > 1200px
          1201: {
            slidesPerView: 5, // Mantém 5 para telas grandes
            spaceBetween: 17,
          },
        },
      });
      console.log(`Swiper ${index + 1} initialized successfully.`); // DEBUG
    } catch (error) {
      console.error(`Error initializing Swiper ${index + 1}:`, error); // DEBUG
    }
  });
});


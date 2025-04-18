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
        slidesPerView: 5, // Quantos slides visíveis
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
      });
      console.log(`Swiper ${index + 1} initialized successfully.`); // DEBUG
    } catch (error) {
      console.error(`Error initializing Swiper ${index + 1}:`, error); // DEBUG
    }
  });
});

// --- Funcionalidade do Carrossel (com Clonagem) ---
if (listaProdutos && setaEsquerda && setaDireita && dotsContainer) {
  const items = Array.from(listaProdutos.querySelectorAll("li"));
  const totalOriginalItems = items.length;
  const itemsVisibles = 5; // Número de itens visíveis
  const itemWidth = items[0].offsetWidth + 17; // Largura do item + gap
  let currentIndex = itemsVisibles; // Começa no primeiro item *original* após os clones
  let isTransitioning = false;
  let autoPlayInterval = null;
  const dots = dotsContainer.querySelectorAll(".dot");

  // 1. Clonar itens
  const itemsToPrepend = items
    .slice(-itemsVisibles)
    .map((item) => item.cloneNode(true));
  const itemsToAppend = items
    .slice(0, itemsVisibles)
    .map((item) => item.cloneNode(true));

  // Adicionar clones ao DOM
  listaProdutos.prepend(...itemsToPrepend);
  listaProdutos.append(...itemsToAppend);

  // 2. Ajustar posição inicial (sem transição)
  listaProdutos.style.transition = "none"; // Desabilita transição para ajuste inicial
  listaProdutos.style.transform = `translateX(${-currentIndex * itemWidth}px)`;

  // Força reflow para garantir que a transição 'none' seja aplicada antes de reativá-la
  listaProdutos.offsetHeight;

  // Reabilita a transição
  listaProdutos.style.transition = "transform 0.5s ease-in-out";

  // Função para atualizar os dots ativos (considerando apenas itens originais)
  function updateDots() {
    if (dots.length > 0) {
      const originalIndex =
        (currentIndex - itemsVisibles + totalOriginalItems) %
        totalOriginalItems;
      const activeDotIndex = Math.floor(
        originalIndex /
          Math.ceil((totalOriginalItems - itemsVisibles + 1) / dots.length)
      );

      dots.forEach((dot, index) => {
        // Garante que o activeDotIndex não exceda o número de dots
        dot.classList.toggle(
          "active",
          index === Math.min(dots.length - 1, activeDotIndex)
        );
      });
    }
  }

  // Função para mover o carrossel
  function moveCarousel(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    if (direction === "next") {
      currentIndex++;
    } else if (direction === "prev") {
      currentIndex--;
    }

    listaProdutos.style.transform = `translateX(${
      -currentIndex * itemWidth
    }px)`;
    updateDots(); // Atualiza os dots imediatamente ao iniciar o movimento
  }

  // Função para ir para um slide específico (usado pelos dots)
  function goToSlide(dotIndex) {
    if (isTransitioning) return;
    stopAutoPlay();

    const totalGroups =
      totalOriginalItems > itemsVisibles
        ? totalOriginalItems - itemsVisibles + 1
        : 1;
    const dotsPerGroup = Math.ceil(totalGroups / dots.length);
    // Calcula o índice do *primeiro item original* correspondente ao dot clicado
    const targetOriginalIndex = Math.min(
      totalOriginalItems - itemsVisibles,
      dotIndex * dotsPerGroup
    );
    // Converte para o índice global (incluindo clones prepended)
    currentIndex = targetOriginalIndex + itemsVisibles;

    isTransitioning = true;
    listaProdutos.style.transform = `translateX(${
      -currentIndex * itemWidth
    }px)`;
    updateDots();
    // isTransitioning será resetado no transitionend
  }

  // Event listener para o fim da transição (para o loop infinito)
  listaProdutos.addEventListener("transitionend", () => {
    // Verifica se chegou aos clones do final
    if (currentIndex >= totalOriginalItems + itemsVisibles) {
      listaProdutos.style.transition = "none";
      currentIndex =
        itemsVisibles +
        ((currentIndex % (totalOriginalItems + itemsVisibles)) %
          totalOriginalItems); // Volta para o item original correspondente no início
      listaProdutos.style.transform = `translateX(${
        -currentIndex * itemWidth
      }px)`;
      listaProdutos.offsetHeight; // Reflow
      listaProdutos.style.transition = "transform 0.5s ease-in-out";
    }
    // Verifica se chegou aos clones do início
    else if (currentIndex < itemsVisibles) {
      listaProdutos.style.transition = "none";
      currentIndex =
        itemsVisibles + totalOriginalItems - (itemsVisibles - currentIndex);
      // Volta para o item original correspondente no fim
      listaProdutos.style.transform = `translateX(${
        -currentIndex * itemWidth
      }px)`;
      listaProdutos.offsetHeight; // Reflow
      listaProdutos.style.transition = "transform 0.5s ease-in-out";
    }
    isTransitioning = false;
  });

  // Iniciar Autoplay
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => moveCarousel("next"), 5000);
  }

  // Parar Autoplay
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Adiciona eventos aos botões de navegação
  setaEsquerda.addEventListener("click", () => {
    moveCarousel("prev");
    stopAutoPlay();
  });
  setaDireita.addEventListener("click", () => {
    moveCarousel("next");
    stopAutoPlay();
  });

  // Adiciona eventos aos dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      // Não precisa parar autoplay aqui, pois goToSlide já para
    });
  });

  // Pausa/Reinicia autoplay no hover
  listaProdutos.addEventListener("mouseenter", stopAutoPlay);
  listaProdutos.addEventListener("mouseleave", startAutoPlay);

  // Inicializa os dots e o autoplay
  updateDots();
  startAutoPlay();
}
// --- Fim Carrossel ---

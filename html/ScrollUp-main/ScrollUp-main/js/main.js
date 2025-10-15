$(function () {
  let abertaVendidos = true;
  let abertaLancamentos = true;
  let corDominanteHex = "#8B5CF6";

  $("#btn1").addClass("aberto");
  $("#btn2").addClass("aberto");

  $("#btn1").click(function () {
    if (abertaVendidos) {
      $(".bestsellers-grid").slideUp();
      $(this).removeClass("aberto");
    } else {
      $(".bestsellers-grid").slideDown();
      $(this).addClass("aberto");
    }
    abertaVendidos = !abertaVendidos;
  });

  $("#btn2").click(function () {
    if (abertaLancamentos) {
      $(".releases-section").slideUp();
      $(this).removeClass("aberto");
    } else {
      $(".releases-section").slideDown();
      $(this).addClass("aberto");
    }
    abertaLancamentos = !abertaLancamentos;
  });

  var indiceAtual = 0;
  var slides = $(".slide");
  var indiceMaximo = slides.length;
  var delay = 30000;
  var emTransicao = false;

  initSlider();
  cliqueSlider();

  function initSlider() {
    for (var i = 0; i < indiceMaximo; i++) {
      $(".bullets-nav").append(
        `<span class="bullet-nav" data-index="${i}"></span>`
      );
    }

    slides.css("left", "100%");
    slides.eq(0).addClass("active").css("left", "0");

    atualizarCoresBulletsComBaseNaImagem();

    setInterval(function () {
      if (!emTransicao) {
        alterarSlider();
      }
    }, delay);
  }

  function cliqueSlider() {
    $(".bullets-nav").on("click", ".bullet-nav", function () {
      var novoIndice = parseInt($(this).attr("data-index"));
      if (novoIndice !== indiceAtual && !emTransicao) {
        var direcao = novoIndice < indiceAtual ? "esquerda" : "direita";
        transicionarSlide(novoIndice, direcao);
      }
    });
  }

  function alterarSlider() {
    var proximoIndice = (indiceAtual + 1) % indiceMaximo;
    transicionarSlide(proximoIndice, "direita");
  }

  function transicionarSlide(novoIndice, direcao) {
    if (emTransicao) return;
    emTransicao = true;

    var $atual = slides.eq(indiceAtual);
    var $novo = slides.eq(novoIndice);

    if (direcao === "direita") {
      $novo.css("left", "100%").addClass("active");
      $atual.animate({ left: "-100%" }, 600, function () {
        $(this).removeClass("active").css("left", "100%");
      });
      $novo.animate({ left: "0" }, 600, function () {
        emTransicao = false;
      });
    } else {
      $novo.css("left", "-100%").addClass("active");
      $atual.animate({ left: "100%" }, 600, function () {
        $(this).removeClass("active").css("left", "100%");
      });
      $novo.animate({ left: "0" }, 600, function () {
        emTransicao = false;
      });
    }

    indiceAtual = novoIndice;
    atualizarCoresBulletsComBaseNaImagem();
  }

  function atualizarCoresBulletsComBaseNaImagem() {
    const slideAtivo = slides.eq(indiceAtual)[0];
    const imagem = new Image();
    imagem.crossOrigin = "anonymous";
    imagem.src = $(slideAtivo)
      .css("background-image")
      .replace(/^url\(["']?/, "")
      .replace(/["']?\)$/, "");

    imagem.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = imagem.width;
      canvas.height = imagem.height;
      ctx.drawImage(imagem, 0, 0);

      // Analisar especificamente a região onde os bullets estão posicionados
      const regiaoBullets = analisarRegiaoBullets(ctx, canvas.width, canvas.height);
      
      // Extrair cor predominante geral da imagem
      const corPredominante = extrairCorPredominante(ctx, canvas.width, canvas.height);
      
      // Aplicar cores baseadas na análise
      aplicarCoresAdaptativas(regiaoBullets, corPredominante);
    };

    imagem.onerror = function() {
      // Fallback em caso de erro no carregamento da imagem
      aplicarCoresPadrao();
    };
  }

  function analisarRegiaoBullets(ctx, width, height) {
    // Analisar a região inferior da imagem onde os bullets estão posicionados
    const regionHeight = Math.floor(height * 0.2); // 20% inferior da imagem
    const regionY = height - regionHeight;
    
    try {
      const imageData = ctx.getImageData(0, regionY, width, regionHeight);
      const data = imageData.data;
      
      let totalR = 0, totalG = 0, totalB = 0;
      let pixelCount = 0;
      
      // Calcular cor média da região dos bullets
      for (let i = 0; i < data.length; i += 4) {
        totalR += data[i];
        totalG += data[i + 1];
        totalB += data[i + 2];
        pixelCount++;
      }
      
      const avgR = Math.round(totalR / pixelCount);
      const avgG = Math.round(totalG / pixelCount);
      const avgB = Math.round(totalB / pixelCount);
      
      return { r: avgR, g: avgG, b: avgB };
    } catch (error) {
      console.warn('Erro ao analisar região dos bullets:', error);
      return { r: 128, g: 128, b: 128 }; // Cor neutra como fallback
    }
  }

  function extrairCorPredominante(ctx, width, height) {
    try {
      const { data } = ctx.getImageData(0, 0, width, height);
      const cores = {};

      // Amostragem reduzida para melhor performance
      const step = 4; // Analisar a cada 4 pixels
      
      for (let i = 0; i < data.length; i += 4 * step) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const { h, s, l } = rgbToHsl(r, g, b);
        
        // Filtrar cores muito escuras, claras ou sem saturação
        if (l < 0.15 || l > 0.85 || s < 0.25) continue;

        const hRound = Math.round(h * 10) * 10; // Agrupar cores similares
        const sRound = Math.round(s * 10) * 10;
        const lRound = Math.round(l * 10) * 10;

        const chave = `${hRound}-${sRound}-${lRound}`;

        if (!cores[chave]) {
          cores[chave] = {
            count: 0,
            r,
            g,
            b,
            s,
            l
          };
        }

        cores[chave].count++;
      }

      // Encontrar a cor mais representativa
      let corFinal = null;
      for (const key in cores) {
        if (!corFinal || 
            cores[key].count > corFinal.count || 
            (cores[key].count === corFinal.count && cores[key].s > corFinal.s)) {
          corFinal = cores[key];
        }
      }

      // Fallback para cor padrão se nenhuma cor foi encontrada
      if (!corFinal) {
        corFinal = { r: 150, g: 150, b: 150 };
      }

      return corFinal;
    } catch (error) {
      console.warn('Erro ao extrair cor predominante:', error);
      return { r: 150, g: 150, b: 150 }; // Cor padrão
    }
  }

  function aplicarCoresAdaptativas(regiaoBullets, corPredominante) {
    // Calcular luminância da região dos bullets usando a fórmula WCAG
    const luminanciaRegiao = calcularLuminanciaWCAG(
      regiaoBullets.r, 
      regiaoBullets.g, 
      regiaoBullets.b
    );
    
    // Determinar cores dos bullets baseado no contraste
    let corBulletAtivo, corBulletInativo;
    
    if (luminanciaRegiao > 0.5) {
      // Região clara - bullets escuros
      corBulletAtivo = '#000000';
      corBulletInativo = 'rgba(0, 0, 0, 0.6)';
    } else {
      // Região escura - bullets claros
      corBulletAtivo = '#FFFFFF';
      corBulletInativo = 'rgba(255, 255, 255, 0.6)';
    }

    // Aplicar cores aos bullets
    $(".bullet-nav").each(function (index) {
      if (index === indiceAtual) {
        $(this).css({
          backgroundColor: corBulletAtivo,
          opacity: 1,
          border: `2px solid ${corBulletAtivo}`,
          transform: 'scale(1.2)',
          transition: 'all 0.3s ease'
        });
      } else {
        $(this).css({
          backgroundColor: corBulletInativo,
          opacity: 0.8,
          border: `1px solid ${corBulletInativo}`,
          transform: 'scale(1)',
          transition: 'all 0.3s ease'
        });
      }
    });

    // Atualizar variáveis CSS com a cor predominante
    const { r, g, b } = corPredominante;
    const cor = `rgba(${r}, ${g}, ${b}, 1)`;
    const corComAlpha = `rgba(${r}, ${g}, ${b}, 0.6)`;

    document.documentElement.style.setProperty("--cor-dinamica", cor);
    document.documentElement.style.setProperty("--cor-dinamica-shadow", corComAlpha);

    // Calcular luminância da cor predominante para determinar cor do texto
    const luminanciaCorPredominante = calcularLuminanciaWCAG(r, g, b);
    
    // Definir cor do texto baseada na luminância da cor dinâmica
    let corTexto;
    let grossura;
    if (luminanciaCorPredominante > 0.2) {
      // Cor clara - texto preto
      corTexto = '#000000';
      grossura = 'bold';
    } else {
      // Cor escura - texto branco
      corTexto = '#FFFFFF';
      grossura = 'normal';
    }

    // Aplicar a cor do texto como variável CSS
    document.documentElement.style.setProperty("--cor-texto-dinamica", corTexto);
    document.documentElement.style.setProperty("--peso-texto-dinamica", grossura);
  }

  function aplicarCoresPadrao() {
    // Aplicar cores padrão em caso de erro
    $(".bullet-nav").each(function (index) {
      if (index === indiceAtual) {
        $(this).css({
          backgroundColor: '#FFFFFF',
          opacity: 1,
          border: '2px solid #FFFFFF',
          transform: 'scale(1.2)'
        });
      } else {
        $(this).css({
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          opacity: 0.8,
          border: '1px solid rgba(255, 255, 255, 0.6)',
          transform: 'scale(1)'
        });
      }
    });
  }

  function calcularLuminanciaWCAG(r, g, b) {
    // Converter para valores entre 0 e 1
    r = r / 255;
    g = g / 255;
    b = b / 255;

    // Aplicar correção gamma
    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    // Calcular luminância relativa
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h, s, l };
  }
});
const linkCertificados = document.getElementById('certificados');
const modalCertificados = document.getElementById('modalCertificados');

const btnContato = document.getElementById('btnContato');
const modalContato = document.getElementById('modalContato');

btnContato.addEventListener('click', () => {
    modalContato.style.display = 'flex';
});

linkCertificados.addEventListener('click', function(event) {
    event.preventDefault();
    modalCertificados.style.display = 'flex';
});

window.addEventListener('click', function(event) {
    if (event.target === modalCertificados) {
        modalCertificados.style.display = 'none';
    }
    if (event.target === modalContato) {
        modalContato.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const iframe = document.getElementById('iframe-modal');
    const cards = document.querySelectorAll('.card-projeto');
  
    // --- Abrir modal ao clicar no card ---
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const link = card.dataset.src;
        if (!link) {
          alert('Projeto ainda não disponível ou sem data-src configurado.');
          return;
        }
  
        iframe.src = link;
        modal.style.display = 'flex';
        document.body.classList.add('modal-aberto'); // bloqueia scroll do body
      });
    });
  
    
    // --- Função de fechar modal ---
    function fecharModal() {
      modal.style.display = 'none';
      iframe.src = ''; // limpa iframe pra não deixar rodando nada
      document.body.classList.remove('modal-aberto'); // reativa scroll do body
    }
  
   
  
 
    window.addEventListener('click', (e) => {
      if (e.target === modal) fecharModal();
    });
  
    // --- Fechar pelo ESC ---
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') fecharModal();
    });
  });
  
const btnWhats = document.getElementById('whatsapp');
btnWhats.addEventListener('click', () => {
    window.open('https://wa.me/5547989132699', '_blank');
});

const btnEmail = document.getElementById('email');
btnEmail.addEventListener('click', () => {
    window.open('mailto:viniciusg21bezerra@gmail.com', '_blank');
});

const btnLinkedin = document.getElementById('btnLinkedin');
btnLinkedin.addEventListener('click', () => {
    window.open('https://www.linkedin.com/in/vinicius-bezerra-339a6b326/', '_blank');
});

const btnCurriculo = document.getElementById('btnCurriculo');
btnCurriculo.addEventListener('click', () => {
    window.open('../assets/Vinicius_Bezerra.pdf', '_blank');
});
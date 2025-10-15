const uploadBtn = document.getElementById('upload-btn');
const inputUpload = document.getElementById('imagem-upload');

uploadBtn.addEventListener('click', () => {
    inputUpload.click();
});

function lerConteudoDoArquivo(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => {
            resolve({ url: leitor.result, nome: arquivo.name })
        }

        leitor.onerror = () => {
            reject(`Erro na leitura do arquivo ${arquivo.name}`)
        }

        leitor.readAsDataURL(arquivo);
    })
}

const imagemPrincipal = document.getElementById('main-imagem');
const nomeDaImagem = document.querySelector('.container-imagem-nome p');

inputUpload.addEventListener('change', async (evento) => {
    const arquivo = evento.target.files[0];

    if (arquivo) {
        try {
            const conteudoDoArquivo = await lerConteudoDoArquivo(arquivo);
            imagemPrincipal.src = conteudoDoArquivo.url;
            nomeDaImagem.textContent = conteudoDoArquivo.nome;
        }
        catch (erro) {
            console.error('Erro ao ler o arquivo:', erro);
        }
    }
})

const inputTags = document.getElementById('input-tags');
const listaTags = document.getElementById('lista-tags');


listaTags.addEventListener('click', (evento) => {
    if (evento.target.classList.contains('remove-tag')) {
        const tagRemovida = evento.target.parentElement;
        listaTags.removeChild(tagRemovida);
    }
})


const tagsDisponiveis = ["Front-end", "Back-end", "Design", "UX e UI", "Data Science", "Mobile", "Inovação e Gestão", "HTML", "CSS", "JavaScript", "PHP", "Python", "Ruby", "Java", "C++", "C#"];

async function verificaTagsDisponiveis(tagTexto) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(tagsDisponiveis.includes(tagTexto));
        }, 100);
    })
}

inputTags.addEventListener('keypress', async (evento) => {
    if (evento.key === "Enter") {
        evento.preventDefault();
        const tagTexto = inputTags.value.trim();
        if (tagTexto !== "") {
            try {
                const tagExiste = await verificaTagsDisponiveis(tagTexto);
                if (tagExiste) {

                    const tagNova = document.createElement('li');
                    tagNova.innerHTML = `<p>${tagTexto}</p><img src="img/close-black.svg" alt="icone para remover tag" class="remove-tag"> `;
                    listaTags.appendChild(tagNova);
                    inputTags.value = "";
                } else {
                    alert('Tag não encontrada!');
                }
            } catch (erro) {
                console.error('Erro ao verificar as tags disponíveis:', erro);
                alert('Erro ao verificar as tags disponíveis. Verifique o Console');
            }
        }
    }
})

const botaoPublicar = document.querySelector('.botao-publicar');

botaoPublicar.addEventListener('click', async (evento) => {
    evento.preventDefault();

    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const tagsProjeto = Array.from(document.querySelectorAll('.lista-tags li')).map(tag => tag.textContent);

    console.log('Nome:', nome);
    console.log('Descrição:', descricao);
    console.log('Tags:', tagsProjeto);
    
})

async function publicarProjeto(nome, descricao, tagsProjeto) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const DeuCerto = Math.random() < 0.5;

            if (DeuCerto) {
                resolve("Projeto publicado com sucesso!");
            } else {
                reject("Ocorreu um erro ao publicar o projeto.");
            }
        }, 2000)
    })
    
}
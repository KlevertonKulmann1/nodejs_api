const express = require("express");
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;
const path = require('path');

app.use(express.json());

const filePath = path.join(__dirname, 'cardapio.json');

const salvarPratos = (pratos) => {
    fs.writeFileSync(filePath, JSON.stringify(pratos, null, 2));
};

const lerPratos = () => {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};
  
app.get("/", (req, res) => {
  res.send("Servidor Node.js rodando no GitHub Codespaces!");
});

// Cadastra pratos
app.post('/item_cardapio', (req, res) => {
    const { nome, descricao, preco, estoque, categoria } = req.body;
    const pratos = lerPratos();
    const novoPrato = {
      id: pratos.length ? pratos[pratos.length - 1].id + 1 : 1,
      nome,
      descricao,
      preco,
      estoque,
      categoria,
    };
    pratos.push(novoPrato);
    salvarPratos(pratos);
    res.status(201).json(novoPrato);
});
  
// Lista prato por nome
app.get('/item_cardapio', (req, res) => {
    const { nome } = req.query;
    const pratos = lerPratos();
    const filtrados = nome ? pratos.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase())) : produtos;
    res.json(filtrados);
});
  
// Atualiza um prato por ID
app.put('/item_cardapio/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, categoria } = req.body;
    const pratos = lerPratos();
    const index = pratos.findIndex(p => p.id == id);
    if (index === -1) return res.status(404).json({ message: 'Prato não encontrado' });
    
    pratos[index] = { ...pratos[index], nome, descricao, preco, estoque, categoria };
    salvarPratos(pratos);
    res.json(pratos[index]);
});
  
// Deleta um prato por ID
app.delete('/item_cardapio/:id', (req, res) => {
    const { id } = req.params;
    let pratos = lerPratos();
    const novoPratos = pratos.filter(p => p.id != id);
    if (novoPratos.length === pratos.length) return res.status(404).json({ message: 'Prato não encontrado' });
    
    salvarPratos(novoPratos);
    res.json({ message: 'Prato deletado com sucesso' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
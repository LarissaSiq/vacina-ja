# 📱 Vacina Já

**Vacina Já** é um aplicativo mobile desenvolvido com React Native e Expo, criado para facilitar o controle de vacinação de famílias — especialmente crianças e idosos — permitindo o cadastro, visualização e gerenciamento de vacinas.

> Projeto desenvolvido por **Larissa Siqueira Silva** como parte da disciplina *Programação para Dispositivos Móveis em Android — 2025.1 EAD.

---

## 🩺 Problema

Muitas pessoas esquecem as datas de vacinação ou perdem a carteirinha, o que leva a atrasos e riscos à saúde. O **Vacina Já** surge como uma solução prática, digital e acessível para ajudar no controle vacinal familiar.

---

## 🎯 Objetivos

- ✅ Desenvolver um app Android funcional com React Native + Expo;
- ✅ Permitir cadastro, edição e exclusão de vacinas;
- ✅ Oferecer uma navegação simples e intuitiva;
- ✅ Armazenar os dados localmente (offline) com Async Storage;
- ✅ Auxiliar na organização e cumprimento do calendário vacinal.

---

## 🛠️ Tecnologias Utilizadas

- React Native
- Expo
- Async Storage
- TypeScript
- Visual Studio Code
- Git & GitHub

---

## 🧩 Funcionalidades

- Cadastro de usuário
- Login
- Registro de vacinas
- Listagem e edição de vacinas
- Exclusão de vacinas
- Armazenamento local (sem internet)
- Interface amigável e acessível

---

## 📸 Evidências do App

|🔐 Tela de Login|🔐 Tela de Cadastro|🏠 Tela Inicial|📝 Tela de Cadastro de Vacinas|📋 Tela de Listagem de Vacinas|
|:--:|:--:|:--:|:--:|:--:|
|<img width="480" alt="Login" src="https://github.com/user-attachments/assets/040f6f1a-e271-4623-8975-10e48a73ecf5" />|<img width="479" alt="Cadastro" src="https://github.com/user-attachments/assets/680dadb6-186c-472f-84f3-5c9e4682947c" />|<img width="478" alt="Tela-Inicial" src="https://github.com/user-attachments/assets/e8dddf4f-94c9-4f91-9d00-54a73045ac77" />|<img width="483" alt="Cadastro-Vacina" src="https://github.com/user-attachments/assets/8b788b13-665c-41f2-bcec-be3cff21ea47" />|<img width="478" alt="Listagem-Vacinas" src="https://github.com/user-attachments/assets/4e3d9ad5-c530-4a4f-9b05-93eaff289aba" />|


### 🎥 Demonstração em Vídeo
![Jun-08-2025 04-58-43](https://github.com/user-attachments/assets/78e360da-30d8-4af5-b5ad-bf5a46e3f7d3)


---

## 📁 Estrutura do Projeto

```bash
📦vacina-ja
 ┣ 📂src  
 ┃ ┣ 📂pages  
 ┃ ┃ ┣ 📜Login.tsx  
 ┃ ┃ ┣ 📜Cadastro.tsx  
 ┃ ┃ ┣ 📜Home.tsx  
 ┃ ┃ ┣ 📜CadastroVacina.tsx  
 ┃ ┃ ┗ 📜Vacinas.tsx
 ┃ ┣ 📂routes
 ┃ ┃ ┗ 📜index.tsx 
 ┣ 📜App.tsx  
 ┣ 📜app.json  
 ┣ 📜declarations.d.ts  
 ┣ 📜index.ts  
 ┣ 📜package.json  
 ┣ 📜package-lock.json  
 ┣ 📜tsconfig.json  
 ┣ 📜yarn.lock  
 ┗ 📜README.md  

# 1. Imagem Base.
FROM node:20-alpine

# 2. Diretório de Trabalho.
WORKDIR /app

COPY . .

# 3. Instala as dependências.
RUN npm install

# 4. Corrige qualquer inconsistência de versão.
RUN npx expo install --fix

# 5. Instala o ngrok para o túnel.
RUN npm install -g @expo/ngrok@^4.1.0

# 6. Expõe as portas que o Expo utiliza.
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002


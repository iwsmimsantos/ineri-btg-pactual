
    FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
    WORKDIR /src
    
    # Copia e restaura as dependências de forma genérica
    COPY ["INERI.API.csproj", "./"]
    RUN dotnet restore
    
    COPY . .
    
    # Publica a aplicação
    RUN dotnet publish "INERI.API.csproj" -c Release -o /app/publish
    
    FROM mcr.microsoft.com/dotnet/aspnet:9.0
    WORKDIR /app
    
    # Copia os arquivos publicados do estágio de build
    COPY --from=build /app/publish .
    
    COPY libduckdb.so /app/
    
    # Expor as portas
    EXPOSE 80
    EXPOSE 443
    
    # Ponto de entrada para rodar a aplicação
    ENTRYPOINT ["dotnet", "INERI.API.dll"]
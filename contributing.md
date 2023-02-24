# Contributing

Se você chegou até aqui é porque tem interesse em contribuir com a biblioteca. Fico muito feliz por isso. Obrigado.
A seguir você vai encontrar mais detalhes sobre a estrutura de pastas, padrão de branch e como fazer seu pull request no repositório.

# Clone and Pull Request

- Faça um clone do repositório `express-rate-limit-core` em seu computador.

  ```shell
    ## SSH
   -> your-workdir: git clone git@github.com:JeffersonGibin/express-rate-limiter-core.git

   ## HTTPS
    -> your-workdir: git clone https://github.com/JeffersonGibin/express-rate-limiter-core.git
  ```

# Branch

Antes de começar a codificar uma mudança, bug, melhoria ou feature considere a seguinte definição.

- Certifique-se que você está com as ultimas alterações da branch `main` em seu computador.
- Novas branchs devem ser criadas a partir da branch `main`.

- Correção de Bugs: correção de bugs `bugfix/<your-definition>`
- Nova Funcionalidade: desenvolvimento de novas funcionalidades `hotfix/<your-feature-name>`
- Refatoração: (refatoração de código) `hotfix/<your-definition>`
- Correções urgentes: correção de bugs urgentes `hotfix/<your-definition>`

  ```shell
  -> express-rate-limiter-core git:(main): git checkout -b <prefix>/<your-definition-name>
  ```

# Directories

A seguir será explicado o conceito dos principais diretórios da aplicação.

```
express-rate-limit-core
  ├── src/
  │  ├── app/
  │  ├── core/
  │  ├── shared/
  │  └── utils/
```

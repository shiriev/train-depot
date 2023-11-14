FROM codercom/code-server:latest

USER root

# sudo apt install -y curl
# curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash -
ARG NODE_MAJOR=20



RUN apt-get update -y && \
    apt-get install -y \
#        ca-certificates \
#        gnupg \
        gpg \
#        apt-utils \
        && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update -y && \
    apt-get install nodejs -y -f && \
#    apt-get install -y \
#        software-properties-common \
#        npm && \
    npm install -g \
        yarn \
        typescript

RUN sudo code-server --install-extension \
    orta.vscode-jest

USER coder
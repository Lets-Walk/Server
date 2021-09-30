# Lets-Walk Server

## Server 실행 방법

Docker를 이용하므로 Docker와 Docker-Compose가 설치되어 있어야함.<br>
`Docker for Windows` 나 `Docker for Mac` 을 설치하면 Docker-compose는 자동 설치됨.<br>
콘솔에 `docker-compose -v` 를 입력했을 때 버전명이 제대로 뜨면 실행 가능

1. `git clone https://github.com/Lets-Walk/Server.git`
2. `cd Server && yarn`
3. `docker-compose up`

서버를 끄려면 `docker-compose down` 입력

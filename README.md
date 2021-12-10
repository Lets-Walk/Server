<div align="center">
    <img src="https://user-images.githubusercontent.com/76427521/146710279-14923195-3b7d-48eb-ae60-aa8e30158e41.png" width="220" height="220">
</div>

<div align="center">
    <h2>워크투게더</h2>
    대학 대항전 걷기운동 독려 애플리케이션
</div>
<br>

## 📋 프로젝트 소개

- ‘워크투게더(WalkToGather)’는 코로나19의 장기화로 인해 일상생활이 제한되고 비대면 수업이 지속되는 상황 속에서 대학생들의 신체 건강과 정서적 어려움에 도움을 주고자 만들게 된 서비스입니다. 전국의 대학생을 위한 “대학 대항전 걷기운동 앱” 으로 ‘함께 걷다(Walk Together)’와 ‘모으기 위해 걷다(Walk To Gather)’라는 두가지 의미를 가지고 있습니다.

- ‘워크투게더’는 누구나 쉽게 접근할 수 있는 걷기 운동을 게임과 접목시켜 사용자들은 보다 재미있게 운동에 참여할 수 있습니다. 또한 같은 대학 구성원들과 함께 게임을 진행하는 “대학 대항전” 시스템을 통해 코로나로 인한 대학 소속감 저하 문제를 해결할 수 있을 것으로 기대합니다.

- 사용자는 소속 대학의 이메일 인증으로 회원가입을 할 수 있습니다. 그리고 자신이 원하는 시간, 원하는 장소에서 ‘크루매칭’을 시작하면 자신을 포함하여 같은 대학 4명으로 구성된 ‘워킹크루’가 자동으로 매칭됩니다. 이후 상대 크루를 탐색하는 ‘배틀매칭’ 단계 후에 ‘워킹모드’가 시작됩니다. ‘워킹모드’가 시작되면 서버로부터 받은 미션을 상대 크루보다 먼저 성공해야 합니다. 먼저 미션을 성공하여 상대 크루의 LIFE를 모두 깎은 크루가 최종승리하게 됩니다. 배틀이 끝나고 나면 배틀의 결과가 소속 대학의 점수에 실시간으로 반영된 대학 랭킹을 확인할 수 있습니다.

- ‘워크투게더’는 개인간의 경쟁만을 지원하는 타 서비스들과는 달리 대학이라는 단체에 소속되어 매 워킹모드의 승점을 통해 대학 랭킹에 기여할 수 있습니다. 주어진 미션을 상대 보다 먼저 수행하기 위해 크루원과 협동하여 전략을 세우다 보면 어느새 운동 보다는 게임을 하고 있는 것처럼 빠져들게 될 것입니다.
  <br>

## 👨‍👦‍👦 팀원 소개

| <img alt="박종혁" src="https://avatars.githubusercontent.com/u/76427521?v=4" height="80"/> | <img alt="윤진호" src="https://avatars.githubusercontent.com/u/79308015?v=4" height="80"/> | <img alt="이주영" src="https://avatars.githubusercontent.com/u/74705447?v=4" height="80"/> |
| :----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: |
|                            [박종혁](https://github.com/jjonyo)                             |                          [윤진호](https://github.com/jhyoon9705)                           |                          [이주영](https://github.com//jjjuurang)                           |
|                                     Backend + Frontend                                     |                                       Frontend + UI                                        |                                     UI + Data research                                     |

<br>

## 🛠 사용 기술

프론트엔드 : React Native, RN Naver map, Socket.io-Client

백엔드 : Node.js(TypeScript), Express, Sequelize, Postgresql, Docker, Socket.io

배포 : AWS EC2

협업 : Github, Notion, Slack, Trello, Figma

<br>

## 🖥 결과물

![슬라이드1](https://user-images.githubusercontent.com/76427521/146711801-dd82bb91-19e3-4356-bbd8-ab0ee7c4bf66.png)
![슬라이드2](https://user-images.githubusercontent.com/76427521/146711805-868c3c79-cbdf-42de-a58d-ac449de69429.png)
![슬라이드3](https://user-images.githubusercontent.com/76427521/146711815-3590709c-7255-41ae-9d8c-7264fbc869fd.png)
![슬라이드4](https://user-images.githubusercontent.com/76427521/146711818-deb67478-c1d3-46a9-ac41-345a4e97117c.png)
![슬라이드5](https://user-images.githubusercontent.com/76427521/146711820-cb241f56-e82b-4e48-9318-2059b9464221.png)
![슬라이드6](https://user-images.githubusercontent.com/76427521/146711821-ed0326b4-5c5a-4383-9030-08f02df3ee5b.png)
![슬라이드7](https://user-images.githubusercontent.com/76427521/146711823-79ec19a5-b7f0-4aa1-b0bc-fb1a3a9367d4.png)
![슬라이드8](https://user-images.githubusercontent.com/76427521/146711824-13c93df1-1f4b-4940-b3a6-ba85f279df0e.png)
![슬라이드9](https://user-images.githubusercontent.com/76427521/146711826-b5c2bf7b-4ee9-4f0f-a12f-eb3c6fd9c238.png)

## Server 실행 방법

Docker를 이용하므로 Docker와 Docker-Compose가 설치되어 있어야함.<br>
`Docker for Windows` 나 `Docker for Mac` 을 설치하면 Docker-compose는 자동 설치됨.<br>
콘솔에 `docker-compose -v` 를 입력했을 때 버전명이 제대로 뜨면 실행 가능

1. `git clone https://github.com/Lets-Walk/Server.git`
2. `cd Server && yarn`
3. `docker-compose up`

서버를 끄려면 `docker-compose down` 입력

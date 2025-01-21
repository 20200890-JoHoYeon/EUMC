# 이화의료원 백앤드 중계서버

### 참고사항
- Node js
- Nest JS
- TypeScript
- yarn package  manager

## 프로젝트 정보

### 사용 프레임워크 & 패키지
[Nest](https://github.com/nestjs/nest) 프레임워크 사용.  
기본적인 사용법은 [Document](https://docs.nestjs.com) 참고    

##### controller 추가
```bash
$ nest g controller(or co) controllers/컨트롤러이름
```
##### service 추가
```bash
$ nest g service(or s) services/서비스이름
```

module 추가
```bash
$ nest g module(or m) module/모듈이름
```

class 추가
```bash
$ nest g class(or c) 경로/클래스이름
```

기본 REST API 추가
```bash
$ nest g resource(or res) 경로/API이름
```


### 주요 버전 정보
전체 패치키 정보는 package.json을 참고

| #   | 이름     | 버전       | 기타  |
|-----|--------|----------|:---:|
| 1   | NodeJS | v18.13.0 |  -  |
| 2   | NestJs | 9.1.9    |  -  |
| 3   | Yarn   | 1.22.17  |  -  |



### 외부 모듈 및 라이브러리
| #   | 이름  | 버전  | 링크  | 기타  |
|-----|-----|-----|-----|-----|
| 1   | -   | -   | -   | -   |


---

## 사전환경 설정 - DB 설치 및 구동
```bash
# docker 및 docker-compose 설치 후 아래 명령어로 구동
$ docker-compose up -d
```

## 프로젝트 설치/실행/배포

### 설치
````bash
# nest cli 설치
$ npm i -g @nestjs/cli

# yarn이 설치되어 있지 않다면
$ npm i -g yarn

# 패키지 설치
$ yarn install

# yarn 으로 패키지 추가할 때(npm i --save와 동일)
$ yarn add 패키지명

````

### 실행
프로젝트 실행 전 app.module.ts의 DB관련
synchronize 값 설정에 유의
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### 배포
```bash

```

## 카카오페이 결제 관련
iOS에서는 info > Queried URL Schemes > kakaotalk
추가 필요.


## 프로젝트 이슈
**package.json의 devDependency**에 ts-jest": "29.0.3 제거.  
패키지 설치가 안됨. Repo가 이상한듯.   
https://velog.io/@jay13jeong/NestJs-pkg-%EC%84%A4%EC%B9%98-%EC%98%A4%EB%A5%98-%ED%95%B4%EA%B2%B0

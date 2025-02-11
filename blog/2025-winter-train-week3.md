# 2025 Winter Train Week 3
> [!NOTE]
> 下列实验未经过完整测试，可能会有坑点之类未能点明，麻烦各位多多交流

## （Optional）部署一个 OpenFaaS
> 已有OpenFaaS环境的同学可以跳过这一步用现成的
### Option 1 faasd, 在裸机环境下安装

https://github.com/openfaas/faasd/#deploy-faasd-ce

```
git clone https://github.com/openfaas/faasd --depth=1
cd faasd
./hack/install.sh
```

### Option 2 OpenFaaS CE, 在k8s环境下安装

https://docs.openfaas.com/deployment/kubernetes/

## 部署一个自定义Rust函数 - Try with faas-cli

如果你不是在安装了faasd的服务器上开发自定义函数，而是在本地，OpenFaaS提供了一套工具 faas-cli 帮助快速开发给定模板的应用。

### 部署 faas-cli
In linux/macOS, just run
```sh
curl -sSL https://cli.openfaas.com | sudo -E sh
```

### 获取 Rust 模板
既然要自定义写，那当然是 R 门走起啦！

> 本节参考 
> - https://docs.openfaas.com/languages/custom/
> - https://github.com/openfaas-incubator/rust-http-template

```
mkdir fn-echo-rs && cd fn-echo-rs
faas-cli template pull https://github.com/openfaas-incubator/rust-http-template
```
```
$ faas new --list
Languages available as templates:
- rust
- rust-http
```
```
faas-cli new --lang rust-http echo
```
你会获得一个类似这样的目录结构：
```
.../fn-echo-rs$ tree -d
.
├── echo # 代码
│   ├── Cargo.toml
│   └── src
│       └── lib.rs
├── stack.yaml
└── template
    └── ... # 即刚才Pull下来的两个template
```
### 编写业务代码，配置项目
现在，将echo内的模板代码，更换为echo-server的代码

> [!TIP]
> 用的较老的 hyper 库，因此与 [官网echo示例](https://hyper.rs/guides/1/server/echo/) 有所出入，考验 solving 能力！

为了发布镜像，我们还得修改我们的stack.yaml
```yaml
version: 1.0
provider:
  name: openfaas
  gateway: http://gateway.openfaas.local # your gateway
functions:
  echo:
    lang: rust-http
    handler: ./echo
    image: samuka007/echo:latest # your repository
```

### 构建，推送，部署

构建镜像，推送到docker
> [!WARNING]
> 记得先连接至docker registry
```sh
DOCKER_BUILDKIT=1 faas-cli build
faas-cli push -f stack.yaml
```

登录并部署到你的faas网关
```sh
faas-cli login --gateway <your gateway url> --password <your password>
faas-cli deploy
```

部署结果
```text
Deploying: echo.
WARNING! You are not using an encrypted connection to the gateway, consider using HTTPS.

Deployed. 202 Accepted.
URL: http://gateway.openfaas.local/function/echo
```

> [!TIP]
> 后续重新部署只需要 `build` `push` 再 `deploy` 就行了

效果
```
curl $ http://gateway.openfaas.local/function/echo -d "hello"
hello
```


# 后记
不包括 faasd 的部署时间，写者用了约1个小时摸清楚 OpenFaaS 是个怎么开发流程，你也来试试吧（

你也可以尝试使用图形化界面部署~
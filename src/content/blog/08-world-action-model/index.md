---
title: "Note | World (Action) Model"
description: "一点 VLA/WAM 随笔"
date: "May 27 2026"
---

## VLA 比起 LLM 是金鱼，只有一刻记忆

> 朴素VLA的实现是时间轴上的一条条竖起来的注意力sequence

首先我们都有对 LLM 很朴素的理解：文字从左到右排布，next token在偏置上由前面所有序列token所条件。这被建模为因果注意力，应用到LLM上。然而文字的从左到右的生成与阅读过程并不只是一个朴素或统一的“因果”——它还可以包含了某种时序，并且是不均匀的。直觉上来理解的话，我们可以说，一个较长序列的文字的生成是会蕴含时序关系在里面的，比如说一个对话它以一个有限的速度产生一个sequence，但理解对话本身并不需要遵循这个时序的绝对速度，我们只需要尊重他们的相对逻辑关系就可以理解这段话；也可以说，一段文字他也可以完全不包含时序，比如说明书，描述一个零件的绝对静态的功能与状态，或者描绘精确的一刻画面。也就是说，文字里含有的基于时间概念的因果，对于模型来说不是一个可以天然定量（被显示建模）的东西，他只能定性（因果）而不能定量（时间）。超级大参数的模型可能能从人类的只言片语中总结出比较粗粒度的时间感，但是并不是一个能直接服务于高频闭环任务的智能。

而 VLA 的实现更加幽默一点。不同于我一开始直觉上的实现，VLA的每一帧（刻）的推理是独立的，并不是说 `[ vvv lll aaa vvv lll aaa ]` 这样做的，而是 `[ vvv lll aaa ] [ vvv lll aaa ]`。不过细想也是，如果像前者那样，这注意力设计起来 make no sense （或者设计出来实际上和后者一样（具体为什么呢？我现在也没想清楚），或者计算量太大了（前面随便整两帧动作都成百上千 token 了）。那像后者那样的话我们就只能给自己加上 马尔可夫 安慰剂说前面的 `[ vvv ]` 已经够我们推断出 action 来了（事实是像 [RoboMME] 那样的任务一碰就碎）。Naive VLA 这样的实现，无疑 一是没有 ultilize 原先 LLM 中隐含的时序建模（虽然可能也没卵用，根据我用coding agent的经验），二也没有“刻与刻”之间的记忆，每一刻模型都只能根据自己观测到的瞬间来估计自己的历史 trajectory 并做下一步行动。

## Memory VLA

Memory VLA 就是帮 Naive VLA 加上外置大脑。Memory VLA 有不少文章，但总的来说个人归类为两类：

1. 记忆的 embed 空间层级上的 proxy 交互，“外源性外置记忆”。最直观的就是 [RoboMME] 中的 Symbolic Memory，以及一些通过光流/建模/标记等形式注入人类偏置构建的表征的方法（笔者不懂，笔者还不会玩数据）。这种方式的记忆更像是翻到了前人的笔记从而知道了现在自己要干嘛。

2. 记忆的 embed 空间层级上的 latent 注入，“内源性外置记忆”。[RoboMME] Perceptual Memory 就是最朴素的原义保留；它的 Recurrent Memory 和 [AVA-VLA] 的记忆就是自己运行过程中压缩出来的latent weight，直接读就行；[KV-Efficient VLA] 把历史vision 信息压缩到一个token来做注意力；[RB-VLA] 则是额外的一个单独的SSM学会递归地生成一个belief token用于action解析。本质上都是将历史观测压缩进一小块紧凑的空间用于参考。

（[TacMamba] 则是完全 SSE 的实现了，transformer 是因为本身实现了很强的 performance 所以才让 SSE 很难从 0 scale 到一个比肩 transformer 的准确性，那 VLA 这个众生平等的起点 SSE 有没有可能反超呢？）

（其实2的实现是不是全部都可以等效成一个外置RNN）

根据 LLM 的 Memory 和 SSM 方面的个人理解，我大胆推测 SSM 只能起到锦上添花而不是雪中送炭的作用。参考蚂蚁 [AHN] 和 Google 的 [Titans]。

## WAM

还没开始研究，感觉有意义的论文有几个

[Fast-WAM] 消融了 视频DiT 训练时由视频监督出来的某种（时序编码？）能力 对 Action 的准确生成更加重要，而不是 视频DiT 去噪未来预测时 Action DiT 能从对去噪ing的vision token中反推出好的动作。

- Continuous Latent Diffusion Language Model https://arxiv.org/abs/2605.06548v1
- TextLDM: Language Modeling with Continuous Latent Diffusion https://arxiv.org/abs/2605.07748v1

26年5月初前后两天发的，压缩即智能，但是不是直接压缩进 SSE 那样的不可解释的 latent space，而是先学会将VAE压缩出来的语义进行验证（即，我不仅要语义出来，我还要你离散的多余的低密度信息被省略，这两篇文章一篇通过3种loss约束latent特性，一篇通过直接和现有embed进行对齐），然后再把这个高密度latent space丢给 DiT 去解码。

> 链接以后补

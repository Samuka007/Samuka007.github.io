---
title: "Read | World Model for Scaling Robot On Policy Training Data"
description: "World model 除了当生成器和评估器，还可以用来 scale on policy 数据"
date: "May 12 2026"
---

> *Hi-WM: Human-in-the-World-Model for Scalable Robot Post-Training*
>
> https://arxiv.org/abs/2604.21741

**INSIGHT** world model 除了当生成器和评估器，还可以在OPD中用来 scale on policy 数据（by human in the loop in this case）

Play it: https://hi-wm.github.io/

### Main
把 human-in-the-loop 从物理世界搬到世界模型里。Policy 在 World Model 里闭环 rollout，人类在观察到轨迹崩溃的时候介入，提供修正动作，然后 world model 继续预测。因为状态可以缓存，一个失败点可以回滚后分支成多条修正轨迹，**高密度地收集失败状态周围的监督信号**。

其中对于干预流程：人类输入连续动作 → 世界模型在潜在空间做状态转移 → 解码出下一帧 → Policy 继续

### Tech Detail
WM: visual encoder → latent dynamics → visual decoder from scratch
Action: 14 维连续控制信号（双臂各 6DoF 位姿 + 夹爪）

键盘、机械臂或 VR 控制器 -> action空间

### Limit
人类输入修正动作仅教会 policy 如何在 easy fail case success (online policy). 如果当前状态已经是 world model 没见过的 edge case，需要用真实 dataset 来覆盖

> §4.2 without edge-case data, the model exhibits clear positioning errors in several boundary regions, and the realized end-effector position deviates from the target specified in the world mode
> 
> After augmentation, these errors are substantially reduced, and physical execution becomes much better aligned with the target.
> 
> adding edge-case data at only about 30% of the regular-scene data volume already yields clear gains

i.e. Hi-WM only scale sweet point, but the scale of sweet point ( and the "easy to predict but hard for action model to output correct policy - that's the juicy point ) already make the model performs way better.

### 实验
> Base 42-76%，Hi-WM 92-100%
> 
> WM-CL（无人类干预，只收集 world model 里的成功轨迹）已经提升了约 19%，Hi-WM 再提升约 19%。作者的解释是 WM-CL 只是重复教 policy 已经会的东西，Hi-WM 教它不会的东西。

Iteration 1 加了约 20% 的虚拟干预数据，Iteration 2 累积到 35%。至少一部分提升来自 scale 而不完全是 OPD


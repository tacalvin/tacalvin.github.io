---
title: "Mixcompress"
date: 2026-07-17T17:29:22-07:00
draft: false
toc: true
images:
tags:
  - research
---

## Research Report: MixCompress: Mixture of Experts for Variable Rate Learned Image Compression

### 1. Authors and Institution(s)

The research paper "MixCompress: Mixture of Experts for Variable Rate Learned Image Compression" was authored by Calvin-Khang Ta, Praneet Singh, Tong Shao, and Peng Yin. All authors are affiliated with Dolby Laboratories, USA.

### 2. How This Work Fits into the Broader Research Landscape

Learned Image Compression (LIC) has emerged as an alternative to traditional image codecs by optimizing non-linear transforms and entropy models end-to-end for a rate-distortion objective. Early advancements in LIC involved hierarchical hyper-priors, joint autoregressive modeling, and refined context modeling. More recent developments have incorporated Transformer and linear-attention architectures, such as LALIC, LIC-TCM, and FAT, to enhance representational power and maintain practical decoding complexity, establishing LIC as a high-performance solution for image coding.

Despite these advances, a significant limitation of state-of-the-art LIC models is the requirement for separate, independently trained models for each specific rate-distortion operating point. This leads to increased training costs, substantial storage overhead for multiple checkpoints, and increased deployment complexity.

Variable Bit-Rate (VBR) LIC methods aim to address this limitation by enabling a single unified model to support multiple operating points. Existing VBR approaches typically condition a shared dense backbone using techniques such as latent gain scaling, global affine transformations, or conditional convolutions. While these methods simplify deployment, they often exhibit a performance gap compared to single-rate models optimized for specific bit-rates. This performance degradation is attributed to a fundamental optimization challenge: dense parameter modulation forces the shared backbone to approximate divergent rate-distortion mappings, leading to "feature entanglement" or "gradient conflict." Specifically, the gradients required for low-rate smoothing can conflict with those for high-rate detail preservation, leading to suboptimal performance across the rate spectrum.

This work introduces a framework that integrates sparsely gated Mixture-of-Experts (MoE) architectures, previously demonstrated in large-scale natural language processing and vision models (e.g., GShard, Switch Transformer, Vision MoE), into the hierarchical transform-based LIC paradigm. MoE allows for conditional computation and structural specialization, offering a potential solution to the gradient conflict observed in dense VBR methods. The paper also builds upon the concept of auxiliary wavelet shortcuts (AuxT) which accelerate training by offloading feature decorrelation, extending it to a rate-aware variant. By combining structural specialization with dynamic capacity allocation and rate-adaptive feature modulation, MixCompress aims to overcome the limitations of current VBR LICs and establish a more efficient and higher-performing unified compression framework.

### 3. Key Objectives and Motivation

The central objective of this research is to develop a unified variable bit-rate (VBR) learned image compression (LIC) framework that can effectively support a wide range of rate-distortion operating points within a single model, without compromising performance compared to, or even surpassing, individually optimized single-rate models. This framework aims to significantly reduce the computational, storage, and deployment overhead associated with managing multiple single-rate LIC models.

The primary motivation stems from an identified limitation in existing VBR LIC methods:
1.  **Gradient Interference in Dense Parameter Modulation:** Current VBR approaches rely on conditioning a dense, shared backbone (e.g., via conditional convolutions or latent gain scaling). The authors hypothesize that this forces the network parameters to approximate conflicting mappings across the rate-distortion curve. Specifically, optimizing for low bit-rates often involves smoothing high-frequency details to reduce entropy, while optimizing for high bit-rates requires preserving these details. This creates antagonistic gradients during training, where updates for one rate point can degrade performance for another. The cosine similarity between these divergent task gradients can be negative, leading to suboptimal feature learning and a "capacity bottleneck."
2.  **Lack of Structural Specialization:** Most existing VBR methods adapt representations but do not alter the model's fundamental structure or capacity in a rate-dependent manner. This limits the model's ability to allocate computational resources or specialized processing pathways tailored to the distinct demands of different bit-rate regimes.
3.  **High Overhead of Single-Rate Models:** The practical deployment of high-performance LIC often necessitates training and storing multiple independent models, one for each desired rate point. This leads to substantial training costs, large storage footprints for checkpoints, and increased complexity in managing and deploying codecs across various quality settings.

To address these motivations, the MixCompress framework aims to:
*   **Mitigate Gradient Conflict:** Introduce sparse structural specialization using Mixture-of-Experts (MoE) modules. This allows different "experts" or subnetworks to specialize in handling specific rate regimes, thereby isolating conflicting gradients and preventing destructive interference across the rate-distortion curve.
*   **Enable Dynamic Capacity Allocation:** Extend the MoE concept to a Mixture-of-Depths (MoD) framework, which dynamically scales the model's representational capacity. This means that higher bit-rate settings, which typically require more complex feature representation, can be routed to "deeper" or more computationally intensive experts, while lower bit-rates utilize shallower, more efficient pathways.
*   **Introduce Rate-Aware Feature Energy Compaction:** Implement Conditional Auxiliary Transforms (CAT), a rate-aware extension of wavelet shortcuts. CAT dynamically modulates sub-band energy based on the target bit-rate, allowing for explicit control over detail preservation versus smoothing, without altering the core entropy model. This complements the structural specialization by providing rate-dependent feature conditioning.
*   **Achieve Pareto-Optimal Performance and Efficiency:** Develop a single unified model that can match or exceed the performance of multiple independently trained single-rate models, while simultaneously reducing the overall parameter count, training time, and storage footprint.

### 4. Methodology and Approach

MixCompress integrates three primary components: sparsely gated Mixture-of-Experts (MoE) or Mixture-of-Depths (MoD) modules, and Conditional Auxiliary Transforms (CAT), within a standard learned image compression (LIC) backbone. The architecture modifies existing LIC codecs by replacing bottleneck blocks in the analysis transform, synthesis transform, and hyper-prior networks with these rate-conditioned modules.

**4.1. Preliminaries: Variable Rate Learned Image Compression**
The framework builds on the standard end-to-end optimized non-linear transform coding. An input image `x` is transformed into a latent representation `y` by an analysis transform `g_a`, and reconstructed as `x̂` by a synthesis transform `g_s`. A hyper-encoder `h_a` maps `y` to a hyper-latent `z`. Both `y` and `z` are quantized to `ŷ` and `ẑ`. The objective function for a single-rate model minimizes `L_λ(θ) = E[λD(x, x̂; θ) + R(ŷ; θ) + R(ẑ; θ)]` for a fixed Lagrange multiplier `λ`. For variable-rate control, the model is trained by sampling `λ` from a distribution `p(λ)` during training, optimizing `L_VBR(θ) = E_λ,x[λD(x, x̂; θ) + R(ŷ; θ) + R(ẑ; θ)]`. The authors articulate that dense parameter modulation (e.g., conditional convolutions or latent scaling) for adapting to varying `λ` leads to "Gradient Interference," where gradients for low bit-rate smoothing conflict with those for high bit-rate detail preservation, resulting in suboptimal performance.

**4.2. Conditional Auxiliary Transforms (CAT)**
To enhance feature energy compaction in a rate-aware manner, MixCompress introduces CAT, an extension of AuxT shortcuts.
*   **Wavelet Decomposition:** Given an intermediate feature map `P`, a 2D Haar discrete wavelet transform (DWT) decomposes it into four frequency sub-bands (`P_LL`, `P_LH`, `P_HL`, `P_HH`). These are then tokenized.
*   **Rate-Conditioned Subband-Aware Scaling:** Each CAT block maintains learnable scaling vectors for each sub-band (`s_base`). A FiLM (Feature-wise Linear Modulation) head, conditioned on a learned embedding of the rate parameter `λ_e`, produces dynamic scaling parameters (`γ_λ`, `β_λ`). These parameters modulate `s_base` to create `s_enc_λ` for encoder-side scaling, which is applied token-wise to the wavelet features. A linear projection maps the scaled tokens to the shortcut output channels, which are then injected residually into the encoder.
*   **Decoder Symmetry (iCAT):** An inverse CAT (iCAT) mirrors the encoder operations on the decoder side, applying reciprocal scaling based on a decoder FiLM head and using an inverse DWT for reconstruction.
*   **Benefit:** CAT/iCAT provides rate-adaptive auxiliary pathways for energy compaction without altering the primary codec structure or entropy model, thereby allowing dynamic adjustment of detail preservation based on `λ`.

**4.3. Mixture of Experts (MoE)**
To address gradient interference, MixCompress incorporates sparsely gated MoE modules.
*   **Sparse Structural Routing:** Instead of dense modulation, MixCompress replaces bottleneck layers with MoE blocks. Given an input feature `f` and a rate embedding `λ_e`, a routing network (conditioned on `λ_e`) generates a probability distribution over `N` parallel expert networks (`E_1, ..., E_N`). A separate `E_global` expert always processes the input to ensure stable information flow. The block's output is the sum of `E_global` and the top-K selected experts (typically K=2).
*   **Gradient Conflict Mitigation:** The key advantage is that the routing mechanism isolates gradient conflicts. The parameters of a MixCompress block are partitioned into shared (`θ_shared`) and routed (`Θ_routed`). While `θ_shared` still receives gradients from all operating points, the inner product of gradients for the `Θ_routed` subspace is bounded by the intersection of active experts for two different rate points (`T_low ∩ T_high`). By reducing the volume of parameters subject to conflicting updates, the overall interference is diminished, shifting gradient dynamics towards orthogonality.
*   **Expert Collapse Prevention:** To prevent a small subset of experts from dominating, additive Gaussian noise (`ϵ`) is injected into the router logits during training. This noise is annealed linearly over epochs, encouraging exploration in early stages and stabilization later.
*   **Task Conditioned Experts & Inference Efficiency:** Since routing and CAT modulations depend only on `λ_e` (independent of the input image `x`), expert assignments and modulation parameters can be precomputed and cached in a lookup table. This introduces negligible routing overhead during inference.

**4.4. Mixture of Depths (MoD) Extension**
To dynamically scale representational capacity for higher bit-rates, a Mixture-of-Depths (MoD) variant is proposed.
*   **Progressive Depth Experts:** In MoD, experts have varying depths. The `i`-th expert is a composite function of `i` nested transformation blocks (e.g., Bi-RWKV blocks for LALIC or convolutional blocks for LIC-TCM). By routing high-rate samples to deeper experts, the model can expand its capacity when required, while lower-rate samples can use shallower, more efficient experts.

**4.5. Experimental Setup**
*   **Training Data:** OpenImages (first 400K images), randomly cropped to 256x256 patches.
*   **Optimization:** Adam, batch size 8.
*   **Rate-Distortion Optimization:** MSE objective, with `λ ∈ {0.0018, 0.0035, 0.0067, 0.0130, 0.0250, 0.0483}`.
*   **Training Schedule:** Unified training for all `λ` values (sampling one `λ` per mini-batch), for the *same total duration* as a single-rate model (40 epochs at 1e-4, 4 at 1e-5, 4 fine-tuning at 512x512 crops).
*   **Model Integration:** Implemented on LALIC and LIC-TCM backbones, with MixCompress blocks replacing the last layer at bottlenecks of analysis, synthesis, and hyper-prior networks.
*   **Configuration:** 32-dimensional `λ_e`, `N=4` experts, `K=2` active experts (plus one shared).

### 5. Main Findings and Results

**5.1. Rate-Distortion Performance (BD-Rate)**
Extensive evaluations demonstrate that MixCompress variants achieve or surpass the performance of individually optimized single-rate baselines, while also outperforming existing dense-modulation variable bit-rate (VBR) methods.
*   **Against Single-Rate Models:** MixCompress-LALIC-MoD consistently achieves significant BD-rate reductions (PSNR) compared to the VTM-23.1 anchor. For example, it reaches -25.73% on CLIC Valid, -28.71% on CLIC Test, and -28.88% on Tecnick, outperforming the single-rate LALIC baseline (e.g., -26.03% on Tecnick) and other strong single-rate architectures like FAT and LIC-TCM. The homogeneous MixCompress-LALIC-MoE also improves upon single-rate LALIC on CLIC and Tecnick. This is achieved despite training a single unified model for the same total duration as one single-rate model.
*   **Against Variable-Rate Models:** Re-implemented dense-modulation VBR strategies, LALIC-QRAF and LALIC-CondConv, exhibited substantial performance degradation, sacrificing 3.7 to 12.0 percentage points of BD-rate relative to single-rate LALIC. In contrast, MixCompress-LALIC-MoE effectively closes this variable-rate gap, and MixCompress-LALIC-MoD surpasses the single-rate counterpart.

**5.2. Gradient Conflict Mitigation**
Empirical validation of the gradient conflict hypothesis was conducted by analyzing layer-wise gradient cosine similarity between extreme rate points (`λ_low` and `λ_high`).
*   Dense baselines (QRAF and CondConv) exhibited distributions with long negative tails, indicating severe gradient conflicts where optimization for one rate point detrimentally affects another.
*   MixCompress successfully shifted the gradient cosine similarity distribution towards zero, implying a reduction in destructive interference and a move towards orthogonal gradient updates. The percentage of encoder layers exhibiting negative gradient cosine similarity was significantly reduced from 78-79% in dense methods to 31% (MoE) and 22% (MoD) in MixCompress variants.

**5.3. Visual Quality**
Qualitative visual comparisons demonstrated that dense-modulation VBR methods, such as QRAF, produced over-smoothed reconstructions at high bit-rates, failing to preserve fine details (e.g., a thin cable in Figure 6). This over-smoothing is consistent with the gradient conflict where low bit-rate objectives influence high bit-rate reconstructions. MixCompress-MoE and MixCompress-MoD successfully preserved these high-frequency details at comparable bit-rates, indicating improved fidelity due to structurally isolated gradients.

**5.4. MoE vs. MoD**
MoD variants consistently outperformed MoE across all benchmarks. This suggests that dynamically scaling representational capacity through depth-adaptive experts provides advantages beyond parameter-only specialization, better meeting the varying computational demands of different bit-rates.

**5.5. Latent Analysis and Capacity Allocation**
*   Channel utilization heatmaps (Figure 7) showed that dense baselines like QRAF forced highly overlapping and entangled parameter usage across all rate points.
*   MixCompress, in contrast, dynamically reallocated capacity, sharing channels between adjacent rates for smooth transitions while decoupling parameters for low and high bit-rates, minimizing gradient conflict.
*   The severe under-performance of LALIC-QRAF was attributed to its latent scaling strategy being nullified by LayerNorm operations in the LALIC backbone, combined with unresolved gradient interference. MixCompress avoids these issues by routing latents through structurally distinct pathways.

**5.6. Computational and Deployment Efficiency**
MixCompress offers significant advantages in deployment efficiency:
*   A single MixCompress-MoD model, the largest variant, uses 156 million total parameters to cover the entire rate-distortion curve, compared to approximately 397 million parameters required for six independently trained single-rate LALIC models.
*   Due to caching of precomputed expert assignments and modulation parameters (as they depend only on `λ_e`), the inference overhead is minimal. Encoding and decoding times show only slight increases compared to a single-rate LALIC model, with manageable memory usage.

**5.7. Ablation Studies**
Ablation studies confirmed the contribution of each component:
*   Standard conditional convolutions (Cond-Conv) showed improvements over VTM-23.1 but underperformed single-rate baselines.
*   Adding static AuxT shortcuts partially mitigated this gap, and replacing them with rate-aware CAT transforms further improved performance.
*   Replacing Cond-Conv with MoE blocks narrowed the performance gap, and MoD blocks consistently yielded the strongest BD-Rate performance, surpassing single-rate baselines. This confirms that sparse expert specialization and depth-adaptive capacity allocation are more effective than dense weight modulation for VBR LIC.

### 6. Significance and Potential Impact

MixCompress presents a significant contribution to the field of learned image compression, particularly in the domain of variable bit-rate (VBR) coding. Its primary significance lies in addressing the long-standing challenge of achieving high-performance VBR image compression from a single unified model without the performance degradation typically associated with such approaches.

The potential impacts are multifaceted:
1.  **Advancement in VBR LIC Performance:** By demonstrating that a single VBR model can not only match but often surpass the rate-distortion performance of individually optimized single-rate baselines, MixCompress establishes a new benchmark. This fundamentally challenges the previous understanding that a trade-off between variable-rate capability and peak performance was inevitable due to issues like gradient conflict.
2.  **Overcoming Gradient Interference:** The research empirically validates the concept of gradient interference in dense-modulation VBR methods and successfully introduces sparse structural specialization (MoE/MoD) as an effective mechanism for its mitigation. This provides both a practical solution and a theoretical insight into optimizing multi-objective learning problems in image compression.
3.  **Enhanced Deployment Efficiency:** MixCompress drastically reduces the practical overhead associated with deploying learned codecs. Replacing multiple single-rate checkpoints with a single unified model leads to substantial reductions in storage requirements, simplifies model management, and streamlines deployment pipelines in real-world applications. This also implies reduced training costs and computational resources.
4.  **Flexible and Scalable Architectures:** The integration of Mixture-of-Experts and Mixture-of-Depths provides a blueprint for building more flexible and scalable compression architectures. Dynamically allocated capacity based on rate demands allows for efficient resource utilization, enabling the model to adapt its complexity to encode images at various quality levels without sacrificing performance.
5.  **New Pareto Frontier:** The authors claim to establish a new Pareto frontier for practical neural image compression. This implies achieving superior rate-distortion performance and representational density from a single model, with minimal additional inference cost, compared to prior methods. This could accelerate the adoption of learned image compression in commercial products and services requiring adaptive quality control.

In conclusion, MixCompress offers a robust, efficient, and high-performing solution for variable bit-rate learned image compression, addressing critical limitations of prior work and paving the way for more practical and adaptable neural codecs.
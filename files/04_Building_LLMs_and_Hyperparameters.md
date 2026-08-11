# Building LLMs & Defining Parameters — Foundations Guide

This document covers: what an LLM is made of, how one is actually built from scratch (pretraining → fine-tuning → alignment), and how to define/choose every major parameter and hyperparameter along the way.

---

## 1. What an LLM Actually Is

At its core, an LLM is a **Transformer neural network** trained to predict the next token in a sequence, given all previous tokens — repeated at massive scale. Everything else (chat behavior, reasoning, tool use) emerges from that simple objective plus later training stages.

```
Text → Tokenizer → Token IDs → Embeddings → Transformer Blocks (×N) → Output Probabilities → Sampled Token
```

### 1.1 Tokenization

Text is split into subword units ("tokens") using algorithms like **BPE (Byte-Pair Encoding)**, **WordPiece**, or **SentencePiece**. This balances vocabulary size against sequence length — whole-word vocabularies are huge and can't handle unseen words; character-level is small but makes sequences very long.

Example: `"unbelievable"` might tokenize as `["un", "believ", "able"]`.

**Key parameter:** `vocab_size` — number of unique tokens the model knows (e.g., 32K–128K+ common in modern LLMs). Larger vocab → shorter sequences per sentence, but bigger embedding/output layers.

### 1.2 Embeddings

Each token ID is mapped to a dense vector via an embedding lookup table of shape `[vocab_size, d_model]`. Since raw token IDs carry no meaning (ID 5 isn't "more" than ID 3 in any way), embeddings let the model learn a meaningful geometric space where similar tokens end up nearby.

**Positional information:** Since Transformers process all tokens in parallel (no inherent sense of order like an RNN has), position must be injected separately:
- **Absolute positional embeddings** — a learned or fixed vector added per position.
- **RoPE (Rotary Position Embedding)** — rotates query/key vectors based on position, used in most modern LLMs (LLaMA, Mistral, etc.) because it generalizes better to longer sequences than absolute embeddings.
- **ALiBi** — adds a distance-based penalty directly to attention scores.

### 1.3 Self-Attention (the core mechanism)

For every token, the model computes three vectors via learned weight matrices: **Query (Q)**, **Key (K)**, **Value (V)**.

```
Attention(Q, K, V) = softmax( QKᵀ / √d_k ) × V
```

**Intuition:**
- Query = "what am I looking for?"
- Key = "what do I contain?" (for every other token)
- Dot product of Q and K = how relevant each other token is to this one
- Softmax turns those relevance scores into weights summing to 1
- Weighted sum of Values = the token's new, context-aware representation

`√d_k` scaling prevents dot products from growing too large and pushing softmax into regions with near-zero gradients.

**Multi-Head Attention:** Instead of one attention computation, the model runs several in parallel ("heads"), each potentially learning to attend to different kinds of relationships (e.g., one head tracks syntax, another tracks coreference), then concatenates and projects the results back down.

**Causal masking:** For autoregressive generation, each token is only allowed to attend to itself and previous tokens (not future ones) — enforced by masking out future positions in the attention score matrix before softmax.

### 1.4 The Transformer Block

Each of the N stacked layers contains:

```
x → LayerNorm → Multi-Head Self-Attention → +residual →
    LayerNorm → Feed-Forward Network (MLP) → +residual → output
```

- **Residual connections** (`x + sublayer(x)`) let gradients flow directly through the network even when it's very deep, preventing vanishing gradients.
- **Layer Normalization** stabilizes training by normalizing activations; modern LLMs typically use "pre-norm" (normalize before the sublayer) for training stability at scale, and often RMSNorm (a simplified, faster variant) instead of full LayerNorm.
- **Feed-Forward Network (FFN/MLP)** — two linear layers with a non-linearity between them (commonly SwiGLU or GELU in modern models), applied independently to each token position; this is where most of the model's parameters and "knowledge storage" capacity actually live.

### 1.5 Output Layer

The final hidden states are projected back to vocabulary size (`d_model → vocab_size`) and passed through softmax to get a probability distribution over the next token. Many models tie this output projection matrix to the input embedding matrix (**weight tying**) to save parameters.

---

## 2. Model Size / Parameter Count

"7B", "70B", "405B" etc. refer to the total number of learnable weights.

**Where parameters live (rough breakdown for a decoder-only Transformer):**
- Embedding matrix: `vocab_size × d_model`
- Per layer: Attention projections (Q,K,V,O) + FFN weights — FFN is usually the majority (FFN hidden dim is typically 4× `d_model`, or ~2.7× with SwiGLU-style gating)
- Total ≈ `n_layers × 12 × d_model²` (a common rule-of-thumb approximation for standard Transformer configurations)

**Why parameter count matters:** Larger models generally have more capacity to learn complex patterns (better performance, up to data/compute limits), but cost more to train, run (VRAM — see Document 2 §4.5), and serve.

**Scaling laws:** Research (e.g., Chinchilla) found that for a fixed compute budget, there's an optimal balance between model size and training data size — historically many models were "undertrained" (too many parameters relative to training tokens); the modern convention is roughly ~20 tokens of training data per parameter as a starting rule of thumb, though later models often go well beyond that for better inference-time efficiency.

---

## 3. How an LLM Is Actually Built — The Full Pipeline

### Stage 1: Data Collection & Preprocessing

- Gather massive text corpora (web crawls, books, code, papers).
- **Deduplication** — remove near-duplicate documents (improves training efficiency and reduces memorization of repeated content).
- **Filtering** — remove low-quality, toxic, or irrelevant content; often via classifiers trained to score document quality.
- **Tokenization** — convert the entire cleaned corpus into token IDs using the chosen tokenizer.

### Stage 2: Pretraining

The model is trained from randomly initialized weights on the **next-token prediction** objective across the entire corpus — this is by far the most compute-expensive stage (can cost from thousands to tens of millions of dollars in compute depending on model scale).

**Loss function:** Cross-entropy between predicted next-token distribution and the actual next token.

```
Loss = − (1/N) Σ log P(actual_token_i | previous tokens)
```

(Note: `exp(Loss)` is exactly the Perplexity metric from Document 2 §1.1 — pretraining loss and perplexity are directly connected.)

**What the model learns at this stage:** Grammar, facts, reasoning patterns, world knowledge, style — purely from predicting text, with no explicit "instructions." This produces a **base model** — capable of continuing text plausibly, but not yet good at following instructions or having a conversation.

### Stage 3: Supervised Fine-Tuning (SFT)

The base model is further trained on a smaller, curated dataset of high-quality (instruction, response) pairs — teaching it to behave like an assistant rather than just continuing arbitrary text.

**Data format example:**
```
{"instruction": "Explain photosynthesis simply", "response": "Photosynthesis is how plants..."}
```

Same next-token-prediction loss as pretraining, just applied to this curated instruction dataset, and usually only the "response" portion is included in the loss (the model isn't penalized for not predicting the given instruction).

### Stage 4: Alignment — RLHF / DPO

Further tunes the model to prefer responses humans actually rate as better — not just plausible-sounding text, but *helpful, harmless, honest* by some human standard.

**RLHF (Reinforcement Learning from Human Feedback):**
1. Collect pairs of model responses to the same prompt, have humans rank which is better.
2. Train a **Reward Model** to predict human preference scores from those rankings.
3. Fine-tune the LLM using reinforcement learning (commonly **PPO** — Proximal Policy Optimization) to maximize the reward model's score, while a KL-divergence penalty keeps the model from drifting too far from the SFT model (to avoid "reward hacking" — degenerate outputs that game the reward model without actually being good).

**DPO (Direct Preference Optimization):** A simpler, increasingly popular alternative that skips training a separate reward model and doing RL entirely — it directly optimizes the LLM on preference pairs (chosen vs. rejected response) using a closed-form loss derived to have the same optimal solution as RLHF, but via straightforward supervised-style training. Cheaper and more stable to implement than full RLHF.

### Stage 5 (Optional): Parameter-Efficient Fine-Tuning (PEFT)

For adapting an existing pretrained model to a specific task/domain without full retraining:

- **LoRA (Low-Rank Adaptation):** Freezes the original model weights and injects small trainable low-rank matrices into each layer (`ΔW = A × B`, where A and B are much smaller than the original weight matrix). Drastically reduces the number of trainable parameters (often <1% of the full model) and memory needed for fine-tuning.
- **QLoRA:** LoRA combined with 4-bit quantization of the frozen base model, further cutting memory requirements — makes fine-tuning large models feasible on a single consumer/prosumer GPU.
- **Full fine-tuning:** Updates all weights — best quality ceiling but requires much more compute/memory and risks "catastrophic forgetting" of general capabilities if not done carefully.

**Key LoRA hyperparameters:** `rank (r)` — dimensionality of the low-rank matrices (higher = more capacity, more parameters, typical range 4–64), `alpha` — scaling factor for the LoRA update magnitude, `target_modules` — which weight matrices to apply LoRA to (commonly attention Q/K/V/O projections).

### Minimal Pretraining Code Skeleton (illustrative, not production-scale)

```python
import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModelForCausalLM, AutoConfig, Trainer, TrainingArguments

# 1. Define architecture (small example config)
config = AutoConfig.from_pretrained("gpt2")  # or define your own Transformer config
config.n_layer = 12
config.n_head = 12
config.n_embd = 768

model = AutoModelForCausalLM.from_config(config)  # randomly initialized weights
tokenizer = AutoTokenizer.from_pretrained("gpt2")

# 2. Prepare tokenized dataset (conceptual)
def tokenize_fn(examples):
    return tokenizer(examples["text"], truncation=True, max_length=1024)

tokenized_dataset = raw_dataset.map(tokenize_fn, batched=True)

# 3. Train with next-token-prediction objective
training_args = TrainingArguments(
    output_dir="./my-llm",
    per_device_train_batch_size=8,
    gradient_accumulation_steps=4,
    learning_rate=3e-4,
    warmup_steps=2000,
    num_train_epochs=1,
    weight_decay=0.1,
    lr_scheduler_type="cosine",
    bf16=True,
)

trainer = Trainer(model=model, args=training_args, train_dataset=tokenized_dataset)
trainer.train()
```

---

## 4. Defining Training Hyperparameters — In Depth

### 4.1 Learning Rate

**Definition:** How large a step the optimizer takes when updating weights based on the computed gradient.

```
w_new = w_old − learning_rate × gradient
```

- Too high → training diverges or oscillates, loss spikes.
- Too low → training is painfully slow, may get stuck in poor local minima.

**In practice:** Almost never constant. Uses a **schedule**:
- **Warmup** — start near zero and linearly increase over the first few hundred/thousand steps, to avoid destabilizing the randomly-initialized model with large early updates.
- **Decay** — after warmup, gradually reduce (commonly via a cosine curve down to a small fraction of the peak, or linear decay) so training settles into a more precise minimum by the end.

Typical peak values: ~1e-4 to 6e-4 for pretraining from scratch; much smaller (1e-5 to 5e-5) for fine-tuning an existing model, since you're making small adjustments to already-good weights rather than learning from nothing.

### 4.2 Batch Size

**Definition:** Number of training examples processed together before one weight update.

- Larger batch → more stable/accurate gradient estimates, better GPU utilization, but more memory required and can generalize slightly worse without other adjustments.
- Smaller batch → noisier gradients (can act as a regularizer), less memory, but slower wall-clock training due to less parallelism.

**Gradient Accumulation:** Simulates a larger effective batch size than fits in memory by computing gradients over several smaller "micro-batches" and summing them before applying one weight update.

```
effective_batch_size = per_device_batch_size × gradient_accumulation_steps × num_gpus
```

### 4.3 Epochs / Training Steps

**Epoch:** One full pass through the training dataset. **Step:** One weight update (one batch processed).

For LLM pretraining on massive web-scale corpora, models are typically trained for a *fraction* of an epoch to a few epochs at most (repeating data too many times can hurt generalization and cause memorization); fine-tuning on small curated datasets often uses more epochs (2–5) since the dataset is small enough that more passes are useful.

### 4.4 Context Length (Sequence Length / Context Window)

**Definition:** The maximum number of tokens the model can process in a single forward pass — determines how much text (conversation history, document, etc.) the model can "see" at once.

**Cost implication:** Self-attention's compute and memory scale **quadratically** with sequence length (comparing every token to every other token), i.e., `O(n²)`, which is why extending context length is a major engineering challenge (addressed via techniques like sparse/sliding-window attention, or efficient attention implementations like FlashAttention that reduce memory overhead without changing the math).

### 4.5 Weight Decay

**Definition:** A regularization term (L2 penalty) added to the loss that discourages weights from growing too large, applied by slightly shrinking weights toward zero at every update step — helps prevent overfitting.

```
Loss_total = Loss_task + weight_decay × Σw²
```

Typical value: ~0.01–0.1 for LLM training.

### 4.6 Optimizer Choice & Its Hyperparameters

**Adam / AdamW** is the near-universal choice for training Transformers. AdamW decouples weight decay from the gradient-based update (fixing a subtle flaw in plain Adam), and is the standard.

Adam-specific hyperparameters:
- `β1` (typically 0.9) — momentum term, exponential decay rate for the running average of gradients.
- `β2` (typically 0.95–0.999) — decay rate for the running average of squared gradients (controls adaptive per-parameter learning rate scaling).
- `ε` (typically 1e-8) — small constant added for numerical stability, avoiding division by zero.

### 4.7 Dropout

**Definition:** During training, randomly zeroes a fraction of neuron activations at each step, forcing the network to not over-rely on any single neuron/pathway — a regularization technique to reduce overfitting.

`dropout_rate` (e.g., 0.1) is applied within attention and FFN sublayers. Note: modern very-large-scale LLM pretraining sometimes uses little to no dropout, since the training data is so vast relative to model capacity that overfitting is less of a concern than in smaller-data regimes.

### 4.8 Gradient Clipping

**Definition:** Caps the magnitude of gradients before the weight update, preventing occasional huge gradients (from unusual batches) from destabilizing training with a massive weight jump.

```
if ||gradient|| > max_norm:
    gradient = gradient × (max_norm / ||gradient||)
```

Typical `max_norm`: 1.0.

### 4.9 Training Hyperparameters — Summary Table

| Hyperparameter | Typical range (pretraining) | Typical range (fine-tuning) | Main effect |
|---|---|---|---|
| Learning rate (peak) | 1e-4 – 6e-4 | 1e-5 – 5e-5 | Step size of weight updates |
| Batch size (effective) | 0.5M – 4M+ tokens | Thousands to tens of thousands of tokens | Gradient stability vs. speed |
| Warmup steps | 1,000 – 3,000+ | 0 – few hundred | Training stability at start |
| Weight decay | 0.01 – 0.1 | 0 – 0.01 | Overfitting control |
| Context length | 2K – 128K+ tokens | Matches base model or shorter | How much text model can process at once |
| LoRA rank (if used) | N/A | 4 – 64 | Fine-tuning capacity vs. efficiency |

---

## 5. Inference-Time Parameters (Different from Training Hyperparameters!)

These control how the *already-trained* model generates text — set at request time, not during training.

### 5.1 Temperature

**Definition:** Scales the logits (raw output scores) before softmax, controlling randomness of sampling.

```
P(token) = softmax(logits / temperature)
```

- `temperature → 0` → nearly deterministic, always picks the highest-probability token (greedy-like).
- `temperature = 1` → sampling directly from the model's learned distribution, unmodified.
- `temperature > 1` → flattens the distribution, more randomness/creativity, higher risk of incoherence.

### 5.2 Top-p (Nucleus Sampling)

**Definition:** Instead of considering all tokens, sort by probability and keep only the smallest set whose cumulative probability exceeds `p`, then sample from just that set (renormalized).

Example: `top_p = 0.9` → only sample from the smallest set of tokens whose probabilities sum to 90%, discarding the unlikely long tail entirely.

**Why it's often preferred over temperature alone:** Adapts dynamically — when the model is very confident (one token dominates), the nucleus is small (near-deterministic); when uncertain (probability spread across many tokens), the nucleus is larger (more exploration).

### 5.3 Top-k

**Definition:** Simpler alternative — only consider the `k` highest-probability tokens at each step, discard the rest, then sample (optionally with temperature) from just those.

`top_k = 40` means only the 40 most likely next tokens are ever considered, regardless of how the probability mass is actually distributed.

### 5.4 Repetition / Frequency / Presence Penalties

**Definition:** Reduce the probability of tokens that have already appeared in the output, to discourage repetitive loops.
- **Repetition penalty** — multiplicatively downweights logits of already-used tokens.
- **Frequency penalty** — subtracts a penalty proportional to how *many times* a token has already appeared (heavier penalty for tokens used repeatedly).
- **Presence penalty** — subtracts a flat penalty if a token has appeared *at all* (regardless of count) — encourages introducing new topics/words.

### 5.5 Max Tokens / Stop Sequences

`max_tokens` — hard cap on generation length. `stop` sequences — strings that, once generated, immediately end generation (e.g., stopping at `"\nUser:"` in a chat template to prevent the model from continuing the conversation on the user's behalf).

### 5.6 Inference Parameters — Summary

| Parameter | Controls | Typical value |
|---|---|---|
| Temperature | Overall randomness | 0.0 (deterministic) – 1.0+ (creative); 0.7 common default |
| Top-p | Dynamic cutoff of unlikely tokens | 0.9 – 1.0 |
| Top-k | Fixed cutoff of candidate tokens | 20 – 100, or disabled |
| Repetition penalty | Discourage repeating tokens | 1.0 (off) – 1.3 |
| Max tokens | Output length cap | Task-dependent |

**Practical note:** Temperature and top-p are often used together (e.g., temperature=0.7, top_p=0.9), and both are typically set to near-zero/near-one respectively for tasks needing consistency (code generation, factual QA), and higher for creative tasks (brainstorming, fiction).

---

## 6. From "Model" to "Product" — What Wraps the Raw LLM

- **Chat template** — a fixed format (e.g., `<|user|>...<|assistant|>...`) the model was trained to expect, used to structure multi-turn conversations, system prompts, and tool-call outputs consistently.
- **System prompt** — instructions prepended to every conversation to set behavior/persona/constraints, distinct from the user's actual messages.
- **Tool use / function calling** — the model is trained (usually during SFT) to output structured requests (e.g., JSON) to call external tools, with results fed back into context for it to continue reasoning.
- **RAG** — see Document 5 — augments the model's fixed training-time knowledge with retrieved, up-to-date, or private information at inference time.

This is the layer where "a next-token predictor" becomes "an assistant that can answer questions, use tools, and cite sources" — none of which requires changing the core Transformer architecture, just how it's trained and orchestrated around.

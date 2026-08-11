# LLM Evaluation Metrics — Foundations Guide

```
LLM
├── Language Quality → Perplexity, BLEU, ROUGE, BERTScore
├── Reasoning / Quality → Accuracy, Correctness, Relevance, Faithfulness, Hallucination
├── RAG → Context Recall, Context Precision, Groundedness, Answer Relevancy
└── Deployment → TTFT, Tokens/sec, Latency, Throughput, VRAM
```

---

## 1. Language Quality Metrics

These measure how "good" generated text is, independent of whether the *content* is factually correct.

### 1.1 Perplexity

**Definition:** How "surprised" a language model is by a sequence of text. It's the exponentiated average negative log-likelihood the model assigns to the correct next token, across a sequence.

```
Perplexity = exp( − (1/N) × Σ log P(token_i | previous tokens) )
```

**Interpretation:**
- Lower perplexity = the model assigns higher probability to the real next token = better fit to that data distribution.
- Perplexity of *k* roughly means "the model is as confused as if it were choosing uniformly among k options" at each step.
- A well-trained model on natural English text typically sits in the range of ~10–30 perplexity, depending on the domain and tokenizer.

**When to use:** Comparing base/pretrained language models on the *same* dataset and tokenizer (not comparable across different tokenizers). It measures fluency/fit, **not** correctness, helpfulness, or factuality.

```python
import torch
import torch.nn.functional as F

def perplexity(logits, target_ids):
    # logits: [seq_len, vocab_size], target_ids: [seq_len]
    log_probs = F.log_softmax(logits, dim=-1)
    token_log_probs = log_probs.gather(1, target_ids.unsqueeze(1)).squeeze(1)
    return torch.exp(-token_log_probs.mean())
```

### 1.2 BLEU (Bilingual Evaluation Understudy)

**Definition:** Originally built for machine translation. Measures **n-gram precision** — what fraction of word sequences (n-grams) in the generated text also appear in one or more reference texts, with a penalty for outputs that are too short ("brevity penalty").

```
BLEU = BP × exp( Σ w_n × log(p_n) )
```
where `p_n` is n-gram precision (n = 1 to 4 typically) and BP is the brevity penalty.

**Characteristics:** Precision-oriented (rewards not adding extra words), rewards exact wording matches, penalizes paraphrasing even when meaning is preserved. Score range 0–1 (often shown as 0–100).

**When to use:** Translation quality, or any task with one clear "correct" reference wording. **Weak for:** open-ended generation, summarization, chat — since good answers can be worded many different ways.

```python
from sacrebleu import corpus_bleu
score = corpus_bleu(hypotheses, [references])
print(score.score)
```

### 1.3 ROUGE (Recall-Oriented Understudy for Gisting Evaluation)

**Definition:** The recall-oriented counterpart to BLEU, built for summarization. Measures overlap between generated and reference text.

Common variants:
- **ROUGE-N** — n-gram overlap (ROUGE-1 = unigrams, ROUGE-2 = bigrams)
- **ROUGE-L** — Longest Common Subsequence overlap (captures sentence-level structure, order-sensitive but allows gaps)

```
ROUGE-N (recall) = (matching n-grams) / (n-grams in reference)
```
Precision, recall, and F1 versions are all commonly reported.

**When to use:** Summarization tasks — "did the summary capture what the reference summary captured?" **Weak for:** same issue as BLEU — surface overlap, not meaning.

```python
from rouge_score import rouge_scorer
scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
scores = scorer.score(reference_text, generated_text)
```

### 1.4 BERTScore

**Definition:** Instead of comparing exact words like BLEU/ROUGE, BERTScore embeds both generated and reference text using a pretrained model (e.g., BERT) and compares **semantic similarity** of token embeddings via cosine similarity, then aggregates into precision/recall/F1.

**Why it's better than BLEU/ROUGE for many tasks:** It recognizes that "The cat sat on the mat" and "A feline rested on the rug" are semantically close even though they share almost no words.

**When to use:** Any generation task where paraphrasing is acceptable or expected (most modern LLM tasks). **Trade-off:** more compute-expensive, and quality depends on the embedding model used.

```python
from bert_score import score
P, R, F1 = score(candidates, references, lang="en")
```

### 1.5 Language Quality — Comparison

| Metric | Compares | Sensitive to paraphrase? | Typical use |
|---|---|---|---|
| Perplexity | Model's own probability estimates | N/A (no reference needed) | Pretraining/fine-tuning fit |
| BLEU | Exact n-gram overlap | No (penalizes it) | Translation |
| ROUGE | Exact n-gram / subsequence overlap | No | Summarization |
| BERTScore | Semantic embedding similarity | Yes (rewards it) | Open-ended generation, QA, summarization |

---

## 2. Reasoning / Quality Metrics

These evaluate the *content* of an LLM's output, usually via human judgment, rule-based checks, or another LLM acting as a judge ("LLM-as-judge").

### 2.1 Accuracy

**Definition:** For tasks with a clear right answer (math, multiple-choice, classification via LLM, code-execution tasks), the fraction of outputs that exactly match or satisfy the correct answer.

```
Accuracy = (# correct outputs) / (# total outputs)
```

**Used in:** Benchmark suites like MMLU, GSM8K, HumanEval — anywhere there's a ground-truth answer to check against.

### 2.2 Correctness

**Definition:** Broader than accuracy — whether the factual claims in an open-ended response are true, typically judged by a human rater or an LLM judge comparing the response against a reference answer or known facts, rather than requiring an exact match.

**How it's typically scored:** A rubric or Likert scale (e.g., 1–5), or a binary "correct / incorrect / partially correct" label, since open-ended answers rarely match a reference string exactly.

### 2.3 Relevance

**Definition:** Does the response actually address what was asked, independent of whether it's factually correct? A relevant-but-wrong answer stays on-topic; an irrelevant answer wanders off or answers a different question.

**Typical measurement:** LLM-as-judge prompted to rate "how directly does this response address the user's query" on a scale, or embedding-similarity between the query and response.

### 2.4 Faithfulness

**Definition:** Whether the response is consistent with — and only asserts what is supported by — a given source (e.g., a document, in RAG, or the model's own chain of reasoning). This is distinct from "correctness against the real world" — a response can be faithful to a wrong source and still be unfaithful to reality, or vice versa.

**Typical measurement:** Break the response into individual claims, then check each claim against the source document (often done via an LLM judge or Natural Language Inference (NLI) model classifying each claim as entailed / contradicted / neutral relative to the source).

### 2.5 Hallucination

**Definition:** The rate at which a model generates content that is fabricated — not grounded in its training data, the provided context, or reality — but stated with apparent confidence.

**Types:**
- **Intrinsic hallucination** — contradicts the given source/context directly.
- **Extrinsic hallucination** — adds unverifiable information not present in the source (may or may not be true, but isn't traceable to anything given).

**Typical measurement:**
```
Hallucination Rate = (# claims not supported by source or fact) / (# total claims made)
```
Measured via fact-checking pipelines, NLI-based entailment checking, or LLM-as-judge against retrieved/ground-truth documents. This is essentially "1 − Faithfulness" when there's a defined source to check against.

### 2.6 How These Are Actually Measured in Practice

Since most reasoning/quality metrics don't have a formula (unlike classification metrics), three main methods are used:

1. **Human evaluation** — gold standard, expensive, slow, doesn't scale.
2. **LLM-as-judge** — a strong LLM (e.g., a frontier model) is prompted with the question, the response, and a rubric, and asked to score it. Scales well, correlates reasonably with human judgment, but inherits the judge model's own biases (e.g., preferring longer or more confident-sounding answers).
3. **Rule-based / programmatic checks** — for tasks with verifiable answers: exact match, regex, code execution + test cases, math answer parsing.

---

## 3. RAG-Specific Metrics

These evaluate a Retrieval-Augmented Generation pipeline specifically — see Document 5 (RAG Deep Dive) for the full architecture. Each metric targets either the **retrieval** half or the **generation** half of the pipeline.

### 3.1 Context Precision

**Definition:** Of the chunks/documents retrieved, what fraction are actually relevant to the query? Measures whether the retriever is bringing back noise.

```
Context Precision = (# relevant retrieved chunks) / (# total retrieved chunks)
```

Often computed with rank-weighting (relevant chunks ranked higher score better), similar in spirit to precision@k.

### 3.2 Context Recall

**Definition:** Of all the information actually needed to answer the query, what fraction was present *somewhere* in the retrieved context? Measures whether the retriever is missing important information.

```
Context Recall = (# necessary facts present in retrieved context) / (# necessary facts to answer the query)
```

**Trade-off with precision:** Retrieving more chunks (higher k) tends to raise recall but lower precision — the classic precision/recall trade-off, applied to retrieval instead of classification.

### 3.3 Groundedness (a.k.a. Faithfulness in RAG context)

**Definition:** Does the generated answer's content actually come from the retrieved context, rather than the model's own (possibly hallucinated) prior knowledge?

```
Groundedness = (# claims in answer supported by retrieved context) / (# total claims in answer)
```

This is the RAG-specific application of the general "Faithfulness" metric from Section 2.4, with the retrieved context as the source of truth.

### 3.4 Answer Relevancy

**Definition:** Does the generated answer actually address the user's original question, regardless of whether it's grounded in the context? A common trick to measure this: generate several hypothetical questions that the answer *would* be a good response to, then compute embedding similarity between those generated questions and the original question — high similarity implies the answer is on-topic.

### 3.5 How the Four RAG Metrics Fit Together

| | Evaluates | Failure mode it catches |
|---|---|---|
| Context Precision | Retriever | Retrieving irrelevant/noisy chunks |
| Context Recall | Retriever | Missing necessary information entirely |
| Groundedness | Generator | Model hallucinating beyond the retrieved context |
| Answer Relevancy | Generator | Model answering a different question than asked |

**Practical note:** Frameworks like **RAGAS** and **TruLens** implement all four automatically using an LLM judge, and are the standard tooling for this in practice.

```python
from ragas import evaluate
from ragas.metrics import context_precision, context_recall, faithfulness, answer_relevancy

results = evaluate(
    dataset,  # contains question, answer, contexts, ground_truth
    metrics=[context_precision, context_recall, faithfulness, answer_relevancy],
)
```

---

## 4. Deployment / Inference Metrics

These measure system performance, not output quality — critical for production LLM serving.

### 4.1 TTFT — Time To First Token

**Definition:** Latency from when a request is sent to when the *first* output token is generated/streamed back to the user. Dominated by the "prefill" phase (processing the entire input prompt through the model once).

**Why it matters:** For chat UIs, TTFT is what the user perceives as "responsiveness" — even if total generation takes a while, a fast first token makes the app feel snappy.

### 4.2 Tokens/sec (Generation Speed)

**Definition:** Rate at which output tokens are generated after the first token, i.e. the "decode" phase speed.

```
Tokens/sec = (total output tokens generated) / (total decode time)
```

**Depends on:** model size, hardware (GPU type/count), batching, quantization, and whether techniques like speculative decoding are used.

### 4.3 Latency

**Definition:** Total end-to-end time for a complete response — TTFT + (decode time for all output tokens). Sometimes reported as p50/p90/p99 percentiles rather than an average, since tail latency matters a lot for user experience and SLAs.

### 4.4 Throughput

**Definition:** How many requests (or total tokens across all concurrent requests) the serving system can handle per unit time — a system-level metric, not a single-request metric.

```
Throughput = (total tokens processed across all requests) / (time)
```

**Trade-off:** Throughput and per-request latency usually trade off against each other via batching — bigger batches raise total throughput but can raise the latency of any individual request, since it waits alongside others in the batch.

### 4.5 VRAM (GPU Memory Usage)

**Definition:** GPU memory required to load and run the model. Roughly:

```
VRAM ≈ (Model weights) + (KV cache) + (activation memory) + (overhead)
```

Rough sizing formula for weights alone: `params × bytes_per_param`
- FP32 → 4 bytes/param
- FP16/BF16 → 2 bytes/param
- INT8 → 1 byte/param
- INT4 → 0.5 bytes/param

Example: A 7B-parameter model in FP16 needs roughly `7B × 2 bytes ≈ 14 GB` just for weights, before accounting for KV cache (which grows with context length and batch size) and activations.

**Why it matters:** Directly determines what hardware you need and how many concurrent users you can serve; quantization (reducing bytes/param) is the main lever to reduce it, at some cost to output quality.

### 4.6 Deployment Metrics — Summary

| Metric | What it measures | Primary lever to improve it |
|---|---|---|
| TTFT | Responsiveness of first output | Prompt length, prefill optimization, hardware |
| Tokens/sec | Generation speed | Model size, quantization, batching, hardware |
| Latency | Total time for a full response | All of the above combined |
| Throughput | System-wide capacity | Batching, hardware count, request scheduling |
| VRAM | Memory footprint | Quantization, model size, context length, batch size |

---

## 5. Putting It Together — Which Metrics for Which Situation

| Situation | Metrics to prioritize |
|---|---|
| Comparing base/pretrained LLMs | Perplexity + benchmark accuracy (MMLU, etc.) |
| Fine-tuning a summarizer | ROUGE, BERTScore, human eval for correctness |
| Building a chatbot/assistant | Relevance, Correctness, Hallucination rate, LLM-as-judge scores |
| Building a RAG system | All 4 RAG metrics (Context Precision/Recall, Groundedness, Answer Relevancy) |
| Shipping to production | TTFT, Tokens/sec, Latency (p99), Throughput, VRAM budget |
